import path from 'path';

import { Plugin } from '@nocobase/server';
import { Registry } from '@nocobase/utils';
import { Op } from '@nocobase/database';
import { HandlerType } from '@nocobase/resourcer';
import { Context } from '@nocobase/actions';

import initProviders, { Provider } from './providers';
import initActions from './actions';
import { CODE_STATUS_UNUSED, CODE_STATUS_USED, PROVIDER_TYPE_SMS_ALIYUN } from './constants';
import { namespace } from '.';
import { zhCN } from './locale';

export interface Interceptor {
  manual?: boolean;
  provider: string;
  expiresIn?: number;
  getReceiver(ctx): string;
  getCode?(ctx): string;
  validate?(ctx: Context, receiver: string): boolean | Promise<boolean>;
};

export default class VerificationPlugin extends Plugin {
  providers: Registry<typeof Provider> = new Registry();
  interceptors: Registry<Interceptor> = new Registry();

  intercept: HandlerType = async (context, next) => {
    const { resourceName, actionName, values } = context.action.params;
    const key = `${resourceName}:${actionName}`;
    const interceptor = this.interceptors.get(key);

    if (!interceptor) {
      return context.throw(400);
    }

    const receiver = interceptor.getReceiver(context);
    const content = interceptor.getCode ? interceptor.getCode(context) : values.code;
    if (!receiver || !content) {
      return context.throw(400);
    }

    // check if code match, then call next
    // find the code based on action params
    const VerificationRepo = this.db.getRepository('verifications');
    const item = await VerificationRepo.findOne({
      filter: {
        receiver,
        type: key,
        content,
        expiresAt: {
          [Op.gt]: new Date()
        },
        status: CODE_STATUS_UNUSED
      }
    });

    if (!item) {
      return context.throw(400, { code: 'InvalidSMSCode', message: 'verify by sms code failed' });
    }

    // TODO: code should be removed if exists in values
    // context.action.mergeParams({
    //   values: {

    //   }
    // });

    await next();

    // or delete
    await item.update({
      status: CODE_STATUS_USED
    });
  }


  getName(): string {
    return this.getPackageName(__dirname);
  }

  async install() {
    const {
      DEFAULT_SMS_VERIFY_CODE_PROVIDER,
      INIT_ALI_SMS_ACCESS_KEY,
      INIT_ALI_SMS_ACCESS_KEY_SECRET,
      INIT_ALI_SMS_ENDPOINT = 'dysmsapi.aliyuncs.com',
      INIT_ALI_SMS_VERIFY_CODE_TEMPLATE,
      INIT_ALI_SMS_VERIFY_CODE_SIGN
    } = process.env;

    if (INIT_ALI_SMS_ACCESS_KEY
      && INIT_ALI_SMS_ACCESS_KEY_SECRET
      && INIT_ALI_SMS_VERIFY_CODE_TEMPLATE
      && INIT_ALI_SMS_VERIFY_CODE_SIGN
    ) {
      const ProviderRepo = this.db.getRepository('verifications_providers');
      await ProviderRepo.create({
        values: {
          id: DEFAULT_SMS_VERIFY_CODE_PROVIDER,
          type: PROVIDER_TYPE_SMS_ALIYUN,
          title: 'Default SMS sender',
          options: {
            accessKeyId: INIT_ALI_SMS_ACCESS_KEY,
            accessKeySecret: INIT_ALI_SMS_ACCESS_KEY_SECRET,
            endpoint: INIT_ALI_SMS_ENDPOINT,
            sign: INIT_ALI_SMS_VERIFY_CODE_SIGN,
            template: INIT_ALI_SMS_VERIFY_CODE_TEMPLATE
          }
        }
      });
    }
  }

  async load() {
    const { app, db, options } = this;

    app.i18n.addResources('zh-CN', namespace, zhCN);

    await db.import({
      directory: path.resolve(__dirname, 'collections'),
    });

    initProviders(this);
    initActions(this);

    // add middleware to action
    app.resourcer.use(async (context, next) => {
      const { resourceName, actionName, values } = context.action.params;
      const key = `${resourceName}:${actionName}`;
      const interceptor = this.interceptors.get(key);
      if (!interceptor || interceptor.manual) {
        return next();
      }

      return this.intercept(context, next);
    });

    app.acl.allow('verifications', 'create');
  }
}

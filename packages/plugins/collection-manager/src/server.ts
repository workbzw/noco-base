import path from 'path';

import lodash from 'lodash';
import { UniqueConstraintError } from 'sequelize';

import PluginErrorHandler from '@nocobase/plugin-error-handler';
import { Plugin } from '@nocobase/server';

import { CollectionRepository } from '.';
import {
  afterCreateForReverseField,
  beforeCreateForChildrenCollection,
  beforeCreateForReverseField,
  beforeInitOptions,
} from './hooks';
import { CollectionModel, FieldModel } from './models';

export class CollectionManagerPlugin extends Plugin {
  async beforeLoad() {
    this.app.db.registerModels({
      CollectionModel,
      FieldModel,
    });

    this.db.addMigrations({
      namespace: 'collection-manager',
      directory: path.resolve(__dirname, './migrations'),
      context: {
        plugin: this,
      },
    });

    this.app.db.registerRepositories({
      CollectionRepository,
    });

    this.app.db.on('fields.beforeUpdate', async (model, options) => {
      const newValue = options.values;
      if (
        model.get('reverseKey') &&
        lodash.get(newValue, 'reverseField') &&
        !lodash.get(newValue, 'reverseField.key')
      ) {
        const field = await this.app.db
          .getModel('fields')
          .findByPk(model.get('reverseKey'), { transaction: options.transaction });
        if (field) {
          throw new Error('cant update field without a reverseField key');
        }
      }
    });

    // 要在 beforeInitOptions 之前处理
    this.app.db.on('fields.beforeCreate', beforeCreateForReverseField(this.app.db));
    this.app.db.on('fields.beforeCreate', beforeCreateForChildrenCollection(this.app.db));
    this.app.db.on('fields.beforeCreate', async (model, options) => {
      const type = model.get('type');
      await this.app.db.emitAsync(`fields.${type}.beforeInitOptions`, model, {
        ...options,
        database: this.app.db,
      });
    });

    for (const key in beforeInitOptions) {
      if (Object.prototype.hasOwnProperty.call(beforeInitOptions, key)) {
        const fn = beforeInitOptions[key];
        this.app.db.on(`fields.${key}.beforeInitOptions`, fn);
      }
    }

    this.app.db.on('fields.afterCreate', afterCreateForReverseField(this.app.db));

    this.app.db.on('collections.afterCreateWithAssociations', async (model, { context, transaction }) => {
      if (context) {
        await model.migrate({
          isNew: true,
          transaction,
        });
      }
    });

    this.app.db.on('fields.afterCreate', async (model: FieldModel, { context, transaction }) => {
      if (context) {
        await model.migrate({
          isNew: true,
          transaction,
        });
      }
    });

    this.app.db.on('fields.afterUpdate', async (model: FieldModel, { context, transaction }) => {
      const prevOptions = model.previous('options');
      const currentOptions = model.get('options');

      if (context) {
        const prev = prevOptions['unique'];
        const next = currentOptions['unique'];

        if (Boolean(prev) !== Boolean(next)) {
          await model.migrate({ transaction });
        }
      }

      const prevDefaultValue = prevOptions['defaultValue'];
      const currentDefaultValue = currentOptions['defaultValue'];

      if (prevDefaultValue != currentDefaultValue) {
        await model.syncDefaultValue({ transaction, defaultValue: currentDefaultValue });
      }
    });

    this.app.db.on('fields.afterSaveWithAssociations', async (model, { context, transaction }) => {
      if (context) {
        await model.load({ transaction });
      }
    });

    this.app.db.on('fields.beforeDestroy', async (model, options) => {
      await model.remove(options);
    });

    this.app.db.on('collections.beforeDestroy', async (model, options) => {
      await model.remove(options);
    });

    this.app.on('beforeStart', async () => {
      await this.app.db.getRepository<CollectionRepository>('collections').load();
    });

    this.app.on('beforeUpgrade', async () => {
      await this.app.db.getRepository<CollectionRepository>('collections').load();
    });

    this.app.on('cli.beforeMigrator', async () => {
      const exists = await this.app.db.collectionExistsInDb('collections');
      if (exists) {
        await this.app.db.getRepository<CollectionRepository>('collections').load();
      }
    });

    this.app.on('cli.beforeDbSync', async () => {
      const exists = await this.app.db.collectionExistsInDb('collections');
      if (exists) {
        await this.app.db.getRepository<CollectionRepository>('collections').load();
      }
    });

    this.app.resourcer.use(async (ctx, next) => {
      const { resourceName, actionName } = ctx.action;
      if (resourceName === 'collections.fields' && actionName === 'update') {
        const { updateAssociationValues = [] } = ctx.action.params;
        updateAssociationValues.push('uiSchema');
        ctx.action.mergeParams({
          updateAssociationValues,
        });
      }
      await next();
    });

    // this.app.resourcer.use(async (ctx, next) => {
    //   const { resourceName, actionName } = ctx.action;
    //   if (actionName === 'update') {
    //     const { updateAssociationValues = [] } = ctx.action.params;
    //     const [collectionName, associationName] = resourceName.split('.');
    //     if (!associationName) {
    //       const collection: Collection = ctx.db.getCollection(collectionName);
    //       if (collection) {
    //         for (const [, field] of collection.fields) {
    //           if (['subTable', 'o2m'].includes(field.options.interface)) {
    //             updateAssociationValues.push(field.name);
    //           }
    //         }
    //       }
    //     } else {
    //       const association = ctx.db.getCollection(collectionName)?.getField?.(associationName);
    //       if (association?.target) {
    //         const collection: Collection = ctx.db.getCollection(association?.target);
    //         if (collection) {
    //           for (const [, field] of collection.fields) {
    //             if (['subTable', 'o2m'].includes(field.options.interface)) {
    //               updateAssociationValues.push(field.name);
    //             }
    //           }
    //         }
    //       }
    //     }
    //     if (updateAssociationValues.length) {
    //       ctx.action.mergeParams({
    //         updateAssociationValues,
    //       });
    //     }
    //   }
    //   await next();
    // });

    this.app.acl.allow('collections', 'list', 'loggedIn');
    this.app.acl.allow('collections', ['create', 'update', 'destroy'], 'allowConfigure');
  }

  async load() {
    await this.app.db.import({
      directory: path.resolve(__dirname, './collections'),
    });

    const errorHandlerPlugin = <PluginErrorHandler>this.app.getPlugin('@nocobase/plugin-error-handler');
    errorHandlerPlugin.errorHandler.register(
      (err) => {
        return err instanceof UniqueConstraintError;
      },
      (err, ctx) => {
        return ctx.throw(400, ctx.t(`The value of ${Object.keys(err.fields)} field duplicated`));
      },
    );
  }

  getName(): string {
    return this.getPackageName(__dirname);
  }
}

export default CollectionManagerPlugin;

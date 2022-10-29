import { i18n } from '../../i18n';
import { defaultProps, unique } from './properties';
import { IField } from './types';

export const password: IField = {
  name: 'password',
  type: 'object',
  group: 'basic',
  order: 7,
  title: '{{t("Password")}}',
  default: {
    type: 'password',
    hidden: true,
    // name,
    uiSchema: {
      type: 'string',
      // title,
      'x-component': 'Password',
    },
  },
  hasDefaultValue: true,
  properties: {
    ...defaultProps,
    unique,
  },
  validateSchema(fieldSchema) {
    return {
      max: {
        type: 'number',
        title: '{{ t("Max length") }}',
        minimum: 0,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          precision: 0
        },
        'x-reactions': `{{(field) => {
          const targetValue = field.query('.min').value();
          field.selfErrors =
            !!targetValue && !!field.value && targetValue > field.value ? '${i18n.t('Max length must greater than min length')}' : ''
        }}}`,
      },
      min: {
        type: 'number',
        title: '{{ t("Min length") }}',
        minimum: 0,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          precision: 0
        },
        'x-reactions': {
          dependencies: ['.max'],
          fulfill: {
            state: {
              selfErrors: `{{!!$deps[0] && !!$self.value && $deps[0] < $self.value ? '${i18n.t('Min length must less than max length')}' : ''}}`,
            },
          },
        },
      },
    };
  }
};

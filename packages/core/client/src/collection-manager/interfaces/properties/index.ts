import { Field } from '@formily/core';
import { ISchema } from '@formily/react';
import { uid } from '@formily/shared';
export * as operators from './operators';

export const type: ISchema = {
  type: 'string',
  title: '{{t("Storage type")}}',
  required: true,
  'x-disabled': true,
  'x-decorator': 'FormItem',
  'x-component': 'Select',
  enum: [
    { label: 'Boolean', value: 'boolean' },
    { label: 'String', value: 'string' },
    { label: 'Text', value: 'text' },
    { label: 'Integer', value: 'integer' },
    { label: 'Float', value: 'float' },
    { label: 'Double', value: 'double' },
    { label: 'Decimal', value: 'decimal' },
    { label: 'Date', value: 'date' },
    { label: 'DateOnly', value: 'dateonly' },
    { label: 'Time', value: 'time' },
    { label: 'Virtual', value: 'virtual' },
    { label: 'JSON', value: 'json' },
    { label: 'Password', value: 'password' },
    { label: 'One to one', value: 'hasOne' },
    { label: 'One to many', value: 'hasMany' },
    { label: 'Many to one', value: 'belongsTo' },
    { label: 'Many to many', value: 'belongsToMany' },
  ],
};

export const unique = {
  type: 'boolean',
  'x-content': '{{t("Unique")}}',
  'x-decorator': 'FormItem',
  'x-component': 'Checkbox',
};

export const relationshipType: ISchema = {
  type: 'string',
  title: '{{t("Relationship type")}}',
  required: true,
  'x-disabled': true,
  'x-decorator': 'FormItem',
  'x-component': 'Select',
  enum: [
    { label: "{{t('HasOne')}}", value: 'hasOne' },
    { label: "{{t('HasMany')}}", value: 'hasMany' },
    { label: "{{t('BelongsTo')}}", value: 'belongsTo' },
    { label: "{{t('BelongsToMany')}}", value: 'belongsToMany' },
  ],
};

export const reverseFieldProperties: Record<string, ISchema> = {
  reverse: {
    type: 'void',
    'x-component': 'div',
    'x-hidden': '{{ !showReverseFieldConfig }}',
    properties: {
      autoCreateReverseField: {
        type: 'boolean',
        default: true,
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox',
        'x-content': '{{t("Create inverse field in the target collection")}}',
        'x-reactions': [
          {
            target: 'reverseField.type',
            when: '{{!!$self.value}}',
            fulfill: {
              state: {
                hidden: false,
              },
            },
            otherwise: {
              state: {
                hidden: true,
              },
            },
          },
          {
            target: 'reverseField.uiSchema.title',
            when: '{{!!$self.value}}',
            fulfill: {
              state: {
                hidden: false,
              },
            },
            otherwise: {
              state: {
                hidden: true,
              },
            },
          },
          {
            target: 'reverseField.name',
            when: '{{!!$self.value}}',
            fulfill: {
              state: {
                hidden: false,
              },
            },
            otherwise: {
              state: {
                hidden: true,
              },
            },
          },
        ],
      },
      'reverseField.type': {
        ...relationshipType,
        title: '{{t("Inverse relationship type")}}',
      },
      'reverseField.uiSchema.title': {
        type: 'string',
        title: '{{t("Inverse field display name")}}',
        default: '{{record.title}}',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      'reverseField.name': {
        type: 'string',
        title: '{{t("Inverse field name")}}',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': 'uid',
        description:
          "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
      },
    },
  },
};

export const dateTimeProps: { [key: string]: ISchema } = {
  'uiSchema.x-component-props.dateFormat': {
    type: 'string',
    title: '{{t("Date format")}}',
    'x-component': 'Radio.Group',
    'x-decorator': 'FormItem',
    default: 'YYYY-MM-DD',
    enum: [
      {
        label: '{{t("Year/Month/Day")}}',
        value: 'YYYY/MM/DD',
      },
      {
        label: '{{t("Year-Month-Day")}}',
        value: 'YYYY-MM-DD',
      },
      {
        label: '{{t("Day/Month/Year")}}',
        value: 'DD/MM/YYYY',
      },
    ],
  },
  'uiSchema.x-component-props.showTime': {
    type: 'boolean',
    'x-decorator': 'FormItem',
    'x-component': 'Checkbox',
    'x-content': '{{t("Show time")}}',
    'x-reactions': [
      `{{(field) => {
        field.query('..[].timeFormat').take(f => {
          f.display = field.value ? 'visible' : 'none';
        });
      }}}`,
    ],
  },
  'uiSchema.x-component-props.timeFormat': {
    type: 'string',
    title: '{{t("Time format")}}',
    'x-component': 'Radio.Group',
    'x-decorator': 'FormItem',
    default: 'HH:mm:ss',
    enum: [
      {
        label: '{{t("12 hour")}}',
        value: 'hh:mm:ss a',
      },
      {
        label: '{{t("24 hour")}}',
        value: 'HH:mm:ss',
      },
    ],
  },
};

export const dataSource: ISchema = {
  type: 'array',
  title: '{{t("Options")}}',
  'x-decorator': 'FormItem',
  'x-component': 'ArrayTable',
  'x-component-props': {
    pagination: {
      pageSize: 1000,
    },
    // scroll: { x: '100%' },
  },
  items: {
    type: 'object',
    properties: {
      column1: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { width: 50, title: '', align: 'center' },
        properties: {
          sort: {
            type: 'void',
            'x-component': 'ArrayTable.SortHandle',
          },
        },
      },
      column2: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { title: '{{t("Option value")}}' },
        // 'x-hidden': true,
        properties: {
          value: {
            type: 'string',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-reactions': (field: Field) => {
              if (!field.initialValue) {
                field.initialValue = uid();
              }
            },
          },
        },
      },
      column3: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { title: '{{t("Option label")}}' },
        properties: {
          label: {
            type: 'string',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      column4: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { title: '{{t("Color")}}' },
        properties: {
          color: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'ColorSelect',
          },
        },
      },
      column5: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: '',
          dataIndex: 'operations',
          fixed: 'right',
        },
        properties: {
          item: {
            type: 'void',
            'x-component': 'FormItem',
            properties: {
              remove: {
                type: 'void',
                'x-component': 'ArrayTable.Remove',
              },
            },
          },
        },
      },
    },
  },
  properties: {
    add: {
      type: 'void',
      'x-component': 'ArrayTable.Addition',
      'x-component-props': {
        randomValue: true,
      },
      title: "{{t('Add option')}}",
    },
  },
};

export const defaultProps = {
  'uiSchema.title': {
    type: 'string',
    title: '{{t("Field display name")}}',
    required: true,
    'x-decorator': 'FormItem',
    'x-component': 'Input',
  },
  name: {
    type: 'string',
    title: '{{t("Field name")}}',
    required: true,
    'x-disabled': '{{ !createOnly }}',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-validator': 'uid',
    description:
      "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
  },
  type,
};

export const recordPickerSelector: ISchema = {
  type: 'void',
  title: '{{ t("Select record") }}',
  'x-component': 'RecordPicker.Selector',
  'x-component-props': {
    className: 'nb-record-picker-selector',
  },
  properties: {
    grid: {
      type: 'void',
      'x-component': 'Grid',
      'x-initializer': 'TableSelectorInitializers',
      properties: {},
    },
    footer: {
      'x-component': 'Action.Container.Footer',
      'x-component-props': {},
      properties: {
        actions: {
          type: 'void',
          'x-component': 'ActionBar',
          'x-component-props': {},
          properties: {
            submit: {
              title: '{{ t("Submit") }}',
              'x-action': 'submit',
              'x-component': 'Action',
              'x-designer': 'Action.Designer',
              'x-component-props': {
                type: 'primary',
                htmlType: 'submit',
                useProps: '{{ usePickActionProps }}',
              },
            },
          },
        },
      },
    },
  },
};

export const recordPickerViewer = {
  type: 'void',
  title: '{{ t("View record") }}',
  'x-component': 'RecordPicker.Viewer',
  'x-component-props': {
    className: 'nb-action-popup',
  },
  properties: {
    tabs: {
      type: 'void',
      'x-component': 'Tabs',
      'x-component-props': {},
      'x-initializer': 'TabPaneInitializers',
      properties: {
        tab1: {
          type: 'void',
          title: '{{t("Details")}}',
          'x-component': 'Tabs.TabPane',
          'x-designer': 'Tabs.Designer',
          'x-component-props': {},
          properties: {
            grid: {
              type: 'void',
              'x-component': 'Grid',
              'x-initializer': 'RecordBlockInitializers',
              properties: {},
            },
          },
        },
      },
    },
  },
};

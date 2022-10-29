import { css } from '@emotion/css';
import { useCollection } from '@nocobase/client';
import { useFields } from './useFields';

export const useShared = () => {
  const { name } = useCollection();
  const fields = useFields(name);
  return {
    schema: {
      type: 'void',
      'x-component': 'Grid',
      properties: {
        exportSettings: {
          type: 'array',
          'x-component': 'ArrayItems',
          'x-decorator': 'FormItem',
          items: {
            type: 'object',
            properties: {
              space: {
                type: 'void',
                'x-component': 'Space',
                'x-component-props': {
                  className: css`
                    width: 100%;
                    & .ant-space-item:nth-child(2),
                    & .ant-space-item:nth-child(3) {
                      flex: 1;
                    }
                  `,
                },
                properties: {
                  sort: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.SortHandle',
                  },
                  dataIndex: {
                    type: 'array',
                    'x-decorator': 'FormItem',
                    'x-component': 'Cascader',
                    required: true,
                    enum: fields,
                    'x-component-props': {
                      fieldNames: {
                        label: 'title',
                        value: 'name',
                        children: 'children',
                      },
                      // labelInValue: true,
                      changeOnSelect: false,
                    },
                  },
                  title: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '{{ t("Custom column title") }}',
                    },
                  },
                  remove: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.Remove',
                  },
                },
              },
            },
          },
          properties: {
            add: {
              type: 'void',
              title: '{{ t("Add exportable field") }}',
              'x-component': 'ArrayItems.Addition',
              'x-component-props': {
                className: css`
                  border-color: rgb(241, 139, 98);
                  color: rgb(241, 139, 98);
                  &.ant-btn-dashed:hover {
                    border-color: rgb(241, 139, 98);
                    color: rgb(241, 139, 98);
                  }
                `,
              },
            },
          },
        },
      },
    },
  };
};

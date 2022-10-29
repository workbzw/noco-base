import merge from 'deepmerge';
import { EventEmitter } from 'events';
import { default as lodash, default as _ } from 'lodash';
import {
  ModelCtor,
  ModelOptions,
  QueryInterfaceDropTableOptions,
  SyncOptions,
  Transactionable,
  Utils,
} from 'sequelize';
import { Database } from './database';
import { Field, FieldOptions } from './fields';
import { Model } from './model';
import { Repository } from './repository';
import { checkIdentifier, md5 } from './utils';

export type RepositoryType = typeof Repository;

export type CollectionSortable = string | boolean | { name?: string; scopeKey?: string };

export interface CollectionOptions extends Omit<ModelOptions, 'name' | 'hooks'> {
  name: string;
  tableName?: string;
  filterTargetKey?: string;
  fields?: FieldOptions[];
  model?: string | ModelCtor<Model>;
  repository?: string | RepositoryType;
  sortable?: CollectionSortable;
  /**
   * @default true
   */
  autoGenId?: boolean;
  /**
   * @default 'options'
   */
  magicAttribute?: string;
  [key: string]: any;
}

export interface CollectionContext {
  database: Database;
}

export class Collection<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes,
> extends EventEmitter {
  options: CollectionOptions;
  context: CollectionContext;
  isThrough?: boolean;
  fields: Map<string, any> = new Map<string, any>();
  model: ModelCtor<Model>;
  repository: Repository<TModelAttributes, TCreationAttributes>;

  get filterTargetKey() {
    return lodash.get(this.options, 'filterTargetKey', this.model.primaryKeyAttribute);
  }

  get name() {
    return this.options.name;
  }

  get db() {
    return this.context.database;
  }

  constructor(options: CollectionOptions, context?: CollectionContext) {
    super();
    this.checkOptions(options);

    this.context = context;
    this.options = options;

    this.bindFieldEventListener();
    this.modelInit();
    this.setFields(options.fields);
    this.setRepository(options.repository);
    this.setSortable(options.sortable);
  }

  private checkOptions(options: CollectionOptions) {
    checkIdentifier(options.name);
  }

  private sequelizeModelOptions() {
    const { name, tableName } = this.options;
    return {
      ..._.omit(this.options, ['name', 'fields', 'model', 'targetKey']),
      modelName: name,
      sequelize: this.context.database.sequelize,
      tableName: tableName || name,
    };
  }

  /**
   * TODO
   */
  modelInit() {
    if (this.model) {
      return;
    }
    const { name, model, autoGenId = true } = this.options;
    let M: ModelCtor<Model> = Model;
    if (this.context.database.sequelize.isDefined(name)) {
      const m = this.context.database.sequelize.model(name);
      if ((m as any).isThrough) {
        // @ts-ignore
        this.model = m;
        // @ts-ignore
        this.model.database = this.context.database;
        // @ts-ignore
        this.model.collection = this;
        return;
      }
    }
    if (typeof model === 'string') {
      M = this.context.database.models.get(model) || Model;
    } else if (model) {
      M = model;
    }
    // @ts-ignore
    this.model = class extends M {};
    this.model.init(null, this.sequelizeModelOptions());

    if (!autoGenId) {
      this.model.removeAttribute('id');
    }

    // @ts-ignore
    this.model.database = this.context.database;
    // @ts-ignore
    this.model.collection = this;
  }

  setRepository(repository?: RepositoryType | string) {
    let repo = Repository;
    if (typeof repository === 'string') {
      repo = this.context.database.repositories.get(repository) || Repository;
    }
    this.repository = new repo(this);
  }

  private bindFieldEventListener() {
    this.on('field.afterAdd', (field: Field) => field.bind());
    this.on('field.afterRemove', (field: Field) => field.unbind());
  }

  forEachField(callback: (field: Field) => void) {
    return [...this.fields.values()].forEach(callback);
  }

  findField(callback: (field: Field) => boolean) {
    return [...this.fields.values()].find(callback);
  }

  hasField(name: string) {
    return this.fields.has(name);
  }

  getField<F extends Field>(name: string): F {
    return this.fields.get(name);
  }

  addField(name: string, options: FieldOptions): Field {
    return this.setField(name, options);
  }

  setField(name: string, options: FieldOptions): Field {
    checkIdentifier(name);

    const { database } = this.context;

    const field = database.buildField(
      { name, ...options },
      {
        ...this.context,
        collection: this,
      },
    );

    this.removeField(name);
    this.fields.set(name, field);
    this.emit('field.afterAdd', field);
    return field;
  }

  setFields(fields: FieldOptions[], resetFields = true) {
    if (!Array.isArray(fields)) {
      return;
    }

    if (resetFields) {
      this.resetFields();
    }

    for (const { name, ...options } of fields) {
      this.addField(name, options);
    }
  }

  resetFields() {
    const fieldNames = this.fields.keys();
    for (const fieldName of fieldNames) {
      this.removeField(fieldName);
    }
  }

  remove() {
    this.context.database.removeCollection(this.name);
  }

  async removeFromDb(options?: QueryInterfaceDropTableOptions) {
    if (
      await this.existsInDb({
        transaction: options?.transaction,
      })
    ) {
      const queryInterface = this.db.sequelize.getQueryInterface();
      await queryInterface.dropTable(this.model.tableName, options);
    }
    this.remove();
  }

  async existsInDb(options?: Transactionable) {
    return this.db.collectionExistsInDb(this.name, options);
  }

  removeField(name: string): void | Field {
    if (!this.fields.has(name)) {
      return;
    }
    const field = this.fields.get(name);
    const bool = this.fields.delete(name);
    if (bool) {
      this.emit('field.afterRemove', field);
    }
    return field as Field;
  }

  /**
   * TODO
   */
  updateOptions(options: CollectionOptions, mergeOptions?: any) {
    let newOptions = lodash.cloneDeep(options);
    newOptions = merge(this.options, newOptions, mergeOptions);

    this.context.database.emit('beforeUpdateCollection', this, newOptions);

    this.setFields(options.fields, false);
    this.setRepository(options.repository);

    this.context.database.emit('afterUpdateCollection', this);

    return this;
  }

  setSortable(sortable) {
    if (!sortable) {
      return;
    }
    if (sortable === true) {
      this.setField('sort', {
        type: 'sort',
        hidden: true,
      });
    }
    if (typeof sortable === 'string') {
      this.setField(sortable, {
        type: 'sort',
        hidden: true,
      });
    } else if (typeof sortable === 'object') {
      const { name, ...opts } = sortable;
      this.setField(name || 'sort', { type: 'sort', hidden: true, ...opts });
    }
  }

  /**
   * TODO
   *
   * @param name
   * @param options
   */
  updateField(name: string, options: FieldOptions) {
    if (!this.hasField(name)) {
      throw new Error(`field ${name} not exists`);
    }

    if (options.name && options.name !== name) {
      this.removeField(name);
    }

    this.setField(options.name || name, options);
  }

  addIndex(index: string | string[] | { fields: string[]; unique?: boolean; [key: string]: any }) {
    if (!index) {
      return;
    }
    let indexes: any = this.model.options.indexes || [];
    let indexName = [];
    let indexItem;
    if (typeof index === 'string') {
      indexItem = {
        fields: [index],
      };
      indexName = [index];
    } else if (Array.isArray(index)) {
      indexItem = {
        fields: index,
      };
      indexName = index;
    } else if (index?.fields) {
      indexItem = index;
      indexName = index.fields;
    }
    if (lodash.isEqual(this.model.primaryKeyAttributes, indexName)) {
      return;
    }
    const name: string = this.model.primaryKeyAttributes.join(',');
    if (name.startsWith(`${indexName.join(',')},`)) {
      return;
    }
    for (const item of indexes) {
      if (lodash.isEqual(item.fields, indexName)) {
        return;
      }
      const name: string = item.fields.join(',');
      if (name.startsWith(`${indexName.join(',')},`)) {
        return;
      }
    }
    if (!indexItem) {
      return;
    }
    indexes.push(indexItem);
    this.model.options.indexes = indexes;
    const tableName = this.model.getTableName();
    // @ts-ignore
    this.model._indexes = this.model.options.indexes
      // @ts-ignore
      .map((index) => Utils.nameIndex(this.model._conformIndex(index), tableName))
      .map((item) => {
        if (item.name && item.name.length > 63) {
          item.name = 'i_' + md5(item.name);
        }
        return item;
      });
  }

  removeIndex(fields: any) {
    if (!fields) {
      return;
    }
    // @ts-ignore
    const indexes: any[] = this.model._indexes;
    // @ts-ignore
    this.model._indexes = indexes.filter((item) => {
      return !lodash.isEqual(item.fields, fields);
    });
  }

  async sync(syncOptions?: SyncOptions) {
    const modelNames = new Set([this.model.name]);

    const { associations } = this.model;

    for (const associationKey in associations) {
      const association = associations[associationKey];
      modelNames.add(association.target.name);
      if ((<any>association).through) {
        modelNames.add((<any>association).through.model.name);
      }
    }

    const models: ModelCtor<Model>[] = [];
    // @ts-ignore
    this.context.database.sequelize.modelManager.forEachModel((model) => {
      if (modelNames.has(model.name)) {
        models.push(model);
      }
    });

    for (const model of models) {
      await model.sync(syncOptions);
    }
  }
}

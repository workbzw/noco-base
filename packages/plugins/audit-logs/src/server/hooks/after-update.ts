import Application from '@nocobase/server';
import { LOG_TYPE_UPDATE } from '../constants';

export function afterUpdate(app: Application) {
  return async (model, options) => {
    const db = app.db;
    const collection = db.getCollection(model.constructor.name);
    if (!collection || !collection.options.logging) {
      return;
    }
    const changed = model.changed();
    if (!changed) {
      return;
    }
    const transaction = options.transaction;
    const AuditLog = db.getCollection('auditLogs');
    const currentUserId = options?.context?.state?.currentUser?.id;
    const changes = [];
    changed.forEach((key: string) => {
      const field = collection.findField((field) => {
        return field.name === key || field.options.field === key;
      });
      if (field && !field.options.hidden) {
        changes.push({
          field: field.options,
          after: model.get(key),
          before: model.previous(key),
        });
      }
    });
    if (!changes.length) {
      return;
    }
    try {
      await AuditLog.repository.create({
        values: {
          type: LOG_TYPE_UPDATE,
          collectionName: model.constructor.name,
          recordId: model.get(model.constructor.primaryKeyAttribute),
          createdAt: model.get('updatedAt'),
          userId: currentUserId,
          changes,
        },
        transaction,
        hooks: false,
      });
      // if (!options.transaction) {
      //   await transaction.commit();
      // }
    } catch (error) {
      // if (!options.transaction) {
      //   await transaction.rollback();
      // }
    }
  };
}

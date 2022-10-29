import { Application } from '@nocobase/server';
import Database from '@nocobase/database';
import { getApp, sleep } from '..';
import { EXECUTION_STATUS } from '../../constants';



describe('workflow > triggers > collection', () => {
  let app: Application;
  let db: Database;
  let PostRepo;
  let WorkflowModel;

  beforeEach(async () => {
    app = await getApp();

    db = app.db;
    WorkflowModel = db.getCollection('workflows').model;
    PostRepo = db.getCollection('posts').repository;
  });

  afterEach(() => db.close());

  describe('toggle', () => {
    it('when collection change', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts'
        }
      });

      await workflow.update({
        config: {
          ...workflow.config,
          collection: 'comments'
        }
      });

      const post = await PostRepo.create({ values: { title: 't1' } });

      const executions = await workflow.getExecutions();
      expect(executions.length).toBe(0);
    });
  });

  describe('config.changed', () => {
    it('no changed config', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 2,
          collection: 'posts'
        }
      });

      const post = await PostRepo.create({ values: { title: 't1' } });
      await PostRepo.update({ filterByTk: post.id, values: { title: 't2' } });

      const executions = await workflow.getExecutions();
      expect(executions.length).toBe(1);
      expect(executions[0].context.data.title).toBe('t2');
    });

    it('field in changed config', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 2,
          collection: 'posts',
          changed: ['title']
        }
      });

      const post = await PostRepo.create({ values: { title: 't1' } });
      await PostRepo.update({ filterByTk: post.id, values: { title: 't2' } });

      const executions = await workflow.getExecutions();
      expect(executions.length).toBe(1);
      expect(executions[0].status).toBe(EXECUTION_STATUS.RESOLVED);
      expect(executions[0].context.data.title).toBe('t2');
    });

    it('field not in changed config', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 2,
          collection: 'posts',
          changed: ['published']
        }
      });

      const post = await PostRepo.create({ values: { title: 't1' } });
      await PostRepo.update({ filterByTk: post.id, values: { title: 't2' } });

      const executions = await workflow.getExecutions();
      expect(executions.length).toBe(0);
    });
  });
});

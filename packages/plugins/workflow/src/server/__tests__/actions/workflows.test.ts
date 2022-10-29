import { MockServer } from '@nocobase/test';
import Database from '@nocobase/database';
import { getApp } from '..';



describe('workflow > actions > workflows', () => {
  let app: MockServer;
  let agent;
  let db: Database;
  let PostModel;
  let PostRepo;
  let WorkflowModel;

  beforeEach(async () => {
    app = await getApp();
    agent = app.agent();
    db = app.db;
    WorkflowModel = db.getCollection('workflows').model;
    PostModel = db.getCollection('posts').model;
    PostRepo = db.getCollection('posts').repository;
  });

  afterEach(() => app.destroy());

  // describe('create', () => {
  // });

  describe('update', () => {
    it('update unexecuted workflow should be ok', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts'
        }
      });

      const { status } = await agent.resource('workflows').update({
        filterByTk: workflow.id,
        values: {
          config: {
            mode: 1,
            collection: 'tags'
          }
        }
      });

      expect(status).toBe(200);
    });

    it('update executed workflow should not be ok', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts'
        }
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });
      const c1 = await workflow.countExecutions();
      expect(c1).toBe(1);

      const { status } = await agent.resource('workflows').update({
        filterByTk: workflow.id,
        values: {
          config: {
            mode: 1,
            collection: 'tags'
          }
        }
      });
      expect(status).toBe(400);
    });

    it('only update executed workflow with "enabled" should be ok', async () => {
      const workflow = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts'
        }
      });

      const p1 = await PostRepo.create({ values: { title: 't1' } });
      const c1 = await workflow.countExecutions();
      expect(c1).toBe(1);

      const { status } = await agent.resource('workflows').update({
        filterByTk: workflow.id,
        values: {
          enabled: false,
          key: workflow.key
        }
      });
      expect(status).toBe(200);

      const p2 = await PostRepo.create({ values: { title: 't2' } });
      const c2 = await workflow.countExecutions();
      expect(c2).toBe(1);
    });
  });

  describe('revision', () => {
    it('create revision', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts'
        }
      });

      const { body, status } = await agent.resource(`workflows`).revision({
        filterByTk: w1.id
      });

      expect(status).toBe(200);
      const { data: w2 } = body;
      expect(w2.config).toMatchObject(w1.config);
      expect(w2.key).toBe(w1.key);
      expect(w2.current).toBeFalsy();
      expect(w2.enabled).toBe(false);

      const p1 = await PostRepo.create({ values: { title: 't1' } });

      await WorkflowModel.update({
        enabled: true
      }, {
        where: {
          id: w2.id
        },
        individualHooks: true
      });

      const [w1next, w2next] = await WorkflowModel.findAll({
        order: [['id', 'ASC']]
      });

      expect(w1next.enabled).toBe(false);
      expect(w1next.current).toBe(null);
      expect(w2next.enabled).toBe(true);
      expect(w2next.current).toBe(true);

      const p2 = await PostRepo.create({ values: { title: 't2' } });

      const [e1] = await w1next.getExecutions();
      const [e2] = await w2next.getExecutions();
      expect(e1.key).toBe(e2.key);
      expect(e1.workflowId).toBe(w1.id);
      expect(e2.workflowId).toBe(w2.id);
    });

    it('revision with nodes', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts'
        }
      });

      const n1 = await w1.createNode({
        type: 'echo'
      });
      const n2 = await w1.createNode({
        type: 'calculation',
        config: {
          calculation: {
            calculator: 'add',
            operands: [
              {
                type: '$jobsMapByNodeId',
                options: {
                  nodeId: n1.id,
                  path: 'data.read'
                }
              },
              {
                value: `{{$jobsMapByNodeId.${n1.id}.data.read}}`
              }
            ]
          }
        },
        upstreamId: n1.id
      });
      await n1.setDownstream(n2);

      const { body } = await agent.resource(`workflows`).revision({
        filterByTk: w1.id
      });
      const w2 = await WorkflowModel.findByPk(body.data.id, {
        include: [
          'nodes'
        ]
      });

      const n1_2 = w2.nodes.find(n => !n.upstreamId);
      const n2_2 = w2.nodes.find(n => !n.downstreamId);

      expect(n1_2.type).toBe('echo');
      expect(n2_2.type).toBe('calculation');
      expect(n2_2.config).toMatchObject({
        calculation: {
          calculator: 'add',
          operands: [
            {
              type: '$jobsMapByNodeId',
              options: {
                nodeId: n1_2.id,
                path: 'data.read'
              }
            },
            {
              value: `{{$jobsMapByNodeId.${n1_2.id}.data.read}}`
            }
          ]
        }
      });

      await w2.update({ enabled: true });

      await PostRepo.create({
        values: { title: 't1', read: 1 }
      });

      const [execution] = await w2.getExecutions();
      const [echo, calculation] = await execution.getJobs({ order: [['id', 'ASC']] });
      expect(calculation.result).toBe(2);
    });

    it('revision with using of deleted nodes', async () => {
      const w1 = await WorkflowModel.create({
        enabled: true,
        type: 'collection',
        config: {
          mode: 1,
          collection: 'posts'
        }
      });

      const n2 = await w1.createNode({
        type: 'calculation',
        config: {
          calculation: {
            calculator: 'add',
            operands: [
              {
                type: '$jobsMapByNodeId',
                options: {
                  nodeId: 0,
                  path: 'data.read'
                }
              },
              {
                value: `{{$jobsMapByNodeId.0.data.read}}`
              }
            ]
          }
        },
      });

      const { status } = await agent.resource(`workflows`).revision({
        filterByTk: w1.id
      });

      expect(status).toBe(400);
    });
  });
});

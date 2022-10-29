import { prepareApp } from './prepare';
import { MockServer } from '@nocobase/test';
import { Database } from '@nocobase/database';
import UsersPlugin from '@nocobase/plugin-users';

describe('scope api', () => {
  let app: MockServer;
  let db: Database;

  let admin;
  let adminAgent;

  afterEach(async () => {
    await app.destroy();
  });

  beforeEach(async () => {
    app = await prepareApp();
    db = app.db;

    const UserRepo = db.getCollection('users').repository;
    admin = await UserRepo.create({
      values: {
        roles: ['admin']
      }
    });

    const userPlugin = app.getPlugin('@nocobase/plugin-users') as UsersPlugin;
    adminAgent = app.agent().auth(userPlugin.jwtService.sign({
      userId: admin.get('id'),
    }), { type: 'bearer' });
  });

  it('should create scope of resource', async () => {
    const response = await adminAgent
      .resource('rolesResourcesScopes')
      .create({
        values: {
          resourceName: 'posts',
          name: 'published posts',
          scope: {
            published: true,
          },
        },
      });

    expect(response.statusCode).toEqual(200);

    const scope = await db.getRepository('rolesResourcesScopes').findOne({
      filter: {
        name: 'published posts',
      },
    });

    expect(scope.get('scope')).toMatchObject({
      published: true,
    });
  });
});

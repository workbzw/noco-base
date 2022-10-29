import { mockDatabase } from '../';
import { Database } from '../../database';
import { IdentifierError } from '../../errors/identifier-error';

describe('belongs to many field', () => {
  let db: Database;

  beforeEach(async () => {
    db = mockDatabase();
  });

  afterEach(async () => {
    await db.close();
  });

  test('association undefined', async () => {
    const Post = db.collection({
      name: 'posts',
      fields: [
        { type: 'string', name: 'name' },
        { type: 'belongsToMany', name: 'tags' },
      ],
    });

    expect(Post.model.associations.tags).toBeUndefined();
    expect(db.getCollection('postsTags')).toBeUndefined();

    const Tag = db.collection({
      name: 'tags',
      fields: [{ type: 'string', name: 'name' }],
    });
    expect(Post.model.associations.tags).toBeDefined();
    const Through = db.getCollection('postsTags');
    expect(Through).toBeDefined();

    expect(Through.model.rawAttributes['postId']).toBeDefined();
    expect(Through.model.rawAttributes['tagId']).toBeDefined();
  });

  test('redefine collection', () => {
    const Post = db.collection({
      name: 'posts',
      fields: [
        { type: 'string', name: 'name' },
        { type: 'belongsToMany', name: 'tags' },
      ],
    });

    expect(Post.model.associations.tags).toBeUndefined();
    expect(db.getCollection('postsTags')).toBeUndefined();

    const Tag = db.collection({
      name: 'tags',
      fields: [{ type: 'string', name: 'name' }],
    });

    const PostTag = db.collection({ name: 'postsTags' });

    expect(PostTag.model.rawAttributes['postId']).toBeDefined();
    expect(PostTag.model.rawAttributes['tagId']).toBeDefined();
  });

  it('should throw error when foreignKey is too long', async () => {
    const Post = db.collection({
      name: 'posts',
      fields: [
        { type: 'string', name: 'name' },
        { type: 'belongsToMany', name: 'tags', foreignKey: 'a'.repeat(128) },
      ],
    });

    let error;
    try {
      const Tag = db.collection({
        name: 'tags',
        fields: [{ type: 'string', name: 'name' }],
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(IdentifierError);
  });

  it('should throw error when through is too long', async () => {
    const Post = db.collection({
      name: 'posts',
      fields: [
        { type: 'string', name: 'name' },
        { type: 'belongsToMany', name: 'tags', through: 'a'.repeat(128) },
      ],
    });

    let error;
    try {
      const Tag = db.collection({
        name: 'tags',
        fields: [{ type: 'string', name: 'name' }],
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(IdentifierError);
  });
});

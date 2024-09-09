import { MongoDBService } from '@feathersjs/mongodb';

export class ClientLinksService extends MongoDBService {
  async create(data, params) {
    const { connectionId, clientUrl } = data;

    if (!connectionId || !clientUrl) {
      throw new Error('Missing required fields: connectionId or clientUrl');
    }

    const db = await this.getDatabase();
    const collection = db.collection('clientLinks');

    const newClientLink = {
      connectionId,
      clientUrl,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newClientLink);
    return result
  }

  async get(id, params) {
    const db = await this.getDatabase();
    const collection = db.collection('clientLinks');

    const link = await collection.findOne({ connectionId: id });
    
    if (!link) {
      throw new Error(`Client link for connectionId ${id} not found`);
    }

    return link;
  }

  async getDatabase() {
    return this.options.Model;
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db),
  };
};

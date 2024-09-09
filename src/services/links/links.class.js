import { MongoDBService } from '@feathersjs/mongodb';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class LinksService extends MongoDBService {
  async create(data, params) {
    const connectionId = crypto.randomBytes(7).toString('hex');

    const jwtToken = jwt.sign({ connectionId }, process.env.JWT_SECRET);

    const newData = {
      connectionId,
      jwtToken,
      serviceName: data.serviceName,
      lastUpdated: new Date()
    };

    return await super.create(newData, params);
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('links'))
  };
};

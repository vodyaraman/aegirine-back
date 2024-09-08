import { MongoDBService } from '@feathersjs/mongodb';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class LinksService extends MongoDBService {
  async create(data, params) {
    // Генерация строки подключения (до 15 символов)
    const connectionId = crypto.randomBytes(7).toString('hex');

    // Создание JWT токена с connectionId
    const jwtToken = jwt.sign({ connectionId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Подготовка данных для создания
    const newData = {
      connectionId,
      jwtToken,
      serviceName: data.serviceName,
      lastUpdated: new Date()
    };

    // Создание новой записи в MongoDB через стандартный метод
    return await super.create(newData, params);
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('links')) // Коллекция links
  };
};

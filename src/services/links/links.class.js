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

  async getLink(params) {
    const db = await this.getDatabase();
    const collection = db.collection('links');

    const token = params.headers.authorization.split(' ')[1];  // Извлекаем токен из заголовков
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Декодируем токен, используя секрет
  
    const connectionId = decoded.connectionId;  // Извлекаем connectionId из токена
  
    // Используем базу данных для поиска записи по connectionId
    const query = { connectionId };  // Устанавливаем критерий поиска
    const linkData = await collection.findOne(query);  // Поиск данных в базе MongoDB
  
    if (!linkData) {
      throw new Error('Link not found');  // Выбрасываем ошибку, если запись не найдена
    }
  
    // Формируем URL ссылки
    const serviceUrl = `${params.protocol}://${params.get('host')}/${linkData.serviceName}/${linkData.connectionId}?token=${linkData.jwtToken}`;
  
    // Возвращаем объект с результатом
    return {
      message: "Link retrieved successfully.",
      link: serviceUrl
    };
  }
  async getDatabase() {
    return this.options.Model;
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => (db))
  };
};

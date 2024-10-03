import { MongoDBService } from '@feathersjs/mongodb';
import jwt from 'jsonwebtoken';

export class ClientLinksService extends MongoDBService {
  async handleClientLink(token) {
    // Декодируем токен, чтобы получить connectionId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { connectionId } = decoded;

    // Получаем доступ к базе данных и коллекции
    const db = await this.getDatabase();
    const collection = db.collection('clientLinks');

    // Ищем запись с connectionId
    const existingLink = await collection.findOne({ connectionId });

    if (existingLink) {
      // Если запись найдена, возвращаем clientUrl
      return { clientUrl: existingLink.clientUrl };
    } else {
      // Если записи нет, создаем новую запись
      const clientUrl = `${process.env.SERVER_HOST}init/${connectionId}`;
      const newClientLink = {
        connectionId,
        clientUrl,
        createdAt: new Date().toISOString(),
      };

      // Вставляем новую запись в базу данных
      await collection.insertOne(newClientLink);

      return { clientUrl };
    }
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

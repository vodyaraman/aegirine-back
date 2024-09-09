import { MongoDBService } from '@feathersjs/mongodb';

export class ClientLinksService extends MongoDBService {
  // Метод для создания клиентской ссылки
  async create(data, params) {
    const { connectionId, clientUrl } = data;

    // Проверка обязательных полей
    if (!connectionId || !clientUrl) {
      throw new Error('Missing required fields: connectionId or clientUrl');
    }

    const db = await this.getDatabase();
    const collection = db.collection('clientLinks');  // Явно получаем коллекцию clientLinks

    // Создание новой клиентской ссылки
    const newClientLink = {
      connectionId,
      clientUrl,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newClientLink);  // Вставляем запись в коллекцию
    return result
  }

  // Метод для получения клиентской ссылки по connectionId
  async get(id, params) {
    const db = await this.getDatabase();
    const collection = db.collection('clientLinks');  // Явно получаем коллекцию clientLinks

    const link = await collection.findOne({ connectionId: id });
    
    if (!link) {
      throw new Error(`Client link for connectionId ${id} not found`);
    }

    return link;
  }

  // Метод для получения базы данных (модель коллекции)
  async getDatabase() {
    return this.options.Model;
  }
}

// Настройка опций для сервиса clientLinks
export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db),  // Явно возвращаем подключение к базе данных
  };
};

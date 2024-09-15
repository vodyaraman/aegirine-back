import { MongoDBService } from '@feathersjs/mongodb';
import jwt from 'jsonwebtoken';

export class CreateMenuService extends MongoDBService {
  async update(id, data, params) {
    const db = await this.getDatabase();
    const collection = db.collection('menu'); 

    const token = params.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const menuId = decoded.connectionId;

    let existingMenu = await collection.findOne({ menuId });

    if (!existingMenu) {
      const newMenu = {
        menuId,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      existingMenu = await collection.insertOne(newMenu);
    } else {
      const updatedData = {
        ...data,
        lastUpdated: new Date().toISOString()
      };

      await collection.updateOne({ menuId }, { $set: updatedData });
      existingMenu = await collection.findOne({ menuId });
    }

    return existingMenu;
  }

  async remove(id, params) {
    const db = await this.getDatabase();
    const collection = db.collection('menu'); 

    const token = params.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const menuId = decoded.connectionId;

    const deleted = await collection.deleteOne({ menuId });

    if (deleted.deletedCount === 0) {
      throw new Error(`Menu with ID ${menuId} not found`);
    }

    return { message: `Menu with ID ${menuId} has been deleted` };
  }

  // Новый метод для поиска меню по токену
  async findMenuByToken(params) {
    const db = await this.getDatabase();
    const collection = db.collection('menu');

    const token = params.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const menuId = decoded.connectionId;

    const menu = await collection.findOne({ menuId });

    if (!menu) {
      throw new Error(`Menu with ID ${menuId} not found`);
    }

    return menu;
  }

  async getDatabase() {
    return this.options.Model;
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db)
  };
};

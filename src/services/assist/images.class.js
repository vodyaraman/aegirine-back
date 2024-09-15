import { MongoDBService } from '@feathersjs/mongodb';
import { uploadImage, deleteImage } from '../../yandexStorage.js';
import { v4 as uuidv4 } from 'uuid';

export class ImagesService extends MongoDBService {
  async create(data, params) {
    const file = params.file;  // Multer добавляет файл в params
    if (!file) {
      throw new Error('Missing required fields: file');
    }

    // Генерируем уникальный идентификатор для изображения
    const imageId = uuidv4();

    // Загружаем изображение в Yandex Object Storage
    const uploadResult = await uploadImage(file, imageId);

    const newImage = {
      imageId: imageId, // Уникальный идентификатор для изображения
      url: uploadResult.url,  // URL изображения, полученный из Yandex Object Storage
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };

    // Сохраняем метаданные изображения в MongoDB
    return super.create(newImage, params);
  }

  // Метод получения изображения по ID
  async get(id, params) {
    const image = await this.Model.findOne({ imageId: id });
    if (!image) {
      throw new Error(`Image with ID ${id} not found`);
    }
    return image;
  }

  // Метод обновления изображения
  async patch(id, data, params) {
    const existingImage = await this.Model.findOne({ imageId: id });
    if (!existingImage) {
      throw new Error(`Image with ID ${id} not found`);
    }

    // Обновляем данные изображения в MongoDB
    const updatedData = {
      ...existingImage,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return super.patch(id, updatedData, params);
  }

  // Метод удаления изображения
  async remove(id, params) {
    const image = await this.Model.findOne({ imageId: id });
    if (!image) {
      throw new Error(`Image with ID ${id} not found`);
    }

    try {
      // Удаляем изображение из Yandex Object Storage
      await deleteImage(image.imageId);

      // Удаляем запись из MongoDB
      await this.Model.deleteOne({ imageId: id });
      return { message: `Image with ID ${id} has been deleted` };
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      throw new Error('Не удалось удалить изображение');
    }
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('images')),
  };
};

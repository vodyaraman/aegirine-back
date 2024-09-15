import { MongoDBService } from '@feathersjs/mongodb';
import { uploadImageToYandex, deleteImageFromYandex } from '../yandexStorage';

export class ImagesService extends MongoDBService {
  // Метод создания нового изображения
  async create(data, params) {
    if (!data.imageId || !data.file) {
      throw new Error('Missing required fields: imageId or file');
    }

    // Загружаем изображение в Yandex Object Storage
    const uploadResult = await uploadImageToYandex(data.file);

    // Создаем новый объект изображения с URL из Yandex Object Storage
    const newImage = {
      imageId: data.imageId,
      url: uploadResult.url,  // URL изображения из Yandex Object Storage
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

    // Удаляем изображение из Yandex Object Storage
    await deleteImageFromYandex(image.imageId);

    // Удаляем запись из MongoDB
    await this.Model.deleteOne({ imageId: id });
    return { message: `Image with ID ${id} has been deleted` };
  }
}

// Настройки для сервиса изображений
export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('images')),
  };
};

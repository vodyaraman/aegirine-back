import { MongoDBService } from '@feathersjs/mongodb';

export class ImagesService extends MongoDBService {
  async create(data, params) {
    if (!data.imageId || !data.url) {
      throw new Error('Missing required fields: imageId or url');
    }

    const existingImage = await this.Model.findOne({ imageId: data.imageId });
    if (existingImage) {
      throw new Error(`Image with ID ${data.imageId} already exists`);
    }
    const newImage = {
      imageId: data.imageId,
      url: data.url,
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };

    return super.create(newImage, params);
  }

  async get(id, params) {
    const image = await this.Model.findOne({ imageId: id });
    if (!image) {
      throw new Error(`Image with ID ${id} not found`);
    }
    return image;
  }

  async patch(id, data, params) {
    const existingImage = await this.Model.findOne({ imageId: id });
    if (!existingImage) {
      throw new Error(`Image with ID ${id} not found`);
    }

    const updatedData = {
      ...existingImage,
      ...data, 
      updatedAt: new Date().toISOString(),
    };

    return super.patch(id, updatedData, params);
  }

  async remove(id, params) {
    const image = await this.Model.findOne({ imageId: id });
    if (!image) {
      throw new Error(`Image with ID ${id} not found`);
    }

    await this.Model.deleteOne({ imageId: id });
    return { message: `Image with ID ${id} has been deleted` };
  }
}
export const getOptions = (app) => {
    return {
      paginate: app.get('paginate'),
      Model: app.get('mongodbClient').then((db) => db.collection('images')),
    };
  };
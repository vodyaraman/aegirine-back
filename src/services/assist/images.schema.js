import { ObjectId } from 'mongodb';
import { getValidator } from '@feathersjs/schema';
import { dataValidator } from '../../validators.js';

export const imageSchema = {
  $id: 'Image',
  type: 'object',
  properties: {
    imageId: { type: 'string', description: 'Уникальный идентификатор изображения', default: () => new ObjectId().toString() },  // Генерация id автоматически
    url: { type: 'string', format: 'uri' },
    description: { type: 'string' },
  },
};

export const imageValidator = getValidator(imageSchema, dataValidator);

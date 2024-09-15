import { getValidator } from '@feathersjs/schema';
import { dataValidator } from '../../validators.js';

export const createMenuSchema = {
  $id: 'Menu',
  type: 'object',
  additionalProperties: false,
  required: ['menuId', 'drinks'],
  properties: {
    menuId: { type: 'string' },
    title: {
      type: 'object',
      properties: {
        font: { type: 'string' },
        size: { type: 'string' },
        color: { type: 'string' },
        content: { type: 'string' }
      },
      additionalProperties: false
    },
    drink_sizes: {
      type: 'array',
      items: { type: 'string' }
    },
    drinks: {
      type: 'array',
      items: {
        type: 'object',
        required: ['content', 'color', 'font', 'size', 'price', 'backgroundColor'],
        properties: {
          content: { type: 'string' },
          color: { type: 'string' },
          font: { type: 'string' },
          size: { type: 'string' },
          price: { type: 'number' },
          backgroundColor: { type: 'string' }
        }
      },
      minItems: 1
    },
    imageId: { type: 'string' },  // Добавляем поле для хранения только ID изображения
    mascotId: { type: 'string' },  // Поле для идентификатора талисмана
    backgroundImage: { type: 'string' },  // Идентификатор фона меню
    lastUpdated: { type: 'string', format: 'date-time' }
  }
};

export const createMenuDataValidator = getValidator(createMenuSchema, dataValidator);

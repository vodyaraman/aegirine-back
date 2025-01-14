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
    images: {
      type: 'object',
      properties: {
        backgroundImage: {
          type: 'object',
          properties: {
            imageId: { type: 'string' },
            imageUrl: { type: 'string' }
          },
          additionalProperties: false
        },
        mascotImage: {
          type: 'object',
          properties: {
            imageId: { type: 'string' },
            imageUrl: { type: 'string' }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    lastUpdated: { type: 'string', format: 'date-time' }
  }
};

export const createMenuDataValidator = getValidator(createMenuSchema, dataValidator);

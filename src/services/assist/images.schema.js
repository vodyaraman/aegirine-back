import { getValidator } from '@feathersjs/schema';
import { dataValidator } from '../../validators.js';

export const imageSchema = {
  $id: 'Image',
  type: 'object',
  required: ['imageId', 'url'],
  properties: {
    imageId: { type: 'string' },
    url: { type: 'string', format: 'uri' },
    description: { type: 'string' },
  },
};

export const imageValidator = getValidator(imageSchema, dataValidator);

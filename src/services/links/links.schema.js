import { resolve, getValidator } from '@feathersjs/schema';
import { ObjectIdSchema } from '@feathersjs/schema';
import { dataValidator } from '../../validators.js';

// Основная схема данных
export const linksSchema = {
  $id: 'Links',
  type: 'object',
  additionalProperties: false,
  required: ['serviceName'],
  properties: {
    _id: ObjectIdSchema(),
    serviceName: { type: 'string' },
    connectionId: { type: 'string', maxLength: 15 },
    jwtToken: { type: 'string' },
    lastUpdated: { type: 'string', format: 'date-time' }
  }
};

// Валидация данных при создании
export const linksDataValidator = getValidator(linksSchema, dataValidator);
export const linksResolver = resolve({});
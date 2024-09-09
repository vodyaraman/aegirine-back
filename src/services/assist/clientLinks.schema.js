import { getValidator } from '@feathersjs/schema';
import { dataValidator } from '../../validators.js';

export const clientLinkSchema = {
  $id: 'ClientLink',
  type: 'object',
  required: ['connectionId', 'clientUrl'],
  properties: {
    connectionId: { type: 'string' },
    clientUrl: { type: 'string', format: 'uri' },
    createdAt: { type: 'string', format: 'date-time' }, 
  },
};

export const clientLinkValidator = getValidator(clientLinkSchema, dataValidator);

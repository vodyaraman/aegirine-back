import { ImagesService, getOptions as getImagesOptions } from './images.class.js';
import { ClientLinksService, getOptions as getClientLinksOptions } from './clientLinks.class.js';
import * as schemaHooks from '@feathersjs/schema';
import { imageValidator } from './images.schema.js';
import { clientLinkValidator } from './clientLinks.schema.js';

export const assist = (app) => {
  // Сервис для работы с изображениями
  app.use('images', new ImagesService(getImagesOptions(app)), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],  // Поддерживаем все необходимые методы для работы с изображениями
  });

  // Сервис для работы с клиентскими ссылками
  app.use('client-links', new ClientLinksService(getClientLinksOptions(app)), {
    methods: ['find', 'get', 'create'],  // Для клиентских ссылок нам нужны только методы find, get и create
  });

  // Получаем доступ к сервисам
  const imagesService = app.service('images');
  const clientLinksService = app.service('client-links');

  // Хуки для изображений
  imagesService.hooks({
    before: {
      create: [schemaHooks.validateData(imageValidator)],  // Валидация данных перед созданием
      patch: [schemaHooks.validateData(imageValidator)],   // Валидация данных перед обновлением
    },
  });

  // Хуки для клиентских ссылок
  clientLinksService.hooks({
    before: {
      create: [schemaHooks.validateData(clientLinkValidator)],  // Валидация данных перед созданием клиентской ссылки
    },
  });
};

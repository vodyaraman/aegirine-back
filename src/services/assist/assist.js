import multer from 'multer';
import { ImagesService, getOptions as getImagesOptions } from './images.class.js';
import { ClientLinksService, getOptions as getClientLinksOptions } from './clientLinks.class.js';
import { imageValidator } from './images.schema.js';
import { clientLinkValidator } from './clientLinks.schema.js';
import pkg from '@feathersjs/schema';

const { validate } = pkg;

// Настраиваем multer
const upload = multer();

export const assist = (app) => {
  const imagesService = new ImagesService(getImagesOptions(app));
  const clientLinksService = new ClientLinksService(getClientLinksOptions(app));

  // Маршрут для загрузки изображения
  app.post('/images', upload.single('image'), async (req, res) => {
    try {
      // Создаем изображение
      const createdImage = await imagesService.create(req.body, { file: req.file });
      res.status(201).json(createdImage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Получение изображения
  app.get('/images/:id', async (req, res) => {
    try {
      const image = await imagesService.get(req.params.id);
      res.status(200).json(image);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  // Обновление изображения
  app.patch('/images/:id', async (req, res) => {
    try {
      await validate(imageValidator, req.body); // Валидируем данные перед обновлением
      const updatedImage = await imagesService.patch(req.params.id, req.body);
      res.status(200).json(updatedImage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Удаление изображения
  app.delete('/images/:id', async (req, res) => {
    try {
      const result = await imagesService.remove(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  // Маршрут для работы с клиентскими ссылками
  app.post('/client-links', async (req, res) => {
    try {
      await validate(clientLinkValidator, req.body); // Валидируем данные перед созданием
      const createdClientLink = await clientLinksService.create(req.body);
      res.status(201).json(createdClientLink);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/client-links/:id', async (req, res) => {
    try {
      const clientLink = await clientLinksService.get(req.params.id);
      res.status(200).json(clientLink);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
};

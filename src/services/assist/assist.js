// Настраиваем multer для загрузки файлов
import multer from 'multer';
import { ImagesService, getOptions as getImagesOptions } from './images.class.js';
import { ClientLinksService, getOptions as getClientLinksOptions } from './clientLinks.class.js';
import { imageValidator } from './images.schema.js';
import { clientLinkValidator } from './clientLinks.schema.js';
import { CreateMenuService, getOptions as getMenuOptions } from '../create/create.class.js'; // Добавляем MenuService
import pkg from '@feathersjs/schema';
const { validate } = pkg;

// Настраиваем multer
const upload = multer();

export const assist = (app) => {
  const imagesService = new ImagesService(getImagesOptions(app));
  const clientLinksService = new ClientLinksService(getClientLinksOptions(app));
  const menuService = new CreateMenuService(getMenuOptions(app)); // Инициализируем MenuService

  // Маршрут для загрузки изображения
  app.post('/images', upload.single('image'), async (req, res) => {
    try {
      // Создаем изображение
      const createdImage = await imagesService.create(req.body, { file: req.file });
  
      // Получаем ImageId, описание и URL изображения
      const { imageId, description, url: imageUrl } = createdImage;
  
      // Обновляем коллекцию меню на основе описания изображения
      let updateField = {};
      if (description === 'Background image') {
        updateField = { backgroundImage: { imageId, imageUrl } };  // Используем объект для backgroundImage
      } else if (description === 'Mascot image') {
        updateField = { mascotImage: { imageId, imageUrl } };  // Используем объект для mascotImage
      }
  
      if (Object.keys(updateField).length > 0) {
        await menuService.updateImageInMenu(req, updateField);  // Передаем объект обновленного изображения
      }
  
      res.status(201).json(createdImage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });  

  app.get('/images/:id', async (req, res) => {
    try {
      const image = await imagesService.get(req.params.id);
      res.status(200).json(image);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  app.patch('/images/:id', async (req, res) => {
    try {
      await validate(imageValidator, req.body);
      const updatedImage = await imagesService.patch(req.params.id, req.body);
      res.status(200).json(updatedImage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/images/:id', async (req, res) => {
    try {
      const result = await imagesService.remove(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  app.post('/client-links', async (req, res) => {
    try {
      await validate(clientLinkValidator, req.body);
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

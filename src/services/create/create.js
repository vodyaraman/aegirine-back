import { CreateMenuService, getOptions } from './create.class.js';

export const create = (app) => {
  const service = new CreateMenuService(getOptions(app));

  app.put('/update', async (req, res) => {
    try {
      const updatedMenu = await service.update(null, req.body, { headers: req.headers });
      res.status(200).json(updatedMenu);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/delete', async (req, res) => {
    try {
      const result = await service.remove(null, { headers: req.headers });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Новый GET эндпоинт для получения меню
  app.get('/menu', async (req, res) => {
    try {
      const menu = await service.findMenuByToken({ headers: req.headers });
      res.status(200).json(menu);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

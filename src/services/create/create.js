import { CreateMenuService, getOptions } from './create.class.js';

export const create = (app) => {
  const service = new CreateMenuService(getOptions(app));

  app.post('/init', async (req, res) => {
    try {
      const response = await service.init(req);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/update', async (req, res) => {
    try {
      const response = await service.update(req.body, req);
      res.status(200).json(response);
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

  app.get('/init/:menuId', async (req, res) => {
    const { menuId } = req.params;

    try {
      const menu = await service.findMenuById(menuId);

      if (!menu) {
        res.status(404).json({ error: `Menu with ID ${menuId} not found` });
        return;
      }

      res.redirect(`${process.env.CLIENT_HOST}client-redirect?menuId=${menuId}`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/menu/:menuId', async (req, res) => {
    const { menuId } = req.params;

    try {
      const menu = await service.findMenuById(menuId);

      if (!menu) {
        res.status(404).json({ error: `Menu with ID ${menuId} not found` });
        return;
      }

      res.status(200).json(menu);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

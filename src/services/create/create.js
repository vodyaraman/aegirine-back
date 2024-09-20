import { CreateMenuService, getOptions } from './create.class.js';

export const create = (app) => {
  const service = new CreateMenuService(getOptions(app));

  app.post('/init', async (req, res) => {
    try {
      const response = await createMenuService.init(req);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });  

  app.put('/update', async (req, res) => {
    try {
      const response = await createMenuService.update(req.body, req);
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

  app.get('/menu', async (req, res) => {
    try {
      const menu = await service.findMenuByToken({ headers: req.headers });
      res.status(200).json(menu);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

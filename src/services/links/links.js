import { LinksService, getOptions } from './links.class.js';
import jwt from 'jsonwebtoken';

export const links = (app) => {
  const secret = process.env.JWT_SECRET;
  app.post('/create', async (req, res) => {
    try {
      const service = new LinksService(getOptions(app));
      const createdLink = await service.create(req.body);

      const serviceUrl = `${req.protocol}://${req.get('host')}/${createdLink.serviceName}/${createdLink.connectionId}?token=${createdLink.jwtToken}`;

      // Отправляем ссылку пользователю
      res.status(201).json({
        message: "Link created successfully.",
        link: serviceUrl
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/:serviceName/:connectionId', async (req, res) => {
    try {
      const { serviceName, connectionId } = req.params;
      const token = req.query.token;

      if (!token) {
        return res.status(401).json({ message: 'Authorization token missing in URL' });
      }

      // Валидация JWT токена
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Проверяем совпадает ли connectionId с токеном
        if (decoded.connectionId !== connectionId) {
          return res.status(403).json({ message: 'Invalid connection ID' });
        }

        // Переадресация на /create
        res.redirect(`${process.env.CLIENT_HOST}create`);
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};
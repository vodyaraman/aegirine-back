# Используем базовый образ Node.js
FROM node:22-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

EXPOSE 3030

# Запускаем сервер Feathers.js
CMD ["npm", "run", "dev"]

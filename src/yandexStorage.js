import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const REGION = process.env.YANDEX_REGION;
const BUCKET_NAME = process.env.YANDEX_BUCKET_NAME;
const ACCESS_KEY = process.env.YANDEX_ACCESS_KEY;
const SECRET_KEY = process.env.YANDEX_SECRET_KEY;

console.log('REGION:', REGION);
console.log('BUCKET_NAME:', BUCKET_NAME);
console.log('ACCESS_KEY:', ACCESS_KEY);
console.log('SECRET_KEY:', SECRET_KEY);

const s3Client = new S3Client({
    region: REGION,
    endpoint: `https://storage.yandexcloud.net`,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });
  
export const uploadImage = async (file, imageId) => {
  const key = `${imageId}`;

  const uploadParams = {
    Bucket: BUCKET_NAME, // Используем переменную среды
    Key: key, // Уникальный ключ для файла
    Body: file.buffer, // Данные файла
    ContentType: file.mimetype, // MIME тип файла (например, image/png)
  };

  try {
    // Загружаем файл в Yandex Object Storage
    await s3Client.send(new PutObjectCommand(uploadParams));

    // Формируем URL для доступа к загруженному файлу
    const url = `https://${BUCKET_NAME}.storage.yandexcloud.net/${key}`;
    console.log(url);
    return { url };
  } catch (err) {
    console.error('Ошибка при загрузке изображения в Yandex:', err);
    throw new Error('Не удалось загрузить изображение');
  }
};

// Метод для удаления изображения
export const deleteImage = async (imageId) => {
  const deleteParams = {
    Bucket: BUCKET_NAME, // Используем переменную среды
    Key: imageId,  // Уникальный идентификатор файла (ключ)
  };

  try {
    // Удаляем файл из Yandex Object Storage
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    return { message: 'Изображение успешно удалено' };
  } catch (err) {
    console.error('Ошибка при удалении изображения:', err);
    throw new Error('Не удалось удалить изображение');
  }
};

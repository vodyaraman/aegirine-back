import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Конфигурация Yandex Object Storage через AWS SDK
const s3Client = new S3Client({
  endpoint: process.env.YANDEX_STORAGE_ENDPOINT,
  region: process.env.YANDEX_REGION,
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY,
    secretAccessKey: process.env.YANDEX_SECRET_KEY,
  },
});

export const uploadImage = async (file) => {
  const params = {
    Bucket: process.env.YANDEX_BUCKET_NAME,
    Key: file.originalname, // Название файла в бакете
    Body: file.buffer, // Данные файла
    ContentType: file.mimetype, // MIME-тип файла
    ACL: 'public-read', // Доступ к файлу
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    const imageUrl = `${process.env.YANDEX_STORAGE_ENDPOINT}/${process.env.YANDEX_BUCKET_NAME}/${file.originalname}`;
    return { url: imageUrl, ...data };
  } catch (err) {
    console.error('Ошибка загрузки файла в Yandex Storage:', err);
    throw err;
  }
};

// Функция для удаления изображения из Yandex Object Storage
export const deleteImage = async (imageId) => {
  const params = {
    Bucket: process.env.YANDEX_BUCKET_NAME,
    Key: imageId, // Название файла в бакете
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    return { message: `Image ${imageId} успешно удалено` };
  } catch (err) {
    console.error('Ошибка удаления файла из Yandex Storage:', err);
    throw err;
  }
};

import { MongoClient } from 'mongodb';

export const mongodb = (app) => {
  const connection = process.env.MONGO_URI;
  const database = new URL(connection).pathname.substring(1);
  const mongoClient = MongoClient.connect(connection).then((client) => client.db(database));

  app.set('mongodbClient', mongoClient); 

  console.log("Connected to mongoDB")
};

import express, { Request, Response } from 'express';
import { Collection, Db, MongoClient, InsertOneResult } from 'mongodb';

// JS equivalent would be:
//const express = require('express');
//const MongoClient = require('mongodb').MongoClient;

const app = express();
const port: number = process.env.NODE_APP_PORT? parseInt(process.env.NODE_APP_PORT) : 3000;

// Connection URL and Database Name
const dbPort: string = process.env.MONGO_HOST_PORT ?? '27017'
const dbUrl: string = process.env.MONGO_DB_URL ?? `mongodb://0.0.0.0:${dbPort}`;
const dbName: string = process.env.MONGO_DB_NAME ?? 'cardDatabase';
const collectionName: string = 'cardCollection';

var client: MongoClient;
var db: Db;
var collection: Collection;

async function initializeDatabase() {
  client = await MongoClient.connect(dbUrl)
  db = client.db(dbName);
  const collections = await db.collections();
  const collectionExists = collections.some((col) => col.collectionName === collectionName);

  // If the collection does not exist, create it
  if (!collectionExists) {
    await db.createCollection(collectionName);
    console.log(`Collection '${collectionName}' created.`);
  } else {
    console.log(`Collection '${collectionName}' already exists, will not be created.`);
  }
  collection = db.collection(collectionName)
}

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to return "Hello World"
app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/mongodb-data', async (_req: Request, res: Response) => {
  try {
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/mongodb-data', async (req: Request, res: Response) => {
  try {
    const newData = req.body;
    // Not accepting emtpy data
    if (Object.keys(newData).length == 0){
      res.status(400).send('Empty data.');
    }
    const result = (await collection.insertOne(newData)) as InsertOneResult<Document>;
    if (result.insertedId) {
      const insertedDocument = await collection.findOne({ _id: result.insertedId });
      res.json(insertedDocument);
    } else {
      res.status(500).send('Failed to insert document');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

// Start the server
app.listen(port, () => {
  initializeDatabase().catch(error => console.error(`Error initializing database: ${error}`)).then(
    () => {console.log(`Server is running on ${dbUrl} , name ${dbName}`);}
  );
});

function cleanUpAndExit() {
  if (client) {
    console.log('Closing MongoDB connection...');
    client.close().then(() => {
      console.log('MongoDB connection closed. Exiting...');
      process.exit(0);
    });
  } else {
    console.log('Exiting without closing MongoDB connection.');
    process.exit(0);
  }
}

process.on('SIGINT', () => {
  cleanUpAndExit();
});

process.on('SIGTERM', () => {
  cleanUpAndExit();
});

process.on('exit', () => {
  cleanUpAndExit();
});

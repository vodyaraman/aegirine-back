import { feathers } from '@feathersjs/feathers';
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express';
import configuration from '@feathersjs/configuration';
import socketio from '@feathersjs/socketio';
import { configurationValidator } from './configuration.js';
import { logger } from './logger.js';
import { logError } from './hooks/log-error.js';
import { mongodb } from './mongodb.js';
import { services } from './services/index.js';
import { channels } from './channels.js';
import dotenv from 'dotenv';

const app = express(feathers());

dotenv.config();

app.configure(configuration(configurationValidator));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/', serveStatic(app.get('public')));

// Configure services and real-time functionality
app.configure(rest());
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
);
app.configure(mongodb);

app.configure(services);
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(errorHandler({ logger }));

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
});
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
});

export { app };


import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
// import { UPLOAD_DIR } from './constans/index.js';

const port = Number(env('PORT', 3000));
const allowedOrigins = [`http://localhost:3000`, 'https://zymbsis.github.io'];
const corsConfig = { origin: allowedOrigins, credentials: true };

export const startServer = () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '1000kb',
    }),
  );

  const corsConfig = {
    origin: ['http://localhost:3000', 'https://zymbsis.github.io'],
    credentials: true,
  };

  app.use(cors(corsConfig));
  app.options('*', cors(corsConfig));

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cookieParser());
  // app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

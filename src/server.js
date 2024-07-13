import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
// import { UPLOAD_DIR } from './constans/index.js';
// import { swaggerDocs } from './middlewares/swaggerDocs.js';

const port = Number(env('PORT', 3000));

export const startServer = () => {
  const app = express();
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cookieParser());
  // app.use('/uploads', express.static(UPLOAD_DIR));
  // app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

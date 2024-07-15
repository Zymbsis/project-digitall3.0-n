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

export const startServer = () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          origin &&
          (origin === 'http://localhost:3001' ||
            origin === 'https://zymbsis.github.io/project-digitall3.0-r.com')
        ) {
          callback(null, true); // Дозволити запит
        } else {
          callback(new Error('Not allowed by CORS')); // Заборонити запит
        }
      },
      credentials: true,
    }),
  );
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  // app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

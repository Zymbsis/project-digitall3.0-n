import jwt from 'jsonwebtoken';

export const validateToken = (token) => {
  try {
    const { email, sub: _id } = jwt.verify(token, env('JWT_SECRET'));
    return { email, _id };
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw err;
  }
};

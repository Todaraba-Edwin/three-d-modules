import { registerAs } from '@nestjs/config';
import * as path from 'path';

export const pathsConfig = registerAs('paths', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const publicRoot = isProduction
    ? path.join(process.cwd(), 'public')
    : path.resolve(process.cwd(), '../../Dockerfiles/data');

  return {
    public: publicRoot,
    temporary: path.join(publicRoot, 'temporary'),
    images: path.join(publicRoot, 'images'),
  };
});

export const Paths = {
  PUBLIC: 'paths.public',
  PUBLIC_TEMP: 'paths.temporary',
  PUBLIC_IMG: 'paths.images',
} as const;

export const ImageDir = {
  TEMPORARY: '/media/temporary',
  IMAGE: '/media/images',
};

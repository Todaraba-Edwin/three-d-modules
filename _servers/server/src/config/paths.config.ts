import { registerAs } from '@nestjs/config';
import * as path from 'path';

export const publicChildren = {
  ROOT: 'public',
  TEMPORARY: 'temporary',
  IMAGES: 'images',
} as const;
export type PublicChildrenEnums =
  (typeof publicChildren)[keyof typeof publicChildren];

export const pathsConfig = registerAs('paths', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const publicRoot = isProduction
    ? path.join(process.cwd(), publicChildren.ROOT)
    : path.resolve(process.cwd(), '../../Dockerfiles/data');

  return {
    public: publicRoot,
    temporary: path.join(publicRoot, publicChildren.TEMPORARY),
    images: path.join(publicRoot, publicChildren.IMAGES),
  };
});

export const Paths = {
  PUBLIC: `paths.${publicChildren.ROOT}`,
  PUBLIC_TEMP: `paths.${publicChildren.TEMPORARY}`,
  PUBLIC_IMG: `paths.${publicChildren.IMAGES}`,
} as const;

export const ImageDir = {
  TEMPORARY: `/media/${publicChildren.TEMPORARY}`,
  IMAGE: `/media/${publicChildren.IMAGES}`,
};

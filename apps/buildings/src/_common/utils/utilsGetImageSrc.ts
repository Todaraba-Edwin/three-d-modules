const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_IMG_SERVER = import.meta.env.VITE_IMG_SERVER;
const VITE_MODE = import.meta.env.MODE;
const isDevelop = VITE_MODE === 'development';

export const utilsGetImageSrc = ({ url }: { url: string }): string => {
  return `${isDevelop ? VITE_IMG_SERVER : VITE_API_URL}${url}`;
};

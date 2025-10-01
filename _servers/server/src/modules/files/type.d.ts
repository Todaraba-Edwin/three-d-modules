type GetFilesParameterType = Record<'subfolder' | 'baseUrl', string>;

type GetFilesResult = {
  fileName: string;
  url: string;
}[];

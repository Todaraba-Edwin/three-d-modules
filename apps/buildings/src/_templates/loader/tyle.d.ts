type CheckAuthType = Promise<{
  message: string;
  username: string;
  nickname?: string;
  userType: string;
} | null>;

type RouteLoaderType = Promise<Response | null>;

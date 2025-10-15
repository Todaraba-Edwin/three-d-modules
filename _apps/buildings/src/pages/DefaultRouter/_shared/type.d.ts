type RouterOptionType = {
  path: RouteObject['path'];
  element: RouteObject['element'];
};

type DefaultMainOutletLayoutProps = PropsWithChildren & {
  nickname?: string;
  permissionPaths: PermissionsType[];
  setIsExpirationSession: Dispatch<React.SetStateAction<boolean>>;
};

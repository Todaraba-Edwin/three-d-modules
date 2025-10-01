type RouterOptionType = {
  path: RouteObject['path'];
  element: RouteObject['element'];
};

type DefaultMainOutletLayoutProps = PropsWithChildren & {
  nickname?: string;
  permissionPaths: PermissionsType[];
  setIsFocusLogin: Dispatch<React.SetStateAction<boolean>>;
};

type containerProps = {
  container: HTMLElement;
};

type utilsSetStyleProps = containerProps & {
  styleMap: Record<string, string>;
};

type ControlToolboxProps = containerProps & {
  type: ControlToolboxType;
};

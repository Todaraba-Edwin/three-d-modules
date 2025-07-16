export type containerProps = {
  container: HTMLElement;
};

export type utilsSetStyleProps = containerProps & {
  styleMap: Record<string, string>;
};

export type ControlToolboxProps = containerProps & {
  type: ControlToolboxType;
};

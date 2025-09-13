type LucideIconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

type menuItemsType = {
  icon: LucideIconType;
  path: string;
  desc?: string;
};

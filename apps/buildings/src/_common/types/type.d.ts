type LucideIconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

type menuListsType = {
  icon: LucideIconType;
  path: string;
  desc?: string;
};

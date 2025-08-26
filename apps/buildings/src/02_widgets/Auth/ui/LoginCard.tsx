import { type ReactNode } from 'react';

export const CardLayout = ({
  className,
  ...props
}: React.ComponentProps<'div'>): ReactNode => {
  return <div className={className} {...props} />;
};

export const CardLBody = ({
  className,
  ...props
}: React.ComponentProps<'div'>): ReactNode => {
  return <div className={className} {...props} />;
};

export const CardHeader = ({
  className,
  ...props
}: React.ComponentProps<'header'>): ReactNode => {
  return <header className={className} {...props} />;
};

export const CardIconBox = ({
  className,
  ...props
}: React.ComponentProps<'figure'>): ReactNode => {
  return <figure className={className} {...props} />;
};

export const CardTitle = ({
  className,
  ...props
}: React.ComponentProps<'h1'>): ReactNode => {
  return <h1 className={className} {...props} />;
};

export const CardDesc = ({
  className,
  ...props
}: React.ComponentProps<'p'>): ReactNode => {
  return <p className={className} {...props} />;
};

export const CardSpan = ({
  className,
  ...props
}: React.ComponentProps<'span'>): ReactNode => {
  return <span className={className} {...props} />;
};

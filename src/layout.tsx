import { ReactNode } from "react";

import Header from "./components/header";

interface ILayoutProps {
  children: NonNullable<ReactNode>;
}

export const Layout = ({ children }: ILayoutProps) => (
  <div>
    <Header />

    {children}
  </div>
);

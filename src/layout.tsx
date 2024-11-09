import { ReactNode } from "react";

import Header from "./components/header";

interface ILayoutProps {
  children: NonNullable<ReactNode>;
}

export const Layout = ({ children }: ILayoutProps) => (
  <div className="flex flex-col">
    <Header />

    {children}
  </div>
);

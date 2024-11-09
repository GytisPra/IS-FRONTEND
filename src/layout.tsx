import { ReactNode } from "react";
import { Toolbar, Box, styled } from "@mui/material";

import Header from "./components/header";

const OuterContainer = styled(Box)`
`;

const InnerContainer = styled(Box)`
`;

interface ILayoutProps {
  children: NonNullable<ReactNode>;
}

export const Layout = ({ children }: ILayoutProps) => (

    <OuterContainer>
      <Header />
      <Toolbar />
      <InnerContainer>
        <div>{children}</div>
      </InnerContainer>
    </OuterContainer>
);
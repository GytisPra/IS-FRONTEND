import { ReactNode } from "react";
import { Toolbar, Box, styled } from "@mui/material";

import Header from "./components/header";

const OuterContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const InnerContainer = styled(Box)`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  width: 100%;
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
import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import NavBar from "./NavBar";
import Code from "./Code";

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const MainPage = observer(() => {
  return (
    <Container>
      <NavBar></NavBar>
      <Code></Code>
    </Container>
  );
});

export default MainPage;

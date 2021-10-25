import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import MainPage from "./components/MainPage";
import TitleBar from "./components/TitleBar";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
`;

const App = observer(() => {
  return (
    <Container>
      <TitleBar></TitleBar>
      <MainPage></MainPage>
    </Container>
  );
});

export default App;

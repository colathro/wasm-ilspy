import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Label } from "spacedog";

const Container = styled.div`
  height: 72px;
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  justify-content: space-between;
`;

const SpacedogLabs = styled.img`
  height: 48px;
  margin-left: 2em;
  margin-right: 2em;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  &:hover {
    background-color: lightgrey;
  }
  margin-right: 2em;
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
`;

const Github = styled.img`
  height: 32px;
`;

const TitleBar = observer(() => {
  const onClickGithub = () => {
    window.open("https://github.com/spacedog-labs/spil", "_blank");
  };
  return (
    <Container>
      <LogoContainer>
        <SpacedogLabs src="images/spacedoglabs.svg" />
        <Label text="WASM based IL Decompiler" size={3} />
      </LogoContainer>
      <LinkContainer onClick={onClickGithub}>
        <Github src="images/github.svg" />
      </LinkContainer>
    </Container>
  );
});

export default TitleBar;

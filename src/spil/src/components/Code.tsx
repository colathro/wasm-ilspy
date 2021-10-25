import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import globalState from "../GlobalState";
import { GetCSharpCode } from "../Interop";
import { findByLabelText } from "@testing-library/dom";

const Container = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const CodeContainer = styled.div`
  max-width: 1000em;
  overflow: scroll;
`;

const Code = observer(() => {
  const [code, setCode] = useState<string | null>();
  GetCSharpCode(
    globalState.renderedMember?.assembly,
    globalState.renderedMember?.module,
    globalState.renderedMember?.topLevelTypeDefinition,
    globalState.renderedMember?.member,
    setCode
  );
  return (
    <Container>
      <CodeContainer>
        {code != null ? (
          <SyntaxHighlighter
            language="csharp"
            style={prism}
            showLineNumbers={true}
            wrapLines={true}
            codeTagProps={{
              style: { fontFamily: "font-family: Roboto, sans-serif" },
            }}
            customStyle={{
              overflow: "scroll",
              backgroundColor: "#ffffff",
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <></>
        )}
      </CodeContainer>
    </Container>
  );
});

export default Code;

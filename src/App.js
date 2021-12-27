import { useEffect, useState } from "react";
import logo from "./logo.svg";
import styled, { createGlobalStyle } from "styled-components";
import "./App.css";

const StyledButton = styled.button`
  width: 150px;
`;

const GlobalStyle = createGlobalStyle`
  & body {
    padding: 40px;
  }
`;

const StyledApp = styled.div`
  height: ${(props) => `${props.height}px`};

  ${StyledButton} {
    background: green;
  }
`;

const StyledP = styled.p`
  padding-top: 20px;
  padding-bottom: 20px;
`;

function Button(props) {
  return <StyledButton {...props}> Just a button </StyledButton>;
}

function App() {
  const [height, setHeight] = useState(0);
  const [haveGlobalStyles, toggleGlobalStyle] = useState(true);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
    });
  });

  return (
    <StyledApp className="App" height={height}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <StyledP>
          Edit <code>src/App.js</code> and save to reload.
        </StyledP>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {haveGlobalStyles && (
          <Button onClick={() => toggleGlobalStyle(!haveGlobalStyles)} />
        )}
      </header>
      {haveGlobalStyles && <GlobalStyle />}
    </StyledApp>
  );
}

export default App;

import React from "react";
import { observer } from "mobx-react-lite";
import Assemblies from "./components/Assemblies";
import FileInput from "./components/FileInput";
import { getAssemblies } from "./Interop";

const App = observer(() => {
  return (
    <div className="App">
      <button
        onClick={() => {
          getAssemblies();
        }}
      >
        Get Assemblies
      </button>
      <FileInput />
      <Assemblies />
    </div>
  );
});

export default App;

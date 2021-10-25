import React, { useRef } from "react";
import { addAssembly } from "../Interop";
import { Button } from "spacedog";

function FileInput() {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current!.click();
  };
  const onFileInputChange = (fileList: FileList | null) => {
    if (fileList == null) {
      return;
    }

    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      addAssembly(file);
    }
  };
  return (
    <div>
      <input
        type="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={(ev) => {
          console.log(ev);
          onFileInputChange(ev.target.files);
        }}
        multiple
      />
      <Button onClick={onButtonClick}>Add a DLL</Button>
    </div>
  );
}

export default FileInput;

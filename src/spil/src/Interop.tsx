import globalState, {
  Assembly,
  Module,
  TopLevelTypeDefinition,
  Member,
} from "./GlobalState";

declare var DotNet: any;
declare global {
  interface Window {
    addAssemblyCallback(fileName: string): void;
  }
}

window.addAssemblyCallback = (fileName: string) => {
  let assembly: Assembly = { name: fileName, modules: [] };
  populateAssemblyInfo(assembly, (assembly: any) => {
    globalState.assemblies.push(assembly);
  });
};

export const getAssemblies = () => {
  DotNet.invokeMethodAsync("spil", "GetLoadedAssemblies").then((data: any) => {
    console.log(data);
  });
};

export const addAssembly = (file: File) => {
  const reader = new FileReader();
  reader.addEventListener("loadend", (ev) => {
    DotNet.invokeMethodAsync(
      "spil",
      "AddAssembly",
      file.name,
      _arrayBufferToUint8Array(ev.target!.result)
    ).then((data: any) => {
      console.log(data);
    });
  });
  reader.readAsArrayBuffer(file);
};

export const populateAssemblyInfo = async (
  assembly: Assembly,
  callback: any
) => {
  let modules: string[] = await DotNet.invokeMethodAsync(
    "spil",
    "GetModules",
    assembly.name
  );

  modules.forEach((moduleName) => {
    let module: Module = new Module(moduleName);
    assembly.modules.push(module);
  });

  for (let module of assembly.modules) {
    let topLevelTypeDefinitions: string[] = await DotNet.invokeMethodAsync(
      "spil",
      "GetTopLevelMembers",
      assembly.name,
      module.name
    );

    topLevelTypeDefinitions.forEach((topLevelTypeDefinitionName) => {
      let topLevelTypeDefinition: TopLevelTypeDefinition =
        new TopLevelTypeDefinition(topLevelTypeDefinitionName);
      module.topLevelTypeDefinitions.push(topLevelTypeDefinition);
    });

    for (const topLevelTypeDefinition of module.topLevelTypeDefinitions) {
      let members: string[] = await DotNet.invokeMethodAsync(
        "spil",
        "GetMembers",
        assembly.name,
        module.name,
        topLevelTypeDefinition.name
      );

      members.forEach((memberName) => {
        let member: Member = new Member(memberName);
        topLevelTypeDefinition.members.push(member);
      });
    }
  }
  callback(assembly);
};

export const GetCSharpCode = async (
  assembly: string | undefined,
  module: string | undefined,
  topLevelTypeDefinition: string | undefined,
  member: string | undefined,
  callback: (code: string) => void
) => {
  if (assembly === undefined) {
    return;
  }
  let code: string = await DotNet.invokeMethodAsync(
    "spil",
    "GetCSharpCode",
    assembly,
    module,
    topLevelTypeDefinition,
    member
  );
  callback(code);
};

const _arrayBufferToUint8Array = (buffer: ArrayBuffer | null | string) => {
  if (typeof buffer === "string" || buffer instanceof String) {
    return;
  }
  return new Uint8Array(buffer!);
};

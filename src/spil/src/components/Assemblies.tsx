import React from "react";
import globalState from "../GlobalState";
import { observer } from "mobx-react-lite";

const Assemblies = observer(() => {
  return (
    <div>
      {globalState.assemblies.map((assembly) => {
        console.log(assembly.modules[0].name);
        return (
          <div>
            {assembly.name}
            <div>
              {assembly.modules.map((module) => {
                return (
                  <div>
                    {module.topLevelTypeDefinitions.map((tltd) => {
                      return (
                        <div>
                          {tltd.members.map((member) => {
                            return <div>{member.name}</div>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default Assemblies;

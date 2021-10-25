import React from "react";
import { observer } from "mobx-react-lite";
import globalState, { RenderedMember } from "../GlobalState";
import styled from "styled-components";
import { Tree } from "spacedog";
import { Branch } from "spacedog/build/Tree/Tree.types";
import FileInput from "./FileInput";

const Container = styled.div`
  display: flex;
  width: 460px;
  padding: 8px;
  overflow-y: scroll;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
`;

const NavBar = observer(() => {
  const rootBranches: Branch[] = [];

  for (const assembly of globalState.assemblies) {
    const assemblyBranch: Branch = {
      name: assembly.name,
      icon: AssemblyIcon,
      expanded: true,
      branches: [],
    };
    for (const module of assembly.modules) {
      const moduleBranch: Branch = {
        name: module.name,
        expanded: false,
        icon: ModuleIcon,
        branches: [],
      };
      for (const tltd of module.topLevelTypeDefinitions) {
        const tltdBranch: Branch = {
          name: tltd.name,
          expanded: false,
          icon: TopLevelTypeDefinitionIcon,
          branches: [],
          onClick: (props, unselectCallback) => {
            const renderedMember: RenderedMember = {
              assembly: assembly.name,
              module: module.name,
              topLevelTypeDefinition: tltd.name,
              member: "",
              unselectCallback: unselectCallback,
            };
            if (globalState.renderedMember?.unselectCallback !== undefined) {
              globalState.renderedMember?.unselectCallback.current(false);
            }
            globalState.renderedMember = renderedMember;
          },
        };
        for (const member of tltd.members) {
          const memberBranch: Branch = {
            name: member.name,
            expanded: false,
            branches: [],
            icon: MemberIcon,
            onClickData: { props: {} },
            onClick: (props, unselectCallback) => {
              console.log("member click");
              const renderedMember: RenderedMember = {
                assembly: assembly.name,
                module: module.name,
                topLevelTypeDefinition: tltd.name,
                member: member.name,
                unselectCallback: unselectCallback,
              };
              if (globalState.renderedMember?.unselectCallback !== undefined) {
                globalState.renderedMember?.unselectCallback.current(false);
              }
              globalState.renderedMember = renderedMember;
            },
          };
          tltdBranch.branches?.push(memberBranch);
        }
        moduleBranch.branches?.push(tltdBranch);
      }
      assemblyBranch.branches?.push(moduleBranch);
    }
    rootBranches.push(assemblyBranch);
  }

  return (
    <Container>
      <FileInput />
      {rootBranches.map((branch) => (
        <Tree key={branch.name} branch={branch}></Tree>
      ))}
    </Container>
  );
});

const AssemblyIcon = (
  <svg
    width="9"
    height="12"
    viewBox="0 0 9 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M-2.12193e-05 -7.62939e-06H1.49998L1 1V6.5V12H-2.12193e-05V-7.62939e-06Z"
      fill="#121313"
    />
    <path
      d="M2.99997 0.0606526L5.06063 -7.62939e-06L6.56063 1.49999L7.49996 2.43933L8.99996 3.93933C8.99996 3.93933 8.99996 5.23222 8.99996 6.06064C8.41417 5.47486 8 4.5 8 4.5L4.5 1L2.99997 0.0606526Z"
      fill="#121313"
    />
    <path d="M8 11H8.99996V6.06064L8 4.5V7V11Z" fill="#121313" />
    <path
      d="M1.49998 -7.62939e-06L1 1H4.5L2.99997 0.0606526L5.06063 -7.62939e-06H1.49998Z"
      fill="#121313"
    />
    <path d="M1 12H8V11H1V12Z" fill="#121313" />
    <path d="M8 12H8.99996V11H8V12Z" fill="#121313" />
  </svg>
);

const ModuleIcon = (
  <svg
    width="11"
    height="12"
    viewBox="0 0 11 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 5.4878C0.320702 5.4795 0.58199 5.39427 0.783866 5.22955C0.986062 5.06515 1.12022 4.83818 1.18698 4.5512C1.25374 4.26453 1.28888 3.77324 1.29335 3.07829C1.2975 2.38302 1.30996 1.92525 1.33072 1.70466C1.36809 1.35511 1.43805 1.07387 1.53994 0.861589C1.64184 0.649304 1.76801 0.479796 1.91782 0.352744C2.06795 0.225692 2.25929 0.128967 2.49278 0.0622489C2.6509 0.0207496 2.90931 0 3.26771 0H3.61748V0.980341H3.4239C2.99109 0.980341 2.70328 1.05855 2.56178 1.21465C2.42027 1.37075 2.34936 1.71935 2.34936 2.26043C2.34936 3.35123 2.32668 4.04012 2.28069 4.3271C2.20594 4.7721 2.07753 5.11527 1.89642 5.35692C1.71563 5.59825 1.43102 5.81277 1.04356 6.00016C1.50193 6.19169 1.83413 6.48506 2.04016 6.87835C2.24619 7.27163 2.34936 7.91487 2.34936 8.80998C2.34936 9.62145 2.35767 10.1044 2.3746 10.2583C2.40782 10.5415 2.49215 10.7394 2.62758 10.8514C2.76302 10.9641 3.02846 11.02 3.4239 11.02H3.61748V12H3.26771C2.85948 12 2.5637 11.9668 2.38067 11.9001C2.11395 11.8043 1.89323 11.6504 1.71818 11.4359C1.54346 11.2214 1.43006 10.9491 1.37799 10.62C1.32593 10.2909 1.29782 9.75201 1.29367 9.00311C1.28919 8.25357 1.25406 7.73547 1.1873 7.44817C1.12054 7.16118 0.986381 6.93421 0.784186 6.76758C0.58231 6.60126 0.321021 6.51379 0.000319553 6.50549V5.4878H0Z"
      fill="black"
    />
    <path
      d="M11 5.4878V6.50549C10.6793 6.51379 10.418 6.60126 10.2161 6.76758C10.0139 6.93389 9.87978 7.16086 9.81302 7.44625C9.74626 7.73132 9.71113 8.22037 9.70665 8.91564C9.7025 9.61092 9.69004 10.0687 9.66928 10.2893C9.63191 10.643 9.56195 10.9261 9.46006 11.1365C9.35816 11.3465 9.23199 11.5154 9.08218 11.6421C8.93205 11.7689 8.74071 11.8646 8.50722 11.9314C8.34878 11.9773 8.09069 12 7.73229 12H7.38252V11.02H7.5761C8.00891 11.02 8.29672 10.943 8.43822 10.7869C8.57973 10.6308 8.65064 10.2791 8.65064 9.73382C8.65064 8.69314 8.66948 8.03331 8.70686 7.75462C8.7733 7.2927 8.90682 6.924 9.10677 6.64723C9.30673 6.37046 9.59006 6.15403 9.95612 6.00016C9.47731 5.77096 9.13968 5.46929 8.94419 5.0926C8.74838 4.71592 8.65064 4.07938 8.65064 3.18459C8.65064 2.3728 8.6401 1.8879 8.61901 1.72956C8.58995 1.45056 8.50754 1.25615 8.37242 1.1457C8.2373 1.03525 7.97154 0.980022 7.5761 0.980022H7.38252V0H7.73229C8.14052 0 8.4363 0.0331994 8.61933 0.0999175C8.88605 0.191535 9.10677 0.345721 9.2815 0.562156C9.45654 0.778591 9.56994 1.05121 9.62201 1.38001C9.67407 1.70881 9.70218 2.24798 9.70633 2.99721C9.71081 3.74643 9.74594 4.26357 9.8127 4.54928C9.87946 4.83435 10.0136 5.05908 10.2158 5.22572C10.4177 5.39204 10.6793 5.4795 11 5.4878Z"
      fill="black"
    />
  </svg>
);

const TopLevelTypeDefinitionIcon = (
  <svg
    width="8"
    height="12"
    viewBox="0 0 8 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0V1H6V0H0Z" fill="#121313" />
    <path d="M6 1H0V4H1H2H6V1Z" fill="#121313" />
    <path d="M1 4V7H2H4V6H2V4H1Z" fill="#121313" />
    <path d="M4 6V7V8H8V5H4V6Z" fill="#121313" />
    <path d="M1 7V11H2V10V7H1Z" fill="#121313" />
    <path d="M2 10V11H3V10H2Z" fill="#121313" />
    <path d="M3 10V11H4V10H3Z" fill="#121313" />
    <path d="M4 10V11V12H8V9H4V10Z" fill="#121313" />
  </svg>
);

const MemberIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.999969 2V5.5L3.99997 7M0.999969 2L4 0.5L6.99997 2M0.999969 2L3.99997 3.5M6.99997 2L3.99997 3.5M6.99997 2V5.5L3.99997 7M3.99997 3.5V7"
      stroke="black"
      stroke-width="0.8"
    />
  </svg>
);

export default NavBar;

import { makeAutoObservable } from "mobx";
import { MutableRefObject } from "react";

class GlobalState {
  assemblies: Assembly[];

  renderedMember: RenderedMember | undefined;

  constructor() {
    makeAutoObservable(this);
    this.assemblies = [];
  }
}

export type RenderedMember = {
  assembly: string;
  module: string;
  topLevelTypeDefinition: string;
  member: string;
  unselectCallback: MutableRefObject<(isSelected: boolean) => void>;
};

export class Assembly {
  // actual main file
  name: string;
  modules: Module[];

  constructor(name: string) {
    //makeAutoObservable(this);
    this.name = name;
    this.modules = [];
  }
}

export class Module {
  // top level module, think included code
  name: string;
  topLevelTypeDefinitions: TopLevelTypeDefinition[];

  constructor(name: string) {
    //makeAutoObservable(this);
    this.name = name;
    this.topLevelTypeDefinitions = [];
  }
}

export class TopLevelTypeDefinition {
  // kinda like classes
  name: string;
  members: Member[];
  code: string;

  constructor(name: string) {
    //makeAutoObservable(this);
    this.name = name;
    this.members = [];
    this.code = "";
  }
}

export class Member {
  name: string;
  code: string;

  constructor(name: string) {
    //makeAutoObservable(this);
    this.name = name;
    this.code = "";
  }
}

var globalState = new GlobalState();

export default globalState;

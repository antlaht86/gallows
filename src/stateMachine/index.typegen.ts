// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions:
      | "setWord"
      | "addCharAction"
      | "exitCheckWord"
      | "isAllCharSelected";
    services: never;
    guards: "isWordSettled";
    delays: never;
  };
  eventsCausingActions: {
    addCharAction: "ADD_CHAR";
    countScore: "DONE" | "TO_DONE";
    exitCheckWord:
      | "BACK_TO_SHADOW_WORD"
      | "TO_DONE"
      | "TO_LOSE"
      | "xstate.stop";
    isAllCharSelected: "ADD_CHAR";
    reset: "RESET";
    setWord: "SET_WORD";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    isWordSettled: "START";
  };
  eventsCausingDelays: {};
  matchesStates: "checkWord" | "done" | "lose" | "shadowWord" | "start";
  tags: never;
}

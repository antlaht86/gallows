import { createMachine } from "xstate";
import { send } from "xstate/lib/actions";

type Events =
  | {
      type: "START";
    }
  | {
      type: "ADD_CHAR";
      char: string;
    }
  | {
      type: "DONE";
    }
  | {
      type: "RESET";
    }
  | {
      type: "SET_WORD";
      word: string[];
    }
  | {
      type: "BACK_TO_SHADOW_WORD";
    }
  | {
      type: "TO_DONE";
    }
  | {
      type: "TO_LOSE";
    };
export const gallowsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDsCGBbMB5AZgOlgBdUAnQgYgGUBRAFQH0B1LAJQBFFQAHAe1gEtC-Hsk4gAHogC0ARgAscgAx4ArAA4AnADYZGtQGYATIYDsGmQBoQAT2lbteGTMWKVWlTJP6t+uQF8-KzRMXAJiMipaAEEWWjFeASERMUkEWS0fPDV1JRMTOV85Sxs7ORM8PV9DDRUVU0MtNQCgjGx8WAALVAgeAHdGHhIIcii2NnoAYQAJGPi+QWFRJAlpXX19PG81GQMXbLVFQytbNJU5NTxFfMN9FVu8vRlmkGC2gi6e-sHhtiwAOWoc0SixSqzMFzWGkUZWcJiOJTS+jUWiy1zhujK60M-kCL1aoQAxh0wASANYDIbkABCUQmAGl6LQsPRKDNfowmKwOMsEgtkstUrIzuUbrUjHIGi4VMdpIY6nhDDJjB53KYzIotM9XoTiWSKcMmfRfgCgXylqBBTJ1nI8PYTJo1Gp8uo1HIZWkCgqVDVvD4ZLUNGUtfj8ESSeTvuRDQAZLA0U1Jc0rNL+-KXfQmO6KDRI6H5d2yW2urRyFR5O72fQ7EzBkL4AA2fDA5BY1BocR580ToJTWkUGzkPmyigMxkDagLvhUqhk7m0vh8RjctbePWQzdb7YTIIFqyMG0dOecs5HTonCKkWkVjiuYo8+6aWp4EDgYm17XChG3-ItYLyjnOOQoXyU9DHPE4pEzacrgULQTHkbxM01XF33ebo+n1b8k0tHwUXgwd3BHJV4JMAsFGnJUoQ1KsSzMBoVx1cNMM7YEf2TWQcw2NxtCKBRAxueEILAww8BIu45The1-QYhsmywnt0hLS4ihqR0wP0PRSIvJw8PtMsrgaNRqhkvA1zAeTdxTDTyntPIDCUQN-Q0MiFCyOpDEOQyGmMlCQws38UxqcpuJLeQgIlIwCyM8oYMHWpXSM7MAgCIA */
  createMachine(
    {
      context: { word: [], chars: [], score: 100 },
      tsTypes: {} as import("./index.typegen").Typegen0,
      schema: {
        context: {} as { word: string[]; chars: string[]; score: number },
        events: {} as Events,
      },
      predictableActionArguments: true,
      initial: "start",
      states: {
        start: {
          on: {
            SET_WORD: {
              actions: "setWord",
              target: "start",
              internal: false,
            },
            START: {
              cond: "isWordSettled",
              target: "shadowWord",
            },
          },
        },
        shadowWord: {
          on: {
            ADD_CHAR: {
              actions: "addCharAction",
              target: "checkWord",
            },
            DONE: {
              target: "done",
            },
          },
        },
        checkWord: {
          entry: "isAllCharSelected",
          exit: "exitCheckWord",
          on: {
            BACK_TO_SHADOW_WORD: {
              target: "shadowWord",
            },
            TO_DONE: {
              target: "done",
            },
            TO_LOSE: {
              target: "lose",
            },
          },
        },
        lose: {
          on: {
            RESET: {
              actions: "reset",
              target: "start",
            },
          },
        },
        done: {
          entry: "countScore",
          on: {
            RESET: {
              actions: "reset",
              target: "start",
            },
          },
        },
      },
      id: "gallowMachine",
    },
    {
      actions: {
        reset: (context, event) => {
          context.chars = [];
          context.word = [];
        },
        countScore: (context, event) => {
          const notCorrectChar = context.chars.filter(
            (char) => !context.word.includes(char)
          );
          context.score = notCorrectChar.length;
        },
      },
    }
  );

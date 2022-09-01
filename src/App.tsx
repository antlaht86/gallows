import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useMachine } from "@xstate/react";
import { gallowsMachine } from "./stateMachine";
import Gallows from "./components/gallows";

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const [state, send] = useMachine(gallowsMachine, {
    guards: {
      isWordSettled: (context, event) => {
        return context.word.length > 2;
      },
    },
    actions: {
      setWord: (context, event) => {
        context.word = event.word;
      },
      exitCheckWord: (_, event) => {
        if (event.type === "BACK_TO_SHADOW_WORD") {
          ref.current?.focus();
        }
      },
      addCharAction: (context, event) => {
        if (typeof event.char === "string" && event.char.trim() !== "") {
          const temp = context.chars.concat([event.char]);
          context.chars = Array.from(new Set(temp));
        }
      },
      isAllCharSelected: (context, event) => {
        const word = context.word;
        const chars = context.chars;

        const temp = word.every((char) => {
          return chars.includes(char);
        });

        const notCorrectLetter = getNotCorrectLetterAmount(word, chars);
        if (notCorrectLetter > 11) {
          send({ type: "TO_LOSE" });
        } else if (temp) {
          send({ type: "TO_DONE" });
        } else {
          send({ type: "BACK_TO_SHADOW_WORD" });
        }
      },
    },
  });
  console.log("➡️ state: ", state.value);
  console.log("➡️ word: ", state.context.word);

  useEffect(() => {
    if (state.value === "shadowWord") {
      ref.current?.focus();
    }
    if (state.value === "start") {
      wordInputRef.current?.focus();
      // send({
      //   type: "SET_WORD",
      //   word: ["a", "p", "i"],
      // });
      // send({ type: "START" });
    }
  }, [state.value]);
  const value = wordInputRef.current?.value;
  console.log("➡️ value: ", value);

  const handleOnChangeWord = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTargeValue = event.target.value;

    if (testInput(eventTargeValue) || eventTargeValue.length === 0) {
      send({
        type: "SET_WORD",
        word: eventTargeValue?.toLowerCase()?.trim()?.split(""),
      });
    }
  };

  const handleOnKeyDownWordInput = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === "Enter") {
      send({ type: "START" });
    }
  };

  const handleOnKeyDownCharInput = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const val = ref.current?.value?.toLowerCase().trim() ?? "";

    if (event.code === "Enter" && testInput(val)) {
      send({
        type: "ADD_CHAR",
        char: val,
      });
      if (ref.current) {
        ref.current.value = "";
      }
    }
  };

  switch (state.value) {
    case "start":
      return (
        <div>
          <div className="start-container">
            <h1>Welcome to play the gallows game!</h1>
            <input
              className="big word-start"
              placeholder={"Add the word to be guessed"}
              ref={wordInputRef}
              value={state.context.word.join("")}
              onChange={handleOnChangeWord}
              onKeyDown={handleOnKeyDownWordInput}
              type="text"
              minLength={3}
            ></input>
            <button
              className="star-button"
              onClick={(_) => send({ type: "START" })}
            >
              start
            </button>
          </div>
        </div>
      );
    case "checkWord":
    case "shadowWord":
    case "done":
    case "lose":
      return (
        <div className="word-container">
          <Gallows
            lose={state.matches("lose")}
            show={getNotCorrectLetterAmount(
              state.context.word,
              state.context.chars
            )}
          />

          <div className="word">
            <ul>
              {state.context.word.map((char, index) => {
                return (
                  <li key={index} className="char">
                    {state.context.chars.includes(char) || state.matches("lose")
                      ? char
                      : "_"}
                  </li>
                );
              })}
            </ul>
            <span>
              {getCorrectLetterAmount(state.context.word, state.context.chars)}{" "}
              / {state.context.word.length}
            </span>
          </div>
          <div>
            <input
              disabled={state.matches("done") || state.matches("lose")}
              className="small"
              placeholder={"add a Letter"}
              onKeyDown={handleOnKeyDownCharInput}
              ref={ref}
              type="text"
              maxLength={1}
            ></input>
            <button
              disabled={state.matches("done") || state.matches("lose")}
              className="word-button"
              onClick={(_) => {
                const val = ref.current?.value?.toLowerCase()?.trim() ?? "";
                if (testInput(val)) {
                  send({
                    type: "ADD_CHAR",
                    char: val,
                  });
                  if (ref.current) {
                    ref.current.value = "";
                  }
                }
              }}
            >
              <span> {"►"}</span>
            </button>
          </div>
          <div className="used-char">
            {state.context.chars.length > 0 ? (
              <ul>
                {state.context.chars.map((char, index) => {
                  if (!state.context.word.includes(char)) {
                    return <li key={index}>{char}</li>;
                  }
                })}
              </ul>
            ) : (
              <div style={{ marginTop: "3rem" }}>&nbsp;</div>
            )}
          </div>
          {state.matches("done") && (
            <div className="done-message">
              <span>GREAT!</span>
              <span>
                Your score is: {state.context.word.length} /{" "}
                {state.context.score}{" "}
              </span>
              <button onClick={(_) => send("RESET")}>play again?</button>
            </div>
          )}

          {state.matches("lose") && (
            <div className="done-message">
              <span>You lose!</span>
              <button onClick={(_) => send("RESET")}>play again?</button>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

const getNotCorrectLetterAmount = (word: string[], chars: string[]) => {
  const temp = chars.filter((char) => !word.includes(char));
  return temp.length;
};

const getCorrectLetterAmount = (word: string[], chars: string[]) => {
  const temp = word.filter((char) => chars.includes(char));
  return temp.length;
};

function testInput(val: string) {
  const pattern = new RegExp(/^[a-zåäö]+$/gi);
  return pattern.test(val);
}
export default App;

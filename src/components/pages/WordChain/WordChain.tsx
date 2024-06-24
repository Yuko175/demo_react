import React, { useEffect, useState } from "react";
import "./WordChain.css";
import JapaneseToEnglish from "../../parts/Button/JapaneseToEnglish/JapaneseToEnglish";
import EnglishToJapanese from "../../parts/Button/EnglishToJapanese/EnglishToJapanese";
import WordChainSubmit from "../../parts/Button/WordChainSubmit/WordChainSubmit";
import userEvent from "@testing-library/user-event";

export default function WordChain() {
  const [JapaneseQuestion, setJapaneseQuestion] = useState<string>("お題");
  const [hiraganaQuestion, setHiraganaQuestion] = useState<string>("おだい");
  const [EnglishQuestion, setEnglishQuestion] = useState<string>("theme");
  const [JapaneseAnswer, setJapaneseAnswer] = useState<string>("");
  const [EnglishAnswer, setEnglishAnswer] = useState<string>("");
  const [EnglishAnswerList, setEnglishAnswerList] = useState<Array<string>>([]);
  const [JapaneseAnswerList, setJapaneseAnswerList] = useState<Array<string>>([]);
  const [judge1, setJudge1] = useState<string>("");
  const [judge2, setJudge2] = useState<string>("");
  const [judge3, setJudge3] = useState<string>("");

  useEffect(() => {
    clear();
  }, [JapaneseQuestion]);

  const clear = () => {
    setJapaneseAnswer("");
    setJapaneseAnswerList([""]);
    setEnglishAnswer("");
    setEnglishAnswerList([""]);
    setJudge1("入力と候補：　　");
    setJudge2("しりとり英語：　　");
    setJudge3("しりとり日本語：　　");
  };

  return (
    <>
      <div className="center">
        <br />
        <div>
          {JapaneseQuestion}({hiraganaQuestion})
        </div>
        <div>{EnglishQuestion}</div>
        <br />
        <ul className="grid-items">
          <li>
            <div>日本語</div>
            <JapaneseToEnglish
              JapaneseAnswer={JapaneseAnswer}
              setJapaneseAnswer={setJapaneseAnswer}
              setJapaneseAnswerList={setJapaneseAnswerList}
              setEnglishAnswerList={setEnglishAnswerList}
            />
            <div>{JapaneseAnswerList}</div>
          </li>
          <li>
            <div>English</div>
            <EnglishToJapanese
              EnglishAnswer={EnglishAnswer}
              setEnglishAnswer={setEnglishAnswer}
              setEnglishAnswerList={setEnglishAnswerList}
              setJapaneseAnswerList={setJapaneseAnswerList}
            />
            <div>{EnglishAnswerList}</div>
          </li>
        </ul>
        <br />
        <button onClick={() => clear()}>clear</button>
        <WordChainSubmit
          hiraganaQuestion={hiraganaQuestion}
          setHiraganaQuestion={setHiraganaQuestion}
          setJapaneseQuestion={setJapaneseQuestion}
          JapaneseAnswer={JapaneseAnswer}
          JapaneseAnswerList={JapaneseAnswerList}
          EnglishQuestion={EnglishQuestion}
          setEnglishQuestion={setEnglishQuestion}
          EnglishAnswer={EnglishAnswer}
          EnglishAnswerList={EnglishAnswerList}
          judge1={judge1}
          setJudge1={setJudge1}
          judge2={judge2}
          setJudge2={setJudge2}
          judge3={judge3}
          setJudge3={setJudge3}
        />
      </div>
    </>
  );
}

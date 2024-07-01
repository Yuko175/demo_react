import axios from "axios";
import React, { useState } from "react";

interface JapaneseToEnglishProps {
  JapaneseAnswer: string;
  setJapaneseAnswer: React.Dispatch<React.SetStateAction<string>>;
  setJapaneseAnswerList: React.Dispatch<React.SetStateAction<Array<string>>>;
  setEnglishAnswerList: React.Dispatch<React.SetStateAction<Array<string>>>;
}

export default function JapaneseToEnglish({
  JapaneseAnswer,
  setJapaneseAnswer,
  setJapaneseAnswerList,
  setEnglishAnswerList,
}: JapaneseToEnglishProps) {
  const changeHiragana = (JapaneseAnswer: string): Promise<Array<string>> => {
    return new Promise<Array<string>>((resolve, reject) => {
      axios
        .get("http://localhost:8090/search/hiragana/" + JapaneseAnswer, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          //TODO:小さい文字を大きな文字に
          //TODO:カタカナをひらがなに
          resolve(response.data);
        })
        .catch((error) => {
          reject();
        });
    });
  };

  const getData = (JapaneseAnswer: string) => {
    axios
      .get("http://localhost:8090/search/change/je/" + JapaneseAnswer, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEnglishAnswerList(response.data);
        changeHiragana(JapaneseAnswer).then((response) => {
          setJapaneseAnswerList(response);
        });
      })
      .catch((error) => {
        setEnglishAnswerList(["!error!"]);
        setJapaneseAnswerList([JapaneseAnswer]);
      });
  };
  return (
    <>
      <input
        type="text"
        value={JapaneseAnswer}
        onChange={(e) => setJapaneseAnswer(e.target.value)}></input>
      <button onClick={() => getData(JapaneseAnswer)}>検索</button>
    </>
  );
}

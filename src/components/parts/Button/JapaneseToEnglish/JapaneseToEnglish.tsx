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
  const getData = (JapaneseAnswer: string) => {
    axios
      .get("http://localhost:8090/search/change/" + JapaneseAnswer + "/je", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEnglishAnswerList(response.data);
        setJapaneseAnswerList([JapaneseAnswer]);
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

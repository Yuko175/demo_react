import axios from "axios";
import React, { useState } from "react";

interface EnglishToJapaneseProps {
  EnglishAnswer: string;
  setEnglishAnswer: React.Dispatch<React.SetStateAction<string>>;
  setEnglishAnswerList: React.Dispatch<React.SetStateAction<Array<string>>>;
  setJapaneseAnswerList: React.Dispatch<React.SetStateAction<Array<string>>>;
}

export default function EnglishToJapanese({
  EnglishAnswer,
  setEnglishAnswer,
  setEnglishAnswerList,
  setJapaneseAnswerList,
}: EnglishToJapaneseProps) {
  const getData = (EnglishAnswer: string) => {
    axios
      .get("http://localhost:8090/search/change/ej/" + EnglishAnswer, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const originalJapaneseAnswerList = response.data;
        const cleanedJapaneseAnswerList = new Array<string>();
        for (const JapaneseAnswerList of originalJapaneseAnswerList) {
          cleanedJapaneseAnswerList.push(JapaneseAnswerList.trim());
        }
        setJapaneseAnswerList(cleanedJapaneseAnswerList);
        setEnglishAnswerList([EnglishAnswer]);
      })
      .catch((error) => {
        setJapaneseAnswerList(["!エラー!"]);
        setEnglishAnswerList([EnglishAnswer]);
      });
  };
  return (
    <>
      <input
        type="text"
        value={EnglishAnswer}
        onChange={(e) => setEnglishAnswer(e.target.value)}></input>
      <button onClick={() => getData(EnglishAnswer)}>search</button>
    </>
  );
}

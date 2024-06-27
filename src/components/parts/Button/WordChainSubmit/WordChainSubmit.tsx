import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

interface WordChainSubmitProps {
  hiraganaQuestion: string;
  setHiraganaQuestion: React.Dispatch<React.SetStateAction<string>>;
  setJapaneseQuestion: React.Dispatch<React.SetStateAction<string>>;
  JapaneseAnswer: string;
  JapaneseAnswerList: Array<string>;
  EnglishQuestion: string;
  setEnglishQuestion: React.Dispatch<React.SetStateAction<string>>;
  EnglishAnswer: string;
  EnglishAnswerList: Array<string>;
  judge1: string;
  setJudge1: React.Dispatch<React.SetStateAction<string>>;
  judge2: string;
  setJudge2: React.Dispatch<React.SetStateAction<string>>;
  judge3: string;
  setJudge3: React.Dispatch<React.SetStateAction<string>>;
}

export default function WordChainSubmit({
  hiraganaQuestion,
  setHiraganaQuestion,
  setJapaneseQuestion,
  JapaneseAnswer,
  JapaneseAnswerList,
  EnglishQuestion,
  setEnglishQuestion,
  EnglishAnswer,
  EnglishAnswerList,
  judge1,
  setJudge1,
  judge2,
  setJudge2,
  judge3,
  setJudge3,
}: WordChainSubmitProps) {
  const submitAnswer = (
    JapaneseAnswer: string,
    JapaneseAnswerList: Array<string>,
    EnglishAnswer: string,
    EnglishAnswerList: Array<string>
  ) => {
    //お題の書き換え(成功)
    canSubmit(JapaneseAnswer, JapaneseAnswerList, EnglishAnswer, EnglishAnswerList)
      .then((hiraganaAnswer) => {
        setHiraganaQuestion(hiraganaAnswer);
        setJapaneseQuestion(JapaneseAnswer);
        setEnglishQuestion(EnglishAnswer);
      })
      .catch(() => {});
  };

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

  const canSubmit = (
    JapaneseAnswer: string,
    JapaneseAnswerList: Array<string>,
    EnglishAnswer: string,
    EnglishAnswerList: Array<string>
  ) => {
    return new Promise<string>((resolve, reject) => {
      //入力と候補の一致
      let canSubmit = true;
      if (
        JapaneseAnswer !== "" &&
        JapaneseAnswerList.includes(JapaneseAnswer) &&
        EnglishAnswer !== "" &&
        EnglishAnswerList.includes(EnglishAnswer)
      ) {
        setJudge1("入力と候補：成功");
      } else {
        setJudge1("入力と候補：失敗");
        canSubmit = false;
      }
      //しりとり英語
      if (EnglishQuestion.slice(-1) === EnglishAnswer[0]) {
        setJudge2("しりとり英語：成功");
      } else {
        setJudge2("しりとり英語：失敗");
        canSubmit = false;
      }
      //しりとり日本語
      changeHiragana(JapaneseAnswer)
        .then((response) => {
          if (hiraganaQuestion.slice(-1) === response[0][0]) {
            setJudge3("しりとり日本語：成功");
          } else {
            setJudge3("しりとり日本語：失敗");
            canSubmit = false;
          }
          if (canSubmit) {
            resolve(response[0]);
          } else {
            reject();
          }
        })
        .catch(() => {});
    });
  };

  return (
    <>
      <button
        onClick={() =>
          submitAnswer(JapaneseAnswer, JapaneseAnswerList, EnglishAnswer, EnglishAnswerList)
        }>
        提出
      </button>
      <div style={{ whiteSpace: "pre" }}>{judge1}</div>
      <div style={{ whiteSpace: "pre" }}>{judge2}</div>
      <div style={{ whiteSpace: "pre" }}>{judge3}</div>
    </>
  );
}

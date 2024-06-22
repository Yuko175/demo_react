import React, { useState } from "react";
import "./Dictionary.css";
import Input from "../../parts/Input/Input";
import Output from "../../parts/Output/Output";
import axios from "axios";

export default function Dictionary() {
  interface Dictionary {
    //【backendに持っていく時に書くやつ】

    // backendで返す配列
    //resultList=[
    //  dict1: Dictionary,
    //  dict2:Dictionary,
    //  dict3:Dictionary
    //]

    // (backendで返すものの中身)
    //Dictionary{
    // name: string;
    // topUrl: string;
    // searchUrl: string:
    // resultList : List<string>
    //}

    name: string;
    topUrl: string;
    searchUrl: string;
  }
  //TODO:dictの内容をbackendに持っていく
  const dict1: Dictionary = {
    name: "weblio",
    topUrl: "https://ejje.weblio.jp/",
    searchUrl: "https://ejje.weblio.jp/content/",
  };
  const dict2: Dictionary = {
    name: "英ナビ！辞書",
    topUrl: "https://www.ei-navi.jp/dictionary/",
    searchUrl: "https://www.ei-navi.jp/dictionary/content/",
  };
  const dict3: Dictionary = {
    name: "goo",
    topUrl: "https://dictionary.goo.ne.jp/",
    searchUrl: "https://dictionary.goo.ne.jp/word/en/",
  };

  const [errorText, setErrorText] = useState("");
  const [resultList, setResultList] = useState([[], [], []]);
  const [url1, setUrl1] = useState(dict1.topUrl);
  const [url2, setUrl2] = useState(dict2.topUrl);
  const [url3, setUrl3] = useState(dict3.topUrl);
  const [word, setWord] = useState("");

  const handleClearWord = (setWord: React.Dispatch<React.SetStateAction<string>>) => {
    setWord("");
    setErrorText("");
    setUrl1(dict1.topUrl);
    setUrl2(dict2.topUrl);
    setUrl3(dict3.topUrl);
    setResultList([[], [], []]);
  };

  const getData = (word: string) => {
    axios
      .get("http://localhost:8090/search/" + word, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setErrorText("");
        setResultList(response.data);
        setUrl1(dict1.searchUrl + word);
        setUrl2(dict2.searchUrl + word);
        setUrl3(dict3.searchUrl + word);
      })
      .catch((error) => {
        setErrorText("検索結果がありません。別のワードで検索してください。");
        setResultList([[], [], []]);
      });
  };

  return (
    <>
      <Input getData={() => getData(word)} handleClearWord={() => handleClearWord(setWord)} word={word} setWord={setWord} errorText={errorText} />
      <ul className="grid-items">
        <li>
          <Output url={url1} dictName={dict1.name} result={resultList[0]} />
        </li>
        <li>
          <Output url={url2} dictName={dict2.name} result={resultList[1]} />
        </li>
        <li>
          <Output url={url3} dictName={dict3.name} result={resultList[2]} />
        </li>
      </ul>
    </>
  );
}

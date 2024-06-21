import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function Button() {
  // const [変数名, 変数に新しい数を定義する関数] = useState <型> (初期値);
  const [errorText, setErrorText] = useState<string>("");
  const [resultList, setResultList] = useState<Array<Array<string>>>([[]]);
  const [word, setWord] = useState<string>("");
  const [url1, setUrl1] = useState<string>("https://ejje.weblio.jp/content/");
  const [url2, setUrl2] = useState<string>("https://www.ei-navi.jp/dictionary/content/");
  const [url3, setUrl3] = useState<string>("https://dictionary.goo.ne.jp/word/en/");

  const handleWordChange = (event) => {
    setWord(event.target.value);
  };

  const handleClearWord = (event) => {
    setWord("");
    setErrorText("");
    setUrl1("");
    setUrl2("");
    setUrl3("");
    setResultList([[]]);
  };

  const getData = () => {
    axios
      .get("http://localhost:8090/search/" + word, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setErrorText("");
        setResultList(response.data);
        setUrl1("https://ejje.weblio.jp/content/" + word);
        setUrl2("https://www.ei-navi.jp/dictionary/content/" + word);
        setUrl3("https://dictionary.goo.ne.jp/word/en/" + word);
      })
      .catch((error) => {
        setErrorText("検索結果がありません。別のワードで検索してください。");
        setResultList([[]]);
      });
  };

  //TODO:inputとoutputを分ける
  //TODO:さらにoutputは3つに分ける
  return (
    <>
      <div className="center">
        <div>英語 → 日本語</div>
        <div>{errorText}</div>
        <div>
          <textarea className="textarea" value={word} onChange={(e) => setWord(e.target.value)} />
        </div>
        <button onClick={handleClearWord}>クリア　</button>
        <button onClick={getData}>検索　</button>
      </div>
      <ul className="grid-items">
        <li>
          <div>
            <a href={url1} target="_blank" rel="noopener noreferrer">
              weblio
            </a>
          </div>
          <div>{resultList[0]}</div>
        </li>
        <li>
          <div>
            <a href={url2} target="_blank" rel="noopener noreferrer">
              英ナビ！辞書
            </a>
          </div>
          <div>{resultList[1]}</div>
        </li>
        <li>
          <div>
            <a href={url3} target="_blank" rel="noopener noreferrer">
              goo
            </a>
          </div>
          <div>{resultList[2]}</div>
        </li>
      </ul>
    </>
  );
}

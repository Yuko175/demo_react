import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// interface ApiResponse {
//   id: string;
//   name: string;
// }

export default function Button() {
  // const [変数名, 変数に新しい数を定義する関数] = useState <型> (初期値);
  const [errorText, setErrorText] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [word, setWord] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const handleChange = (event) => {
    setWord(event.target.value);
  };
  const handleClearWord = (event) => {
    setWord("");
    setErrorText("");
    setUrl("");
    setResult("");
  };

  // 関数
  const getData = () => {
    axios
      .get("http://localhost:8090/search/" + word, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setErrorText("");
        setResult(response.data);
        setUrl("https://ejje.weblio.jp/content/" + word);
      })
      .catch((error) => {
        setErrorText("検索結果がありません。別のワードで検索してください。");
        setResult(null);
      });
  };
  return (
    <>
      <div className="App-center">
        <div>Input</div>
        <div>{errorText}</div>
        <div>
          <textarea
            value={word}
            onChange={(e) => setWord(e.target.value)}
            style={{ width: "calc(50%)", height: "150px", resize: "vertical", padding: "5px", marginBottom: "10px" }}
          />
        </div>
        <button onClick={handleClearWord}>クリア</button>
        <button onClick={getData}>検索</button>
        <div>
          <a href={url}>weblio</a>：{result}
        </div>
      </div>
    </>
  );
}

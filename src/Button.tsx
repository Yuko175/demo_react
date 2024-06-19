import React, { useState } from "react";
import axios from "axios";

// interface ApiResponse {
//   id: string;
//   name: string;
// }

export default function Button() {
  // const [変数名, 変数に新しい数を定義する関数] = useState <型> (初期値);
  const [buttonText, setButtonText] = useState<string>("ボタン");
  const [result, setResult] = useState<string | null>(null);
  // let textarea = document.getElementById("textarea");
  const [word, setWord] = useState<string>("");
  const url: string = "https://ejje.weblio.jp/content/" + word;

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  // 関数
  //textがnullの場合
  const getData = () => {
    axios
      .get("http://localhost:8090/search/" + word, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setButtonText("成功");
        setResult(response.data);
      })
      .catch((error) => {
        setButtonText("失敗");
        setResult(null);
      });
  };

  return (
    <div>
      <div>{result}</div>
      <textarea onChange={handleChange}>{word}</textarea>
      <button onClick={getData}>{buttonText}</button>
      <a href={url}>weblio</a>
    </div>
  );
}

import React from "react";

interface InputProps {
  getData: () => void;
  handleClearWord: () => void;
  word: string;
  setWord: React.Dispatch<React.SetStateAction<string>>;
  errorText: string;
}

export default function Input({ getData, handleClearWord, word, setWord, errorText }: InputProps) {
  return (
    <div className="center">
      <div>英語 → 日本語</div>
      <div>{errorText}</div>
      <textarea className="textarea" value={word} onChange={(e) => setWord(e.target.value)} />
      <div>
        <button onClick={handleClearWord}>クリア</button>
        <button onClick={getData}>検索</button>
      </div>
    </div>
  );
}

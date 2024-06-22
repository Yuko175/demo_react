import React from "react";

interface OutputProps {
  dictName: string;
  url: string;
  result: Array<string>;
}
export default function Output({ url, dictName, result }: OutputProps) {
  return (
    <>
      <div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {dictName}
        </a>
      </div>
      <div>{result}</div>
    </>
  );
}

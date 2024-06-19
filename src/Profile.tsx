import React from "react";

export default function Profile() {
  // 定義
  interface Person {
    id: number;
    name: string;
  }

  // 数入れるところ
  const person: Person = {
    id: 1,
    name: "aaa",
  };

  // 出力するところ
  return (
    <div>
      <p>{person.id}</p> <p>{person.name}</p>
    </div>
  );
}

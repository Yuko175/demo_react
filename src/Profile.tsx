import React from "react";

export default function Profile() {
  interface Person {
    id: number;
    name: string;
  }
  const person: Person = {
    id: 1,
    name: "aaa",
  };

  return (
    <div>
      <p>{person.id}</p> <p>{person.name}</p>
    </div>
  );
}

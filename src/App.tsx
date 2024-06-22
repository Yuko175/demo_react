import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routing } from "./components/Routing";

export default function App() {
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

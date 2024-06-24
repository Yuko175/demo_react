import React from "react";
import { Route, Routes } from "react-router-dom";
import Dictionary from "./pages/Dictionary/Dictionary";
import WordChain from "./pages/WordChain/WordChain";

export const Page404 = () => {
  return <div>404 Error!!!</div>;
};

export const Routing = () => {
  return (
    <Routes>
      <Route path="/dictionary" element={<Dictionary />} />
      <Route path="/wordchain" element={<WordChain />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

import React from "react";
import { Route, Routes } from "react-router-dom";
import Dictionary from "./pages/Dictionary/Dictionary";

export const Page404 = () => {
  return <div>404 Error!!!</div>;
};

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Dictionary />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

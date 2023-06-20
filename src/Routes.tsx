import React from "react";
import { Routes, Route } from "react-router-dom";

const Beggining = React.lazy(
  async () => await import("./pages/beggining/Beggining.tsx")
);
const Mario = React.lazy(async () => await import("./pages/Mario/Enabled.tsx"));

function RoutesWrapper() {
  return (
    <React.Suspense fallback={<>...</>}>
      <Routes>
        <Route path="/" element={<Beggining />} />
        <Route path="/mario" element={<Mario />} />
      </Routes>
    </React.Suspense>
  );
}

export default RoutesWrapper;

import React from "react";
import { Routes, Route } from "react-router-dom";

const Welcome = React.lazy(
  async () => await import("./pages/Welcome/Beggining.tsx")
);

const Start = React.lazy(async () => await import("./pages/Start/Start.tsx"));

const Mario = React.lazy(async () => await import("./pages/Mario/Enabled.tsx"));

function RoutesWrapper() {
  return (
    <React.Suspense fallback={<>...</>}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/start" element={<Start />} />
        <Route path="/mario" element={<Mario />} />
      </Routes>
    </React.Suspense>
  );
}

export default RoutesWrapper;

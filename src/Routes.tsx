import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Welcome = lazy(
  async () => await import("./pages/Welcome/Beggining.tsx")
);

const Start = lazy(async () => await import("./pages/Start/Start.tsx"));

const Mario = lazy(async () => await import("./pages/Mario/Enabled.tsx"));

const React = lazy(async () => await import("./pages/React/React.tsx"));

function RoutesWrapper() {
  return (
    <Suspense fallback={<>...</>}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/start" element={<Start />} />
        <Route path="/mario" element={<Mario />} />
        <Route path="/mario" element={<Mario />} />
        <Route path="/react" element={<React />} />
      </Routes>
    </Suspense>
  );
}

export default RoutesWrapper;

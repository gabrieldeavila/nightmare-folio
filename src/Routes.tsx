import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Welcome = lazy(async () => await import("./pages/Welcome/Beggining.tsx"));

const Start = lazy(async () => await import("./pages/Start/Start.tsx"));

const Mario = lazy(async () => await import("./pages/Mario/Enabled.tsx"));

const React = lazy(async () => await import("./pages/React/React.tsx"));

const Loading = lazy(async () => await import("./pages/Loading/Loading.tsx"));

function RoutesWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/start" element={<Start />} />
        <Route path="/mario" element={<Mario />} />
        <Route path="/mario" element={<Mario />} />
        <Route path="/react" element={<React />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </Suspense>
  );
}

export default RoutesWrapper;

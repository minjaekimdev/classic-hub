import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import PfRanking from "./PfRanking";
import PfSearch from "./PfSearch";
import PfDetail from "./PfDetail";

export function Scroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); //page가 바뀔 때 마다 적용되게 한다.
  return null;
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Scroll />
      <Routes>
        <Route path="/" element={<PfSearch />} />
        <Route path="/detail/:pfId" element={<PfDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

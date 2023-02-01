import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GlobalStyle from "./styles/global";

import Main from "./Pages/Main";
import Repositorio from "./Pages/Repositorio";
// import Error from "./Pages/Error";

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/repositorio/:repositorio" element={<Repositorio />} />
          {/* <Route path="*" element={<Error />} /> */}
        </Routes>
      </Router>
    </>
  );
}

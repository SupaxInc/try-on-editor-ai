import "./App.css";
import TryonEditor from "./pages/try-on-editor/TryonEditor";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TryonEditor />} />
      </Routes>
    </div>
  );
};

export default App;

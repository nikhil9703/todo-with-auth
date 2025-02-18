import Dashboard from "./Component/dashboard";
import Front from "./Component/front";
import Login from "./Component/login";
import Register from "./Component/register";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
    </>
    
  );
}

export default App;

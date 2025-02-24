import TodoApp from "./Component/Todoapp";
import Front from "./Component/front";
import Login from "./Component/login";
import Register from "./Component/register";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ForgotPassword from "./Component/ForgetPassword";
import ResetPassword from "./Component/ResetPassword";
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todoapp" element={<TodoApp/>} />
        <Route path="/forget-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword/>}/>
        
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

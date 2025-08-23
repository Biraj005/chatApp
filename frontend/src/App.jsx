import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/Profilepage/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import UpdatePage from "./pages/Update/UpdatePage";

import { AuthContext } from "./store/AuthContext";
import ForgetPassword from "./pages/Resetpassword/ForgetPassword";

function App() {

  const {userLoggedIn} = useContext(AuthContext);
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={userLoggedIn ?<Homepage />:<Navigate to='/login'/> } />
        <Route path="/login" element={<LoginPage /> } />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/update" element={userLoggedIn ?<UpdatePage />:<Navigate to='/login'/>} />
        <Route path="/forgotpassword" element={<ForgetPassword/>}/>
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  );
}

export default App;

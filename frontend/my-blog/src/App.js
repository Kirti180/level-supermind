import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/UserRegister";
import Login from "./components/UserLogin";
import Home from "./components/Home";
import Profile from "./components/UserProfile";
import PostList from "./components/posts"
function App() {
  return (
    <div>
      <Home />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;

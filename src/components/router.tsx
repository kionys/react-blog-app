import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import LoginPage from "../pages/login";
import PostList from "../pages/posts";
import PostDetail from "../pages/posts/detail";
import PostEdit from "../pages/posts/edit";
import PostNew from "../pages/posts/new";
import Profile from "../pages/profile";
import SignupPage from "../pages/signup";

export default function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/posts" element={<PostList />}></Route>
        <Route path="/posts/:id" element={<PostDetail />}></Route>
        <Route path="/posts/new" element={<PostNew />}></Route>
        <Route path="/posts/edit/:id" element={<PostEdit />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="*" element={<Navigate replace to={"/"} />} />
      </Routes>
    </>
  );
}

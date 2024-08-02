import Loader from "components/loader";
import { app } from "firebase-app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "./components/router";

function App() {
  // console.log(db);
  const auth = getAuth(app);
  // auth를 체크하기 전에 (initialize 전)에는 loader를 띄워주는 용도
  const [init, setInit] = useState<boolean>(false);

  // auth의 currentUser가 있으면 authenticated로 변경
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser, // auth.currentUser 값이 있으면 true, 없으면 false
  );

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        // const uid = user.uid
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </>
  );
}

export default App;

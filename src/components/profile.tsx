import { app } from "firebase-app";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

export default function Profile() {
  const auth = getAuth(app);

  const onClickSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };
  return (
    <div className="profile__box">
      <div className="flex__box-lg">
        <div className="profile__image" />
        <div>
          <div className="profile__email">{auth.currentUser?.email}</div>
          <div className="profile__name">
            {auth.currentUser?.displayName || "사용자"}
          </div>
        </div>
      </div>
      <div
        role="presentation"
        className="profile__logout"
        onClick={onClickSignOut}
      >
        로그아웃
      </div>
    </div>
  );
}

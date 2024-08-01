import Footer from "components/footer";
import Header from "components/header";
import PostList from "components/post-list";
import Profile from "components/profile";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <Profile />
      <PostList hasNavigation={false} />
      <Footer />
    </>
  );
}

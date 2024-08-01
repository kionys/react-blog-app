import Footer from "components/footer";
import Header from "components/header";
import PostList from "components/post-list";

export default function PostsPage() {
  return (
    <>
      <Header />
      <PostList hasNavigation={false} />
      <Footer />
    </>
  );
}

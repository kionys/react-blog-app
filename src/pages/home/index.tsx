import Carousel from "components/carousel";
import Footer from "components/footer";
import Header from "components/header";
import PostList from "components/post-list";

export default function Home() {
  return (
    <>
      <Header />
      <Carousel />
      <PostList />
      <Footer />
    </>
  );
}

import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface PostListProps {
  hasNavigation?: boolean;
}
type TabType = "all" | "my";
export interface PostProps {
  id?: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createAt: string;
  updateAt?: string;
  uid: string;
}
export default function PostList({ hasNavigation = true }: PostListProps) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [posts, setPosts] = useState<PostProps[]>([]);

  // posts 컬렉션의 모든 문서를 가져온다.
  const getPosts = async () => {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        collection(db, "posts"),
      );
      // posts 초기화
      setPosts([]);
      querySnapshot.forEach(doc => {
        const postData = { ...doc.data(), id: doc.id };
        setPosts(prev => [...prev, postData as PostProps]);
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const onClickPostDelete = async (id: string) => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && id) {
      await deleteDoc(doc(db, "posts", id));
      toast.success("게시글을 삭제했습니다.");
      getPosts(); // 변경된 post 리스트를 다시 가져옴
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      {hasNavigation && (
        <div className="post__navigation">
          <div
            role="presentaion"
            className={activeTab === "all" ? "post__navigation--active" : ""}
            onClick={() => setActiveTab("all")}
          >
            전체
          </div>
          <div
            role="presentaion"
            className={activeTab === "my" ? "post__navigation--active" : ""}
            onClick={() => setActiveTab("my")}
          >
            나의 글
          </div>
        </div>
      )}
      <div className="post__list">
        {posts?.length > 0 ? (
          posts?.map((post, i) => (
            <div key={i} className="post__box">
              <Link to={`/posts/${post?.id}`}>
                <div className="post__profile-box">
                  <div className="post__profile" />
                  <div className="post__author-name">{post?.email}</div>
                  <div className="post__date">{post?.createAt}</div>
                </div>
                <div className="post__title">{post?.title}</div>
                <div className="post__text">{post?.summary}</div>
              </Link>
              {user?.email === post?.email && (
                <div className="post__utils-box">
                  <div
                    className="post__delete"
                    onClick={() => onClickPostDelete(post?.id as string)}
                  >
                    삭제
                  </div>
                  <Link to={`/posts/edit/${post.id}`} className="post__edit">
                    수정
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="post__no-post">게시글이 없습니다.</div>
        )}
      </div>
    </>
  );
}

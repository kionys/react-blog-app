import { db } from "firebase-app";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./loader";
import { PostProps } from "./post-list";

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };

  const onClickPostDelete = () => {};
  const onClickPostEdit = () => {};

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);
  return (
    <>
      <div className="post__detail">
        {post ? (
          <div className="post__box">
            <div className="post__title">{post?.title}</div>
            <div className="post__profile-box">
              <div className="post__profile" />
              <div className="post__author-name">{post?.email}</div>
              <div className="post__date">{post?.createAt}</div>
            </div>
            <div className="post__utils-box">
              <div className="post__delete" onClick={onClickPostDelete}>
                삭제
              </div>
              <div className="post__edit">
                <Link to={`/posts/edit/${post.id}`} onClick={onClickPostEdit}>
                  수정
                </Link>
              </div>
            </div>
            <div className="post__text post__text--pre-wrap">
              {post?.content}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}

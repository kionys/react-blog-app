import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { PostProps } from "./post-list";

interface CommentsProps {
  post: PostProps;
  getPost: (id: string) => void;
}
export default function Comments({ post, getPost }: CommentsProps) {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);

  const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "comment") {
      setComment(value);
    }
  };

  const onSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post?.id) {
        const postRef = doc(db, "posts", post.id);
        if (user?.uid) {
          const commentObj = {
            content: comment,
            uid: user.uid,
            email: user.email,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };

          await updateDoc(postRef, {
            comments: arrayUnion(commentObj),
            updateDated: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
          // 문서 업데이트
          await getPost(post.id);
        }
      }
      toast.success("댓글을 생성했습니다.");
      setComment("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="comments">
      <form className="comments__form" onSubmit={onSubmitComment}>
        <div className="form__block">
          <label htmlFor="comment">댓글 입력</label>
          <textarea
            name="comment"
            id="comment"
            required
            value={comment}
            onChange={onChangeTextArea}
          />
        </div>
        <div className="form__block form__block-reverse">
          <input type="submit" value={"입력"} className="form__btn-submit" />
        </div>
      </form>
      <div className="comments__list">
        {post?.comments
          ?.slice(0)
          .reverse()
          .map(comment => (
            <div key={comment.createdAt} className="comment__box">
              <div className="comment__profile-box">
                <div className="comment__email">{comment.email}</div>
                <div className="comment__date">{comment.createdAt}</div>
                <div className="comment__delete">삭제</div>
              </div>
              <div className="comment__text">{comment?.content}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
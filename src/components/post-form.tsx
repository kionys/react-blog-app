import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PostProps } from "./post-list";

export default function PostForm() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [title, setTitle] = useState<string>();
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      target: { name, value },
    } = e;
    if (name === "title") {
      setTitle(value);
    }
    if (name === "summary") {
      setSummary(value);
    }
    if (name === "content") {
      setContent(value);
    }
  };

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  useEffect(() => {
    if (post) {
      setTitle(post?.title);
      setSummary(post?.summary);
      setContent(post?.content);
    }
  }, [post]);

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post.id) {
        // 만약 post 데이터가 있다면, firestore로 데이터 수정
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          title: title,
          summary: summary,
          content: content,
          updateAt: new Date()?.toLocaleDateString(),
          uid: user?.uid,
        });
        toast.success("게시글을 수정했습니다.");
        navigate(`/posts/${post?.id}`);
      } else {
        // firestore로 데이터 생성
        await addDoc(collection(db, "posts"), {
          title: title,
          summary: summary,
          content: content,
          createAt: new Date()?.toLocaleDateString(),
          email: user?.email,
        });
        toast.success("게시글을 생성했습니다.");
        navigate("/");
      }
    } catch (e: any) {
      toast.error(e?.code);
      console.log(e);
    }
  };
  return (
    <form onSubmit={onSubmitForm} className="form">
      <div className="form__block">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={title}
          onChange={onChangeInput}
        />
      </div>
      <div className="form__block">
        <label htmlFor="summary">요약</label>
        <input
          type="text"
          name="summary"
          id="summary"
          required
          value={summary}
          onChange={onChangeInput}
        />
      </div>
      <div className="form__block">
        <label htmlFor="content">내용</label>
        <textarea
          name="content"
          id="content"
          required
          value={content}
          onChange={onChangeInput}
        />
      </div>
      <div className="form__block">
        <input
          type="submit"
          value={post ? "수정" : "제출"}
          className="form__btn--submit"
        />
      </div>
    </form>
  );
}

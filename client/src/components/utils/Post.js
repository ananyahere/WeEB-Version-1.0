import React from "react";
import Modal from "react-modal";
import { useState, useContext } from "react";
import "./Post.css";
import Comment from "../utils/Comment";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

Modal.setAppElement("#root");

function Post({ post }) {
  const { state, dispatch } = useContext(UserContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [IsreactGood, setIsReactGood] = useState(false);
  const [IsreactOK, setIsReactOK] = useState(false);
  const [IsreactBad, setIsReactBad] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reacts, setReacts] = useState({});

  const getComments = async () => {
    try {
      // make request to backend to get comments
      const response = await fetch(`/allComments/${post._id}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const responseJSON = await response.json();
      
      setComments(responseJSON);
    } catch (e) {
      console.log(e);
    }
  };

  const commentChangeHandler = (e) => {
    setNewComment(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // request to backend
    try {
      const response = await fetch(`/addComment/${post._id}`, {
        method: "POST",
        body: JSON.stringify({
          body: newComment,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newCommentId = await response.json();
      console.log(newCommentId.commentId);
    } catch (err) {
      console.log(err);
    }
    setNewComment("");
  };

  const reactHandler = (react) => {
    if (react == "good") {
      setIsReactGood(!IsreactGood);
    } else if (react == "ok") {
      setIsReactOK(!IsreactOK);
    } else if (react == "bad") {
      setIsReactBad(!IsreactBad);
    }
  };

  return (
    <li className="post">
      <img
        src="https://i.pinimg.com/564x/8b/e4/d5/8be4d5b8675f9cea2b61968a43eb075f.jpg"
        alt="smoothie recipe icon"
      />

      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p
        onClick={() => {
          setModalIsOpen(true);
          getComments(post._id);
        }}
        className="modal-btn"
      >
        Comments & Likes
      </p>
      {/* redirect to '/profile' if user clicks on his own nickname` */}
      <Link
        to={
          post.postedBy._id === state._id
            ? "/profile"
            : `/profile/${post.postedBy._id}`
        }
      >
        <h6>{post.postedBy.nickname}</h6>
      </Link>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          content: {
            display: "grid",
            gridTemplateColumns: "1fr minmax(150px, 25%)",
          },
        }}
      >
        <div className="post-img">
          <img src={`${post.photoLink}`} alt="post-img" />
        </div>
        <div className="post-details">
          <div className="title">
            <h4>{post.title}</h4>
            <p onClick={() => setModalIsOpen(false)} className="modal-btn">
              Close
            </p>
          </div>

          <p>{post.body}</p>

          <hr />

          <div className="comments">
            {comments.map((comment) => (
              <Comment commentInfo={comment} />
            ))}
          </div>
          {/* <div className="reacts">
            <div
              className={IsreactGood ? "good" : null}
              onClick={() => {
                reactHandler("good");
              }}
            >
              <FaHeart />
              <p>{1}</p>
            </div>
            <div
              className={IsreactOK ? "ok" : null}
              onClick={() => {
                reactHandler("ok");
              }}
            >
              <FaHeart />
              <p>{1}</p>
            </div>
            <div
              className={IsreactBad ? "bad" : null}
              onClick={() => {
                reactHandler("bad");
              }}
            >
              <FaHeart />
              <p>{1}</p>
            </div>
          </div> */}
          <form onSubmit={submitHandler} className="comment-form">
            <input
              type="text"
              placeholder="add comment"
              className="comment-input"
              onChange={commentChangeHandler}
              value={newComment}
            />
            <button className="comment-add-btn">add</button>
          </form>
        </div>
      </Modal>
    </li>
  );
}

export default Post;
import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";
import { Button } from "@material-ui/core";

function Post({ postId, user, username, caption, imageUrl, ppurl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  function deletePost() {
    console.log("Hello Good luck");
    db.collection("posts")
      .doc(postId)
      .delete()
      .then(console.log("Deleted"))
      .catch(console.error);
  }
  console.log(comments);
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt="user avatar" src={ppurl} />
        <h3>{username}</h3>
        {user?.displayName == username ? (
          <div className="post__delete">
            <Button onClick={deletePost}>Delete Post</Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <video controls autoplay className="post__image" alt="post">
        <source src={imageUrl} type="video/mp4" />
      </video>

      <h4 className="post__text">
        <strong>{username}</strong>: {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
            {/*
                            user?.displayName==comment.username?(
                                <Button onClick={deleteComment(comment.id)} >
                                    Delete Comment
                                </Button>
                            ):(
                                <div>
                                    
                                </div>
                            )
                        */}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;

import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog, updateState, getUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const showWhenVisible = { display: detailsVisible ? "" : "none" };
  const blogStyle = {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikes = (object) => {
    const updatedLikes = object.likes + 1;
    const newBlog = { ...object, likes: updatedLikes };

    blogService.updateLikes(newBlog);
    if (updateState) {
      updateState();
    }
  };

  const handleDelete = async (object) => {
    if (window.confirm("Do you wanna really delete this blog entry?")) {
      await blogService.deleteBlog(object);
      if (updateState) {
        updateState();
      }
    }
  };

  return (
    <div style={blogStyle}>
      <p>
        {blog.title}{" "}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {!detailsVisible ? "show" : "hide"}
        </button>
      </p>
      <div style={showWhenVisible} className="moreDetails">
        <p>{blog.url}</p>
        <p>
          Likes: {blog.likes}{" "}
          <button onClick={() => handleLikes(blog)}>like</button>
        </p>
        <p>Author: {blog.author}</p>
        {getUser().username === blog.user["username"] ? (
          <button onClick={() => handleDelete(blog)}>remove</button>
        ) : null}
      </div>
    </div>
  );
};

export default Blog;

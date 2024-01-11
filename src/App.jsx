import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";

import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";

import Togglable from "./components/Togglable";

const Notification = ({ message, type }) => {
  if (type === "error") {
    return <p className="error">{message}</p>;
  } else {
    return <p className="notification">{message}</p>;
  }
};

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ message: null, type: null });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const updateState = () => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  };
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const getUser = () => {
    return user;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);

      setMessage({
        message: "Logged in successfully",
        type: "notification",
      });
      setTimeout(() => {
        setMessage({ message: null, type: null });
      }, 5000);

      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage({
        message: "Wrong credentials",
        type: "error",
      });
      setTimeout(() => {
        setMessage({ message: null, type: null });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setMessage({ message: "Logout successfully", type: "notification" });
    setTimeout(() => {
      setMessage({ message: null, type: null });
    }, 5000);
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    const test = setBlogs(blogs.concat(returnedBlog));

    setMessage({ message: "Blog added", type: "notification" });
    setTimeout(() => {
      setMessage({ message: null, type: null });
    }, 5000);
  };

  const loginForm = () => {
    return (
      <LoginForm
        handleLogin={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        username={username}
        password={password}
      ></LoginForm>
    );
  };

  const blogForm = () => {
    return (
      <Togglable id={"create-button"} buttonLabel={"Create New Blog"}>
        <BlogForm createBlog={addBlog}></BlogForm>
      </Togglable>
    );
  };

  const sortBlogs = (object) => {
    return object.sort((p, c) => c.likes - p.likes);
  };

  const showBlogs = () => {
    return (
      <div>
        <h2>blogs:</h2>
        {blogs
          .sort((c, p) => p.likes - c.likes)
          .map((blog) => (
            <Blog
              getUser={getUser}
              updateState={updateState}
              get
              key={blog.id}
              blog={blog}
            />
          ))}
      </div>
    );
  };

  return (
    <div>
      {message.message && (
        <Notification
          message={message.message}
          type={message.type}
        ></Notification>
      )}
      <h1>Blog List</h1>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          {blogForm()}
          {showBlogs()}
        </div>
      )}
    </div>
  );
};
export default App;

import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

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
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [message, setMessage] = useState({ message: null, type: null });
  // const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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

  const handleCreate = async (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    };

    const blog = await blogService.create(blogObject);

    setBlogs(blogs.concat(blog));
    setMessage({ message: "Blog created successfully", type: "notification" });
    setTimeout(() => {
      setMessage({ message: null, type: null });
    }, 5000);
    setNewBlog({ title: "", author: "", url: "" });
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <label>
          Username{" "}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          Password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button>Login</button>
      </form>
    );
  };

  const blogForm = () => {
    return (
      <form onSubmit={handleCreate}>
        <h2>Create new</h2>
        <div>
          Title:
          <input
            type="text"
            value={newBlog.title}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newBlog.author}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
          />
        </div>
        <div>
          Url:
          <input
            type="text"
            value={newBlog.url}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </div>
        <button>Create</button>
      </form>
    );
  };

  const showBlogs = () => {
    return (
      <div>
        <h2>blogs:</h2>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
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

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <label>
        Username{" "}
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label>
        Password{" "}
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <button>Login</button>
    </form>
  );
};

export default LoginForm;

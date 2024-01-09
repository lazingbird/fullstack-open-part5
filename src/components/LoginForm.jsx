import PropTypes from "prop-types";

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  };
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

import "./login.css";

function Login() {
  return (
    <div className="login-container">
      <h1>WELCOME BACK</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button>LOGIN</button>
      </form>
      <p className="forgot-password-pharagraph">
        Forgot your password?{" "}
        <a className="login-modal-link" href="#">
          Reset password
        </a>
      </p>
    </div>
  );
}

export default Login;

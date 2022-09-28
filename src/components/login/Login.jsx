import { UserAuth } from "../../contexts/AuthContext";
import "./login.css";
import { useRef, useState } from "react";

function Login() {
  const [disableButton, setDisableButton] = useState(false);
  const { login, authError } = UserAuth();
  const emailRef = useRef();
  const passwordRef = useRef();

  return (
    <div className="login-container">
      <h1>WELCOME BACK</h1>
      <div className="login-form">
        <input ref={emailRef} type="email" placeholder="Email" required />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          required
        />
        <button
          onClick={() => {
            setDisableButton(true);
            login(emailRef.current.value, passwordRef.current.value);
            setDisableButton(false);
          }}
          disabled={disableButton}
        >
          LOGIN
        </button>
      </div>
      {authError ? <p className="show-error">{authError}</p> : ""}
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

import "./signup.css";
import { useRef, useState } from "react";
import { UserAuth } from "./../../contexts/AuthContext";

function Signup() {
  const [disableButton, setDisableButton] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { createUserAccount, authError } = UserAuth();

  return (
    <div className="signup-container">
      <h1>Create new account</h1>
      <div className="signup-form">
        <input ref={usernameRef} type="username" placeholder="Username" />
        <input ref={emailRef} type="email" placeholder="Email" />
        <input ref={passwordRef} type="password" placeholder="Password" />
        <input
          ref={passwordConfirmRef}
          type="password"
          placeholder="Confirm password"
        />
        <button
          onClick={() => {
            setDisableButton(true);
            createUserAccount(
              usernameRef.current.value,
              emailRef.current.value,
              passwordRef.current.value,
              passwordConfirmRef.current.value
            );
            setDisableButton(false);
          }}
          disabled={disableButton}
        >
          Sign Up
        </button>
      </div>
      {authError ? <p className="show-error">{authError}</p> : ""}
    </div>
  );
}

export default Signup;

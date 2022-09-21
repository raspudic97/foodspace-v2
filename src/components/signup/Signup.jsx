import "./signup.css";

function Signup() {
  return (
    <div className="signup-container">
      <h1>Create new account</h1>
      <form>
        <input type="username" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm password" />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;

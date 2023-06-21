import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, signIn } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  console.log({ user });
  // If the user is logged in, don't show the login form
  if (user) {
    // Redirect to the profile page
    return <Navigate to="/profile" />;
  }

  return (
    <div>
      <h2>Login</h2>
      <form name="loginForm" onSubmit={handleSubmit}>
        <ul>
          <li>
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
          <li>
            <button type="submit">Login</button>
          </li>
        </ul>
      </form>
      {error && <p>{error}</p>}
      <Link to="/forgot-password">Forgot Password</Link>
    </div>
  );
}

import { useState } from "react";
import { signUp } from "./auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signUp(username, email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div>
        <h2>Signup successful!</h2>
        <p>Please check your email for the confirmation code.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Signup</h2>
      <form name="signupForm" onSubmit={handleSubmit}>
        <ul>
          <li>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit">Signup</button>
          </li>
        </ul>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

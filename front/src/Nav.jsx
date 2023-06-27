import { useContext } from "react";
import { AuthContext } from "./Auth/AuthContext";
import { Link } from "react-router-dom";

export default function Nav() {
  const { user, signOut } = useContext(AuthContext);
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!user && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}

        <li>
          <Link to="/profile">Profile</Link>
        </li>
        {!user && (
          <li>
            <Link to="/signup">SignUp</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

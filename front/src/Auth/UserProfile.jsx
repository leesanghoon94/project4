import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function UserProfile() {
  const { user, signOut } = useContext(AuthContext);
  let idToken = localStorage.getItem("idToken");

  const handleTokenCopy = async () => {
    if (idToken) {
      idToken = JSON.parse(idToken);
      await navigator.clipboard.writeText(idToken.jwtToken);
      alert("copied to clipboard");
    }
  };

  return (
    <div>
      {user && (
        <div>
          <h2>User Profile</h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>
            <button onClick={handleTokenCopy}>Copy Token</button>
          </p>
        </div>
      )}
      <button onClick={signOut}>Logout</button>
    </div>
  );
}

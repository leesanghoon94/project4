import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function UserProfile() {
  const { user, signOut } = useContext(AuthContext);
  let idToken = localStorage.getItem("idToken");
  if (idToken) {
    idToken = JSON.parse(idToken);
  }

  console.log(idToken);

  return (
    <div>
      {user && (
        <div>
          <h2>User Profile</h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {idToken && <p>Token: {idToken.jwtToken}</p>}
          {/* Display any other user data here */}
        </div>
      )}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

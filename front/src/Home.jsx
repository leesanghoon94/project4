import { useContext } from "react";
import { AuthContext } from "./Auth/AuthContext";

function Home() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <>
          <p>Welcome! You are logged in.</p>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <p>로그인해주세요.</p>
      )}
    </div>
  );
}

export default Home;

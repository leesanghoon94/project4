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
        <p>Please log in to access more features.</p>
      )}
    </div>
  );
}

export default Home;

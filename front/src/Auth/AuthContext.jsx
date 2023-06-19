import { createContext, useState, useEffect } from "react";
import * as auth from "./auth";


const AuthContext = createContext();


function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const user = await auth.getCurrentUser();
      console.log("current user", user);
      setUser(user);
    } catch (err) {
      // not logged in
      console.log(err);
      setUser(null);
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, []);

  // const fetchUser = async () => {
  //   // 사용자 정보를 가져오는 API 호출 또는 기타 작업을 수행합니다.
  //   // 예를 들어, AWS Cognito의 getUser 메서드를 사용하여 현재 사용자 정보를 가져올 수 있습니다.
  //   const user = await auth.getUser();
  //   console.log("user", user);
  // };
  
  
  

  const signIn = async (username, password) => {
    debugger;
    await auth.signIn(username, password);
    await getCurrentUser();
  };
  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const authValue = {
    user,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };

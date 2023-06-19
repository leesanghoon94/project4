import { useEffect, useState } from "react"
import { getCurrentUser, signOut } from "./auth"

export default function UserProfile() {
  const [user, setUser] = useState()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUser()
  }, [])

  return (
    <div>
      {userData && (
        <div>
          <h2>User Profile</h2>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}

      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
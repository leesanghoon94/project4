import { useState, useContext } from "react"
import { AuthContext } from "../AuthContext"
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { user, signIn } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await signIn(username, password)
    } catch (err) {
      setError(err.message)
    }
  }

  // If the user is logged in, don't show the login form
  if (user) {
    // Redirect to the profile page
    return <Navigate to="/profile" />
  }

  // return (
  //   // ...
  // )
  <Link to="/forgot-password">Forgot Password</Link>
  </div>
);
}
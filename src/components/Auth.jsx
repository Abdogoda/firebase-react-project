import { auth, googleProvider } from "../config/firebase";
import {
 createUserWithEmailAndPassword,
 signInWithPopup,
 signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";

function Auth() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const checkLoggedIn = () => {
  if (auth?.currentUser !== null) {
   setIsLoggedIn(true);
  } else {
   setIsLoggedIn(false);
  }
 };
 useEffect(() => {
  checkLoggedIn();
 }, [auth?.currentUser]);
 const signIn = async () => {
  if (email !== "" && password !== "") {
   try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Your are logged in successfully");
    setEmail("");
    setPassword("");
    checkLoggedIn();
   } catch (error) {
    console.error(error);
   }
  } else {
   alert("Email And Password should not be Null!");
  }
 };
 const signInWithGoogle = async () => {
  try {
   await signInWithPopup(auth, googleProvider);
   alert("Your are logged in successfully");
   checkLoggedIn();
  } catch (error) {
   console.error(error);
  }
 };
 const logout = async () => {
  try {
   await signOut(auth);
   alert("Signed out successfully");
   checkLoggedIn();
  } catch (error) {
   console.error(error);
  }
 };
 return (
  <div className="container">
   <h1>Login Form</h1>
   {!isLoggedIn && (
    <div>
     <input
      type="email"
      placeholder="Email..."
      value={email}
      onChange={(e) => setEmail(e.target.value)}
     />
     <input
      type="password"
      placeholder="Password..."
      value={password}
      onChange={(e) => setPassword(e.target.value)}
     />
     <br />
     <button onClick={signIn}>Sign In</button>
     <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
   )}
   {isLoggedIn && (
    <div>
     <h3 style={{ color: "#333" }}>{auth.currentUser.email}</h3>
     <button onClick={logout}>Sign Out</button>
    </div>
   )}
  </div>
 );
}

export default Auth;

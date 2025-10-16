import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const accountExists = async (uid: string) => {
    const usersRef = doc(db, "clients", uid);
    const profsRef = doc(db, "professionals", uid);
    const usersDocSnap = await getDoc(usersRef);
    const profsDocSnap = await getDoc(profsRef);
    if (usersDocSnap.exists()) {
      console.log(usersDocSnap.data());
      return "Client";
    } else if (profsDocSnap.exists()) {
      console.log(profsDocSnap.data());
      return "Professional";
    } else {
      console.log("No such document");
      return "None";
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      // Add scope for contacts
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      // Add scope for sending emails
      provider.addScope("https://www.googleapis.com/auth/userinfo.email");
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
          // Check if account exists
          const accExists = await accountExists(user.uid);
          if (accExists === "Client") {
            navigate(`/client/${user.uid}`);
          } else if (accExists === "Professional") {
            navigate(`/professional/${user.uid}`);
          } else {
            navigate("/register");
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode, errorMessage, email, credential);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

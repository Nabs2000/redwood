import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import type { Route } from "./+types/login";
import { Button } from "~/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In - Mozlem Mentorz" },
    { name: "description", content: "Sign in to your Mozlem Mentorz account" },
  ];
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const accountExists = async (uid: string) => {
    // Check new collections first
    const menteeRef = doc(db, "mentees", uid);
    const mentorRef = doc(db, "mentors", uid);
    const menteeSnap = await getDoc(menteeRef);
    const mentorSnap = await getDoc(mentorRef);

    if (menteeSnap.exists()) {
      return "Mentee";
    } else if (mentorSnap.exists()) {
      return "Mentor";
    }

    // Fallback to legacy collections
    const clientRef = doc(db, "clients", uid);
    const professionalRef = doc(db, "professionals", uid);
    const clientSnap = await getDoc(clientRef);
    const professionalSnap = await getDoc(professionalRef);

    if (clientSnap.exists()) {
      return "Client";
    } else if (professionalSnap.exists()) {
      return "Professional";
    }

    return "None";
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      provider.addScope("https://www.googleapis.com/auth/userinfo.email");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if account exists
      const accExists = await accountExists(user.uid);

      if (accExists === "Mentee") {
        navigate("/mentee/dashboard");
      } else if (accExists === "Mentor") {
        navigate("/mentor/dashboard");
      } else if (accExists === "Client") {
        navigate(`/client/${user.uid}`);
      } else if (accExists === "Professional") {
        navigate(`/professional/${user.uid}`);
      } else {
        navigate("/register");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Mozlem Mentorz
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Community Career Guidance</p>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <p className="text-center text-slate-600 dark:text-slate-400 mt-2">
              Sign in to continue your mentorship journey
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <Button
                onClick={handleGoogleLogin}
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                {!isLoading && (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    New to Mozlem Mentorz?
                  </span>
                </div>
              </div>

              <Link to="/register" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Create an Account
                </Button>
              </Link>

              <div className="text-center">
                <Link to="/" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

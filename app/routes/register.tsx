import type { Route } from "./+types/register";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Textarea } from "~/components/ui/Textarea";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Account - Mozlem Mentorz" },
    { name: "description", content: "Join the Mozlem Mentorz community" },
  ];
}

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [selectedOption, setSelectedOption] = useState<"Mentee" | "Mentor">(
    "Mentee"
  );
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const email = user?.email;
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      provider.addScope("https://www.googleapis.com/auth/userinfo.email");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Pre-fill name from Google account
      if (user.displayName) {
        const names = user.displayName.split(" ");
        console.log("Extracted names from Google displayName:", names);
        setFirstName(names[0] || "");
        setLastName(names.slice(1).join(" ") || "");
      }

      // Check if user already has a profile
      const menteeRef = doc(db, "mentees", user.uid);
      const mentorRef = doc(db, "mentors", user.uid);
      const menteeSnap = await getDoc(menteeRef);
      const mentorSnap = await getDoc(mentorRef);

      if (menteeSnap.exists()) {
        setAccountExists(true);
        navigate("/mentee/dashboard");
        return;
      } else if (mentorSnap.exists()) {
        setAccountExists(true);
        navigate("/mentor/dashboard");
        return;
      }

      setIsGoogleSignedIn(true);
    } catch (error: any) {
      setError(
        error.message || "Failed to sign in with Google. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: "Mentee" | "Mentor") => {
    setSelectedOption(value);
  };

  async function completeRegistration(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!firstName || !lastName || !phoneNumber) {
      setError("Please fill in all required fields");
      return;
    }

    if (selectedOption === "Mentor" && !company) {
      setError("Please enter your company name");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (!user?.uid) {
        setError("You must be signed in to complete registration.");
        return;
      }

      if (selectedOption === "Mentee") {
        // Create a mentee profile document in Firestore using the user's UID
        await setDoc(doc(db, "mentees", user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          bio: bio,
          interestedIndustries: [],
          interestedRoles: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userType: selectedOption,
        });
        // Redirect to mentee dashboard
        navigate("/mentee/dashboard");
      } else if (selectedOption === "Mentor") {
        // Create a basic mentor profile document in Firestore using the user's UID
        await setDoc(doc(db, "mentors", user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          company: company,
          createdAt: new Date(),
          updatedAt: new Date(),
          userType: selectedOption,
          registrationComplete: false, // Will be set to true after profile setup
          pendingRequests: [],
          upcomingSessions: [],
        });
        // Redirect to mentor profile setup
        navigate("/mentor/profile-setup");
      }
      console.log("User registered and profile created:", user.uid);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error during registration or profile creation:",
        errorCode,
        errorMessage
      );
      setError(errorMessage || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
      setAccountExists(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Community Career Guidance
              </p>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Your Account</CardTitle>
            <p className="text-center text-slate-600 dark:text-slate-400 mt-2">
              Join our community of mentors and mentees
            </p>
          </CardHeader>

          <CardContent>
            {accountExists ? (
              <div className="text-center py-8">
                <h1>Account exists. Loading profile...</h1>
              </div>
            ) : !isGoogleSignedIn ? (
              // Step 1: Google Sign In
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                )}

                <div className="text-center py-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Sign in with your Google account to get started
                  </p>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
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
                  Continue with Google
                </Button>

                <div className="text-center">
                  <Link
                    to="/"
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              // Step 2: Complete Profile
              <form onSubmit={completeRegistration} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                )}

                {/* Show signed in email */}
                <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div className="text-sm text-emerald-800 dark:text-emerald-200">
                      Signed in as <strong>{email}</strong>
                    </div>
                  </div>
                </div>

                {/* Account Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    I want to...
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleChange("Mentee")}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                        ${
                          selectedOption === "Mentee"
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                            : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${
                            selectedOption === "Mentee"
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-slate-300 dark:border-slate-600"
                          }
                        `}
                        >
                          {selectedOption === "Mentee" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            Find a Mentor
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Get career guidance, referrals, and interview prep
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange("Mentor")}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                        ${
                          selectedOption === "Mentor"
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                            : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${
                            selectedOption === "Mentor"
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-slate-300 dark:border-slate-600"
                          }
                        `}
                        >
                          {selectedOption === "Mentor" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            Become a Mentor
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Share your expertise and help others succeed
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    placeholder="Ahmed"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    placeholder="Rahman"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                {/* Phone Number */}
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />

                {/* Company (only for mentors) */}
                {selectedOption === "Mentor" && (
                  <Input
                    label="Company"
                    type="text"
                    placeholder="Your current company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                )}

                {selectedOption === "Mentee" && (
                  <Textarea
                    label="Bio"
                    placeholder="Tell us a bit about yourself."
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                )}

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      {selectedOption === "Mentee" ? (
                        <p>
                          After registration, you'll be able to browse mentors
                          and schedule your first consultation.
                        </p>
                      ) : (
                        <p>
                          After registration, you'll complete your mentor
                          profile including your availability and services
                          offered.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  Complete Registration
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}

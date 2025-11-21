import type { Route } from "./+types/register";

import { getAuth } from "firebase/auth";
import { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Link } from "react-router";
import { useNavigate } from "react-router";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [selectedOption, setSelectedOption] = useState<"Mentee" | "Mentor">("Mentee");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: "Mentee" | "Mentor") => {
    setSelectedOption(value);
  };

  const auth = getAuth();
  const user = auth.currentUser;
  const email = user?.email;
  const db = getFirestore();
  const navigate = useNavigate();

  async function registerAndCreateProfile(e: React.FormEvent) {
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
        setError("You must be signed in to register. Please sign in with Google first.");
        return;
      }

      if (selectedOption === "Mentee") {
        // Create a mentee profile document in Firestore using the user's UID
        await setDoc(doc(db, "mentees", user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          interestedIndustries: [],
          interestedRoles: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userType: selectedOption,
        });
        // Redirect to mentee browse mentors page
        navigate("/mentee/browse-mentors");
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
          isActive: false, // Will be set to true after profile setup
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
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
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
            <CardTitle className="text-center">Create Your Account</CardTitle>
            <p className="text-center text-slate-600 dark:text-slate-400 mt-2">
              Join our community of mentors and mentees
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={registerAndCreateProfile} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

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
                      ${selectedOption === "Mentee"
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${selectedOption === "Mentee"
                          ? 'border-emerald-600 bg-emerald-600'
                          : 'border-slate-300 dark:border-slate-600'
                        }
                      `}>
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
                      ${selectedOption === "Mentor"
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${selectedOption === "Mentor"
                          ? 'border-emerald-600 bg-emerald-600'
                          : 'border-slate-300 dark:border-slate-600'
                        }
                      `}>
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

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    {selectedOption === "Mentee" ? (
                      <p>After registration, you'll be able to browse mentors and schedule your first consultation.</p>
                    ) : (
                      <p>After registration, you'll complete your mentor profile including your availability and services offered.</p>
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
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign In Link */}
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full" size="lg" type="button">
                  Sign In
                </Button>
              </Link>

              <div className="text-center">
                <Link to="/" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                  ← Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

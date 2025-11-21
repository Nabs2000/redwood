import type { Route } from "./+types/register";

import { getAuth } from "firebase/auth";
import { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Form, Link } from "react-router";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register" },
    { name: "description", content: "Register page" },
  ];
}

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [selectedOption, setSelectedOption] = useState("Mentee"); // Initial selected value

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const auth = getAuth();
  const user = auth.currentUser;
  const email = user?.email;
  const db = getFirestore();
  const navigate = useNavigate();
  // Function to register a new user and create their profile in Firestore
  async function registerAndCreateProfile(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    company: string,
    selectedOption: string
  ) {
    try {
      const auth = getAuth();
      const db = getFirestore();
      setIsLoading(true);
      if (selectedOption === "Mentee") {
        // Create a mentee profile document in Firestore using the user's UID
        await setDoc(doc(db, "mentees", user?.uid!), {
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
        navigate(`/mentee/browse-mentors`);
      } else if (selectedOption === "Mentor") {
        // Create a basic mentor profile document in Firestore using the user's UID
        await setDoc(doc(db, "mentors", user?.uid!), {
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
        navigate(`/mentor/profile-setup`);
      }
      console.log("User registered and profile created:", user?.uid);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error during registration or profile creation:",
        errorCode,
        errorMessage
      );
      throw error; // Re-throw the error for handling in your application
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <Form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={(e) =>
          registerAndCreateProfile(
            firstName,
            lastName,
            email!,
            password,
            phoneNumber,
            company,
            selectedOption
          )
        }
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="phoneNumber"
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Account Type
          </label>
          <label className="text-black flex items-center gap-2 mb-2">
            <input
              className="w-4 h-4 text-emerald-600"
              type="radio"
              name="myRadioGroup"
              value="Mentee"
              id="Mentee"
              checked={selectedOption === "Mentee"}
              onChange={handleChange}
            />
            <span>Mentee (seeking career guidance)</span>
          </label>
          <label className="text-black flex items-center gap-2">
            <input
              className="w-4 h-4 text-emerald-600"
              type="radio"
              name="myRadioGroup"
              value="Mentor"
              id="Mentor"
              checked={selectedOption === "Mentor"}
              onChange={handleChange}
            />
            <span>Mentor (offering career guidance)</span>
          </label>
        </div>
        {selectedOption === "Mentor" && (
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="company"
            >
              Company
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="company"
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            className={`${isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
          <Link
            to="/"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Already have an account?{" "}
          </Link>
        </div>
      </Form>
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

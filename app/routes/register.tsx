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
  const [selectedOption, setSelectedOption] = useState("Client"); // Initial selected value

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
      if (selectedOption === "Client") {
        // Create a user profile document in Firestore using the user's UID
        await setDoc(doc(db, "clients", user?.uid!), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          company: company,
          createdAt: new Date(),
          userType: selectedOption,
          // Add other relevant profile information
        });
      } else if (selectedOption === "Professional") {
        // Create a user profile document in Firestore using the user's UID
        await setDoc(doc(db, "professionals", user?.uid!), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          company: company,
          createdAt: new Date(),
          userType: selectedOption,
          // Add other relevant profile information
        });
      }
      console.log("User registered and profile created:", user?.uid);
      selectedOption === "Client" ? navigate(`/client/${user?.uid}`) : navigate(`/professional/${user?.uid}`);
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
          <label className="text-black">
            <input
              className="block text-black text-sm font-bold mb-2"
              type="radio"
              name="myRadioGroup"
              value="Client"
              id="Client"
              checked={selectedOption === "Client"}
              onChange={handleChange}
            />
            Client
          </label>
          <label className="text-black">
            <input
              className="block text-black text-sm font-bold mb-2"
              type="radio"
              name="myRadioGroup"
              value="Professional"
              id="Professional"
              checked={selectedOption === "Professional"}
              onChange={handleChange}
            />
            Professional
          </label>
        </div>
        {selectedOption === "Professional" && (
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

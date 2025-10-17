import { useState, useEffect } from "react";
import { Form } from "react-router";
import type { Client } from "~/types/client.types";
import { getAuth } from "firebase/auth";
import gmailApiConfig from "../../config/gmailApiConfig";

export default function ReferralForm({ client }: { client: Client }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const email = user?.email;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachment(event.target.files[0]);
    }
  };

  // In your referralForm.tsx
  const sendEmail = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get the user's ID token
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("recipient", recipient);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send email");
      }

      // Reset form on success
      setSubject("");
      setMessage("");
      setRecipient("");
      setAttachment(null);

      alert("Email sent successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Failed to send email. Please try again.");
    }
  };

  return (
    <div>
      <Form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendEmail();
        }}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="recipient"
          >
            Recipient
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="recipient"
            type="recipient"
            placeholder="johns@gmail.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="subject"
          >
            Subject
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="subject"
            type="subject"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Specify accepted file types
          className="mt-2 mb-4 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send
        </button>
      </Form>
    </div>
  );
}

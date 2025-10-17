import ReferralForm from "~/components/referralForm";
import type { Route } from "./+types/clientPage";
import { getDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import type { Client } from "~/types/client.types";
import { useState } from "react";

const db = getFirestore();

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { clientId } = params;
  const userDoc = await getDoc(doc(db, "clients", clientId));
  if (!userDoc.exists()) {
    throw new Response("User not found", { status: 404 });
  }
  return userDoc.data();
}

export default function ClientPage({ loaderData }: { loaderData: Client }) {
  const [showReferralForm, setShowReferralForm] = useState(false);
  return (
    <div>
      <h1>Hello {loaderData.firstName}!</h1>
      {showReferralForm ? (
        <button onClick={() => setShowReferralForm(false)}>Close</button>
      ) : (
        <button onClick={() => setShowReferralForm(true)}>
          Show Referral Form
        </button>
      )}
      {showReferralForm && <ReferralForm client={loaderData} />}
    </div>
  );
}

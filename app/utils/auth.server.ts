import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebase";

/**
 * Get the Google access token for a user from Firestore
 * @param uid - The Firebase user ID
 * @returns The Google access token or null if not found
 */
export async function getGoogleAccessToken(uid: string): Promise<string | null> {
  try {
    const tokenDoc = await getDoc(doc(db, "user_tokens", uid));

    if (!tokenDoc.exists()) {
      console.error("No access token found for user:", uid);
      return null;
    }

    const data = tokenDoc.data();
    return data?.googleAccessToken || null;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
}

import type { LoaderFunctionArgs } from "react-router";
import { getCalendar } from "./calendar.server";
import { getGoogleAccessToken } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get the user ID from the request URL params or headers
  const url = new URL(request.url);
  console.log("Request URL:", request.url);
  const uid = url.searchParams.get("uid");
  console.log("Extracted UID:", uid);

  if (!uid) {
    return { error: "User ID (uid) is required", status: 400 };
  }

  try {
    // Get the access token from Firestore
    const accessToken = await getGoogleAccessToken(uid);

    if (!accessToken) {
      return { error: "Access token not found for user", status: 404 };
    }

    // Call Google Calendar API
    const result = await getCalendar(accessToken);

    return { calendars: result.data };
  } catch (error: any) {
    console.error("Error fetching calendar list:", error);
    return {
      error: error.message || "Failed to fetch calendar list",
      status: 500,
    };
  }
}

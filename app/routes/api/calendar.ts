import type { LoaderFunctionArgs } from "react-router";
import { json } from "react-router";
import { getCalendarList } from "./calendar.server";
import { getGoogleAccessToken } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get the user ID from the request URL params or headers
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Get the access token from Firestore
    const accessToken = await getGoogleAccessToken(uid);

    if (!accessToken) {
      return json(
        { error: "No Google access token found. Please sign in again." },
        { status: 401 }
      );
    }

    // Call Google Calendar API
    const result = await getCalendarList(accessToken);

    return json({ calendars: result.data });
  } catch (error: any) {
    console.error("Error fetching calendar list:", error);
    return json(
      { error: error.message || "Failed to fetch calendar list" },
      { status: 500 }
    );
  }
}

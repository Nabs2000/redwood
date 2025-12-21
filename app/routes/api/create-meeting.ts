import type { ActionFunctionArgs } from "react-router";
import { getGoogleAccessToken } from "~/utils/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  // Get the user ID from the request URL params
  const url = new URL(request.url);
  console.log("Request URL:", request.url);
  const uid = url.searchParams.get("uid");
  console.log("Extracted UID:", uid);

  if (!uid) {
    return { error: "User ID (uid) is required", status: 400 };
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { calendarId, meeting } = body;

    console.log("Creating calendar event:", { calendarId, meeting });

    // Get the access token from Firestore
    const accessToken = await getGoogleAccessToken(uid);

    if (!accessToken) {
      return { error: "Access token not found for user", status: 404 };
    }

    // TODO: Call Google Calendar API to create the event
    console.log("Ready to create calendar event with access token");

    return { success: true, message: "Meeting created successfully" };
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return {
      error: error.message || "Failed to create calendar event",
      status: 500,
    };
  }
}

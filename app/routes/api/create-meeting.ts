import type { ActionFunctionArgs } from "react-router";
import { getGoogleAccessToken } from "~/utils/auth.server";
import { getCalendarClient } from "./calendar.server";

export async function action({ request }: ActionFunctionArgs) {
  // Get the user ID from the request URL params

  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return { error: "User ID (uid) is required", status: 400 };
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { mentorCalendar, meeting } = body;

    // Get the access token from Firestore
    const accessToken = await getGoogleAccessToken(uid);
    console.log("Access token retrieved for user:", uid);
    if (!accessToken) {
      return { error: "Access token not found for user", status: 404 };
    }

    // Get configured calendar client
    const calendar = getCalendarClient(accessToken);

    // Create the calendar event
    const event = {
      summary: "Google I/O 2015",
      location: "800 Howard St., San Francisco, CA 94103",
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: "2015-05-28T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: "2015-05-28T17:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: [
        { email: "lpage@example.com" },
        { email: "sbrin@example.com" },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return {
      success: true,
      message: "Meeting created successfully",
      // eventLink: response.data.htmlLink,
    };
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return {
      error: error.message || "Failed to create calendar event",
      status: 500,
    };
  }
}

import { google } from "googleapis";

export const getCalendar = async (accessToken: string) => {
  // Create an OAuth2 client with the access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  return calendar.calendarList.list();
};

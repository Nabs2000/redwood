import { google } from "googleapis";

/**
 * Creates and returns a configured Google Calendar client
 * with the provided access token
 */
export const getCalendarClient = (accessToken: string) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
};

export const getCalendar = async (accessToken: string) => {
  const calendar = getCalendarClient(accessToken);
  return calendar.calendarList.list();
};

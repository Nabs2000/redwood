import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MdLogout } from "react-icons/md";
import { Button } from "~/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Avatar } from "~/components/ui/Avatar";
import { Badge } from "~/components/ui/Badge";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "~/firebase";
import { type Meeting, MeetingStatusLabels } from "~/types/meeting.types";
import { type Mentee } from "~/types/mentee.types";
import { ServiceTypeLabels } from "~/types/mentor.types";
const auth = getAuth();

export default function MentorDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [menteeData, setMenteeData] = useState<Record<string, Mentee>>({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in with UID:", uid);

        // Load data only after confirming user is authenticated
        try {
          // Fetch calendar list from Google Calendar API
          const calendarResponse = await fetch(`/api/calendar?uid=${uid}`);
          if (calendarResponse.ok) {
            const calendarData = await calendarResponse.json();
            console.log("Calendar List:", calendarData.calendars);
          } else {
            const error = await calendarResponse.json();
            console.error("Failed to fetch calendars:", error);
          }

          const querySnap = await getDocs(collection(db, "meetings"));
          const meetings = querySnap.empty
            ? []
            : (querySnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Meeting[]);
          const userMeetings = meetings.filter((m) => m.mentorId === uid);
          setMeetings(userMeetings);
          console.log("Loaded meetings for user:", userMeetings);

          // Now obtain mentee details
          const menteeIds = Array.from(
            new Set(meetings.map((m) => m.menteeId))
          );
          const menteeData: Record<string, Mentee> = {};
          for (const menteeId of menteeIds) {
            const menteeDoc = await getDoc(doc(db, "mentees", menteeId));
            if (!menteeDoc.exists()) {
              console.log(`No data for mentee ID: ${menteeId}`);
              continue;
            }
            menteeData[menteeId] = menteeDoc.data() as Mentee;
          }
          setMenteeData(menteeData);
          console.log("Loaded mentee details:", menteeData);
        } catch (error) {
          console.error("Error loading mentee data:", error);
        }
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
  }, []);

  const user = auth.currentUser;
  if (!user) {
    return null; // Or a loading state
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigate("/register");
      // Sign-out successful.
    } catch (error) {
      // An error happened
      console.error("Error signing out:", error);
    }
  }

  const firstName = user.displayName?.split(" ")[0] || "Mentor";

  const pendingMeetings = meetings.filter((m) => m.status === "pending");

  const upcomingMeetings = meetings
    .filter(
      (m) => m.status === "confirmed" && new Date(m.scheduledDate) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );

  const pastMeetings = meetings
    .filter(
      (m) => m.status === "completed" || new Date(m.scheduledDate) < new Date()
    )
    .sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() -
        new Date(a.scheduledDate).getTime()
    );

  const handleApproveMeeting = async (meetingId: string) => {
    // TODO: Update meeting status in Firebase
    setMeetings(
      meetings.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              status: "confirmed",
              meetingLink: "https://meet.google.com/generated-link",
            }
          : m
      )
    );

    let event;
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;
    console.log("Creating calendar event for meeting:", meeting);
    // event = {

    // calendar.events.insert(
    //   {
    //     auth: auth,
    //     calendarId: "primary",
    //     resource: event,
    //   },
    //   function (err, event) {
    //     if (err) {
    //       console.log(
    //         "There was an error contacting the Calendar service: " + err
    //       );
    //       return;
    //     }
    //     console.log("Event created: %s", event.htmlLink);
    //   }
    // );
  };

  const handleDeclineMeeting = async (meetingId: string) => {
    // TODO: Update meeting status in Firebase
    setMeetings(
      meetings.map((m) =>
        m.id === meetingId ? { ...m, status: "cancelled" } : m
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Hello {firstName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your mentoring sessions and help others grow
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Link to="/mentor/profile-setup">
                <Button variant="primary">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Edit Profile
                </Button>
              </Link>
              <Button
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md"
                onClick={handleLogout}
              >
                <MdLogout />
                <span className="ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Pending Requests
                  </p>
                  <p className="text-3xl font-bold text-amber-600">
                    {meetings.filter((m) => m.status === "pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Upcoming Sessions
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {meetings.filter((m) => m.status === "confirmed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Total Mentored
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {meetings.filter((m) => m.status === "completed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        {pendingMeetings.length > 0 && menteeData && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Pending Requests
              </h2>
              <Badge variant="warning">
                {pendingMeetings.length} awaiting response
              </Badge>
            </div>
            <div className="space-y-4">
              {pendingMeetings.map((meeting) => (
                <MentorMeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  menteeData={menteeData}
                  onApprove={handleApproveMeeting}
                  onDecline={handleDeclineMeeting}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Upcoming Sessions
          </h2>
          {upcomingMeetings.length === 0 || !menteeData ? (
            <Card>
              <CardContent className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No upcoming sessions
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Review pending requests or wait for new mentee bookings
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <MentorMeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  menteeData={menteeData}
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Meetings */}
        {pastMeetings.length > 0 && menteeData && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Past Sessions
            </h2>
            <div className="space-y-4">
              {pastMeetings.slice(0, 5).map((meeting) => (
                <MentorMeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  menteeData={menteeData}
                />
              ))}
            </div>
            {pastMeetings.length > 5 && (
              <div className="text-center mt-4">
                <Button variant="outline">View All Past Sessions</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface MentorMeetingCardProps {
  meeting: Meeting;
  menteeData: Record<string, Mentee>;
  onApprove?: (meetingId: string) => void;
  onDecline?: (meetingId: string) => void;
}

function MentorMeetingCard({
  meeting,
  menteeData,
  onApprove,
  onDecline,
}: MentorMeetingCardProps) {
  const menteeInfo = menteeData[meeting.menteeId];
  console.log("Rendering meeting card for mentee:", menteeInfo);

  // Don't render if mentee data hasn't loaded yet
  if (!menteeInfo) {
    return null;
  }

  const isPending = meeting.status === "pending";

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "info";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start gap-4">
          <Avatar
            size="lg"
            fallback={menteeInfo.firstName + " " + menteeInfo.lastName}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {menteeInfo.firstName} {menteeInfo.lastName}
                </h3>
                {menteeInfo.currentRole && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {menteeInfo.currentRole}
                  </p>
                )}
              </div>
              <Badge variant={getStatusBadgeVariant(meeting.status)}>
                {MeetingStatusLabels[meeting.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(meeting.scheduledDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {meeting.scheduledTime} ({meeting.durationMinutes} min)
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {ServiceTypeLabels[meeting.type]}
              </div>
            </div>

            {meeting.menteeNotes && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-3">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-slate-100">
                    Mentee notes:
                  </strong>{" "}
                  {meeting.menteeNotes}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {isPending && onApprove && onDecline ? (
                <>
                  <Button size="sm" onClick={() => onApprove(meeting.id)}>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDecline(meeting.id)}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Decline
                  </Button>
                </>
              ) : meeting.status === "confirmed" && meeting.meetingLink ? (
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Join Meeting
                  </Button>
                </a>
              ) : null}

              {meeting.status === "confirmed" && (
                <Button size="sm" variant="outline">
                  Add Notes
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

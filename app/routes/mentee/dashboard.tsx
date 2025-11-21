import { Link } from 'react-router';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Avatar } from '~/components/ui/Avatar';
import { Badge } from '~/components/ui/Badge';
import { type Meeting, MeetingStatusLabels } from '~/types/meeting.types';
import { ServiceTypeLabels } from '~/types/mentor.types';

// TODO: Replace with actual data from Firebase
const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    mentorId: '1',
    menteeId: 'current-user',
    type: 'initial-consultation',
    scheduledDate: new Date(2025, 10, 25),
    scheduledTime: '14:00',
    durationMinutes: 30,
    status: 'confirmed',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    menteeNotes: 'Looking to break into software engineering',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    mentorId: '2',
    menteeId: 'current-user',
    type: 'resume-review',
    scheduledDate: new Date(2025, 10, 28),
    scheduledTime: '16:00',
    durationMinutes: 30,
    status: 'pending',
    menteeNotes: 'Need help with my resume for product manager roles',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock mentor data for display
const MOCK_MENTOR_INFO: Record<string, { name: string; title: string; company: string; photo?: string }> = {
  '1': { name: 'Ahmed Rahman', title: 'Senior Software Engineer', company: 'Tech Corp' },
  '2': { name: 'Fatima Hassan', title: 'Product Manager', company: 'Healthcare Solutions' }
};

export default function MenteeDashboard() {
  const upcomingMeetings = MOCK_MEETINGS.filter(
    (m) => m.status === 'confirmed' && new Date(m.scheduledDate) >= new Date()
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const pendingMeetings = MOCK_MEETINGS.filter((m) => m.status === 'pending');

  const pastMeetings = MOCK_MEETINGS.filter(
    (m) => m.status === 'completed' || new Date(m.scheduledDate) < new Date()
  ).sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                My Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track your mentorship journey
              </p>
            </div>
            <Link to="/mentee/browse-mentors">
              <Button>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Find Mentors
              </Button>
            </Link>
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-emerald-600">{upcomingMeetings.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-amber-600">{pendingMeetings.length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-blue-600">{pastMeetings.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Meetings */}
        {pendingMeetings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Pending Approval
            </h2>
            <div className="space-y-4">
              {pendingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Upcoming Meetings
          </h2>
          {upcomingMeetings.length === 0 ? (
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
                  No upcoming meetings
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Connect with a mentor to schedule your first session
                </p>
                <Link to="/mentee/browse-mentors">
                  <Button>Browse Mentors</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          )}
        </div>

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Past Meetings
            </h2>
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const mentorInfo = MOCK_MENTOR_INFO[meeting.mentorId];
  const isPast = new Date(meeting.scheduledDate) < new Date();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start gap-4">
          <Avatar size="lg" fallback={mentorInfo.name} src={mentorInfo.photo} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {mentorInfo.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {mentorInfo.title} at {mentorInfo.company}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(meeting.status)}>
                {MeetingStatusLabels[meeting.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(meeting.scheduledDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                <strong>Notes:</strong> {meeting.menteeNotes}
              </p>
            )}

            <div className="flex gap-2">
              {meeting.status === 'confirmed' && meeting.meetingLink && (
                <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              )}

              {meeting.status === 'confirmed' && !isPast && (
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
              )}

              {meeting.status === 'completed' && meeting.type === 'initial-consultation' && (
                <Link to={`/mentee/request-service/${meeting.mentorId}`}>
                  <Button size="sm" variant="outline">
                    Request Service
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Link } from "react-router";
import { Card, CardContent } from "../Card";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Button } from "../Button";
import type { Mentor } from "../../../types/mentor.types";

export function MentorCard({ mentor }: { mentor: Mentor }) {
  // Calculate total available hours per week
  const totalHours = Object.values(mentor.availability).reduce(
    (total: number, slots: { startTime: string; endTime: string }[]) => {
      return (
        total +
        slots.reduce((slotTotal, slot) => {
          const [startHour, startMin] = slot.startTime.split(":").map(Number);
          const [endHour, endMin] = slot.endTime.split(":").map(Number);
          const duration = endHour * 60 + endMin - (startHour * 60 + startMin);
          return slotTotal + duration / 60;
        }, 0)
      );
    },
    0
  );

  return (
    <Card hover className="h-full flex flex-col">
      <CardContent className="flex flex-col h-full">
        {/* Header with avatar and name */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            size="lg"
            fallback={`${mentor.firstName} ${mentor.lastName}`}
            src={mentor.profilePhotoUrl}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              {mentor.firstName} {mentor.lastName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {mentor.title}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 truncate">
              {mentor.company}
            </p>
          </div>
        </div>

        {/* Rating and experience */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          {mentor.rating && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {mentor.rating.toFixed(1)}
              </span>
              <span className="text-slate-500 dark:text-slate-500">
                ({mentor.totalMeetings} sessions)
              </span>
            </div>
          )}
          <div className="text-slate-600 dark:text-slate-400">
            {mentor.yearsOfExperience}+ years exp
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
          {mentor.bio}
        </p>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {mentor.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="default" size="sm">
                {specialty}
              </Badge>
            ))}
            {mentor.specialties.length > 3 && (
              <Badge variant="info" size="sm">
                +{mentor.specialties.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Availability indicator */}
        <div className="mb-4 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-emerald-600"
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
            <span className="text-slate-600 dark:text-slate-400">
              {totalHours > 0
                ? `~${Math.round(totalHours)} hours/week`
                : "Limited availability"}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-auto">
          <Link to={`/mentee/book-meeting/${mentor.id}`} className="block">
            <Button className="w-full">Book Initial Meeting</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

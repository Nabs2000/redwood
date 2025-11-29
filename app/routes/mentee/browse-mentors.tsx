import { useState, useEffect } from "react";
import { Link } from "react-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Card, CardContent } from "~/components/ui/Card";
import { Avatar } from "~/components/ui/Avatar";
import { Badge } from "~/components/ui/Badge";
import { type Mentor } from "~/types/mentor.types";

// TODO: Replace with actual data from Firebase
async function fetchMentors(): Promise<Mentor[]> {
  const querySnapshot = await getDocs(collection(db, "mentors"));
  const mentors: Mentor[] = [];
  querySnapshot.forEach((doc) => {
    mentors.push(doc.data() as Mentor);
  });
  return mentors;
}

export default function BrowseMentors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);

  // Load mentors from Firebase on component mount
  useEffect(() => {
    fetchMentors().then((data) => setMentors(data));
  }, []);

  const industries = [
    { value: "", label: "All Industries" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "consulting", label: "Consulting" },
    { value: "legal", label: "Legal" },
    { value: "other", label: "Other" },
  ];

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      searchQuery === "" ||
      mentor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesIndustry =
      industryFilter === "" || mentor.industry === industryFilter;

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Find Your Mentor
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Connect with experienced professionals in your community
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, title, company, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              options={industries}
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {filteredMentors.length}{" "}
            {filteredMentors.length === 1 ? "mentor" : "mentors"} available
          </p>
        </div>

        {/* Mentor Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No mentors found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
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

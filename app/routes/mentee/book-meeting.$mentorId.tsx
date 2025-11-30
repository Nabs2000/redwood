import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { Textarea } from "~/components/ui/Textarea";
import { Select } from "~/components/ui/Select";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Avatar } from "~/components/ui/Avatar";
import { Badge } from "~/components/ui/Badge";
import { Calendar } from "~/components/calendar/Calendar";
import { TimeSlotPicker } from "~/components/calendar/TimeSlotPicker";
import { db } from "~/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  type Mentor,
  type ServiceType,
  ServiceTypeLabels,
  ServiceTypeDescriptions,
} from "~/types/mentor.types";

async function fetchMentor(mentorId: string): Promise<Mentor> {
  const docRef = doc(db, "mentors", mentorId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as Omit<Mentor, "id">) };
  } else {
    throw new Error("Mentor not found");
  }
}

export default function BookMeeting() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  // TODO: Fetch mentor from Firebase using mentorId
  if (!mentorId) {
    return <div className="p-8">Mentor ID is missing.</div>;
  }
  const [mentor, setMentor] = useState<Mentor>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    registrationComplete: true,
    mentoredCount: 0,
    pendingRequests: [],
    upcomingSessions: [],

    // Profile information
    title: "", // e.g., "Senior Software Engineer", "Marketing Director"
    bio: "",

    // Expertise and specialties
    industry: "", // e.g., "Technology", "Healthcare", "Finance"
    specialties: [], // e.g., ["Software Engineering", "Career Transitions", "Interview Prep"]
    yearsOfExperience: 0,

    // Availability
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    timezone: "", // e.g., "America/New_York"

    // Services offered
    services: [],

    // Settings
    isActive: true, // Whether accepting new mentees

    // Metadata
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    fetchMentor(mentorId)
      .then((data) => setMentor(data))
      .catch((error) => {
        console.error("Error fetching mentor:", error);
        alert("Failed to load mentor data. Please try again.");
        navigate("/mentee/browse-mentors");
      });
  }, [mentorId, navigate]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>(
    "initial-consultation"
  );
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date: Date | null): string[] => {
    if (!date) return [];

    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()] as keyof typeof mentor.availability;

    const daySlots = mentor.availability[dayName];
    const timeSlots: string[] = [];

    daySlots.forEach((slot) => {
      const [startHour, startMin] = slot.startTime.split(":").map(Number);
      const [endHour, endMin] = slot.endTime.split(":").map(Number);

      let currentHour = startHour;
      let currentMin = startMin;

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
      ) {
        const timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
        timeSlots.push(timeString);

        // Add 30 minutes
        currentMin += 30;
        if (currentMin >= 60) {
          currentMin -= 60;
          currentHour += 1;
        }
      }
    });

    return timeSlots;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Create meeting in Firebase
      const meetingData = {
        mentorId: mentor.id,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        type: selectedService,
        menteeNotes: notes,
        status: "pending",
      };

      console.log("Creating meeting:", meetingData);

      // Navigate to mentee dashboard
      navigate("/mentee/dashboard");
    } catch (error) {
      console.error("Error booking meeting:", error);
      alert("Failed to book meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const serviceOptions = mentor.services.map((service) => ({
    value: service,
    label: ServiceTypeLabels[service],
  }));

  const availableSlots = getAvailableTimeSlots(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/mentee/browse-mentors")}
          className="mb-4"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Mentors
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mentor Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent>
                <div className="text-center mb-4">
                  <Avatar
                    size="xl"
                    fallback={`${mentor.firstName} ${mentor.lastName}`}
                    src={mentor.profilePhotoUrl}
                    className="mx-auto mb-3"
                  />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {mentor.firstName} {mentor.lastName}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {mentor.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {mentor.company}
                  </p>
                </div>

                {/* Rating */}
                {mentor.rating && (
                  <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <svg
                      className="w-5 h-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {mentor.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-500">
                      ({mentor.totalMeetings} sessions)
                    </span>
                  </div>
                )}

                {/* Bio */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    About
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {mentor.bio}
                  </p>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.specialties.map((specialty) => (
                      <Badge key={specialty} variant="success" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
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
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{mentor.yearsOfExperience}+ years of experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Meeting</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Service Type Selection */}
                <div>
                  <Select
                    label="Meeting Type"
                    options={serviceOptions}
                    value={selectedService}
                    onChange={(e) =>
                      setSelectedService(e.target.value as ServiceType)
                    }
                    required
                  />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {ServiceTypeDescriptions[selectedService]}
                  </p>
                </div>

                {/* Calendar */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Date
                  </label>
                  <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null); // Reset time when date changes
                    }}
                    minDate={new Date()}
                  />
                </div>

                {/* Time Slot Picker */}
                {selectedDate && (
                  <div>
                    <TimeSlotPicker
                      availableSlots={availableSlots}
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                      duration={30}
                    />
                  </div>
                )}

                {/* Notes */}
                <Textarea
                  label="What would you like to discuss?"
                  placeholder="Share what you hope to get out of this meeting..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  helperText="Help your mentor prepare by sharing your goals and questions"
                />

                {/* Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                    <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                      Meeting Summary
                    </h4>
                    <div className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                      <p>
                        <strong>Type:</strong>{" "}
                        {ServiceTypeLabels[selectedService]}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime} ({mentor.timezone}
                        )
                      </p>
                      <p>
                        <strong>Duration:</strong> 30 minutes
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full"
                  size="lg"
                >
                  Request Meeting
                </Button>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Your mentor will review your request and confirm the meeting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

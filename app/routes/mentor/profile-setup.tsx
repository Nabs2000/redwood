import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import { Select } from "~/components/ui/Select";
import { db } from "~/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import {
  type WeeklyAvailability,
  type ServiceType,
} from "~/types/mentor.types";

export default function MentorProfileSetup() {
  // Load auth state
  const auth = getAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    // Load existing profile data if available
    if (!auth.currentUser) return;
    const mentor_id = auth.currentUser.uid;
    const loadProfile = async () => {
      const docRef = doc(db, "mentors", mentor_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          title: data.title || "",
          bio: data.bio || "",
          industry: data.industry || "",
          specialties: data.specialties || [],
          yearsOfExperience: data.yearsOfExperience || 0,
          linkedInUrl: data.linkedInUrl || "",
        });
        setAvailability(
          data.availability || {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          }
        );
        setServices(data.services || ["initial-consultation"]);
        return data;
      }
    };
    loadProfile();
    return () => unsubscribe();
  }, [auth, navigate]);

  // Profile data
  const [profile, setProfile] = useState({
    title: "",
    bio: "",
    industry: "",
    specialties: [] as string[],
    yearsOfExperience: 0,
    linkedInUrl: "",
  });

  // Availability data
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  // Services offered
  const [services, setServices] = useState<ServiceType[]>([
    "initial-consultation",
  ]);

  const industries = [
    { value: "", label: "Select an industry" },
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

  const serviceOptions: { value: ServiceType; label: string }[] = [
    { value: "initial-consultation", label: "Initial Consultation" },
    { value: "referral-request", label: "Referral Requests" },
    { value: "resume-review", label: "Resume Reviews" },
    { value: "mock-interview", label: "Mock Interviews" },
    { value: "career-advice", label: "Career Advice" },
  ];

  const handleServiceToggle = (service: ServiceType) => {
    if (services.includes(service)) {
      setServices(services.filter((s) => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const handleAddSpecialty = (specialty: string) => {
    if (specialty && !profile.specialties.includes(specialty)) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, specialty],
      });
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setProfile({
      ...profile,
      specialties: profile.specialties.filter((s) => s !== specialty),
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Save profile to Firebase
      console.log("Saving profile...", { profile, availability, services });
      await setDoc(
        doc(db, "mentors", auth.currentUser!.uid),
        {
          ...profile,
          availability,
          services,
          registrationComplete: true,
        },
        { merge: true }
      );
      // Navigate to mentor dashboard
      navigate("/mentor/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    transition-all duration-300
                    ${
                      step >= s
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }
                  `}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded
                      ${step > s ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-2">
            <span>Profile Info</span>
            <span>Availability</span>
            <span>Services</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Set your availability"}
              {step === 3 && "Choose services to offer"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Step 1: Profile Information */}
            {step === 1 && (
              <div className="space-y-4">
                <Input
                  label="Professional Title"
                  placeholder="e.g., Senior Software Engineer"
                  value={profile.title}
                  onChange={(e) =>
                    setProfile({ ...profile, title: e.target.value })
                  }
                  required
                />

                <Select
                  label="Industry"
                  options={industries}
                  value={profile.industry}
                  onChange={(e) =>
                    setProfile({ ...profile, industry: e.target.value })
                  }
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={profile.yearsOfExperience || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>

                <Textarea
                  label="Bio"
                  placeholder="Tell mentees about your background and what you can help with!"
                  rows={5}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  required
                  helperText="Share your professional journey, expertise, and what motivates you to mentor"
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Areas of Expertise
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a specialty (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSpecialty(
                            (e.target as HTMLInputElement).value
                          );
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
                      >
                        {specialty}
                        <button
                          onClick={() => handleRemoveSpecialty(specialty)}
                          className="hover:text-emerald-900 dark:hover:text-emerald-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <Input
                  label="LinkedIn URL"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={profile.linkedInUrl}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedInUrl: e.target.value })
                  }
                />

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)}>Continue</Button>
                </div>
              </div>
            )}

            {/* Step 2: Availability */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Select the days and times you're typically available for
                  mentoring sessions. You can always adjust this later.
                </p>

                <AvailabilitySelector
                  availability={availability}
                  onChange={setAvailability}
                />

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>Continue</Button>
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Select the types of services you'd like to offer to mentees.
                  Initial consultation is required.
                </p>

                <div className="space-y-3">
                  {serviceOptions.map((service) => (
                    <label
                      key={service.value}
                      className={`
                        flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer
                        transition-all duration-200
                        ${
                          services.includes(service.value)
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                            : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                        }
                        ${service.value === "initial-consultation" ? "opacity-75 cursor-not-allowed" : ""}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={services.includes(service.value)}
                        onChange={() => handleServiceToggle(service.value)}
                        disabled={service.value === "initial-consultation"}
                        className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {service.label}
                          {service.value === "initial-consultation" && (
                            <span className="ml-2 text-xs text-emerald-600">
                              (Required)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {service.value === "initial-consultation" &&
                            "Meet with mentees to understand their goals"}
                          {service.value === "referral-request" &&
                            "Provide referrals to your company or network"}
                          {service.value === "resume-review" &&
                            "Review and provide feedback on resumes"}
                          {service.value === "mock-interview" &&
                            "Conduct practice interviews with feedback"}
                          {service.value === "career-advice" &&
                            "Provide ongoing career guidance"}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} isLoading={isLoading}>
                    Complete Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Availability Selector Component
function AvailabilitySelector({
  availability,
  onChange,
}: {
  availability: WeeklyAvailability;
  onChange: (availability: WeeklyAvailability) => void;
}) {
  const days: (keyof WeeklyAvailability)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [selectedDay, setSelectedDay] =
    useState<keyof WeeklyAvailability>("monday");

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    onChange({
      ...availability,
      [day]: [...availability[day], { startTime: "09:00", endTime: "10:00" }],
    });
  };

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    onChange({
      ...availability,
      [day]: availability[day].filter((_, i) => i !== index),
    });
  };

  const updateTimeSlot = (
    day: keyof WeeklyAvailability,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updated = [...availability[day]];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...availability, [day]: updated });
  };

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
              transition-all duration-200
              ${
                selectedDay === day
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              }
            `}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
            {availability[day].length > 0 && (
              <span className="ml-2 text-xs">({availability[day].length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Time slots for selected day */}
      <div className="border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}{" "}
            Availability
          </h4>
          <Button size="sm" onClick={() => addTimeSlot(selectedDay)}>
            + Add Time
          </Button>
        </div>

        {availability[selectedDay].length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
            No availability set for this day
          </p>
        ) : (
          <div className="space-y-2">
            {availability[selectedDay].map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateTimeSlot(
                      selectedDay,
                      index,
                      "startTime",
                      e.target.value
                    )
                  }
                />
                <span className="text-slate-500">to</span>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateTimeSlot(
                      selectedDay,
                      index,
                      "endTime",
                      e.target.value
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(selectedDay, index)}
                >
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

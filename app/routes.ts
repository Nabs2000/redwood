import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing Page
  index("routes/home.tsx"),

  // Authentication
  route("register", "routes/register.tsx"),

  // API Routes
  route("api/calendar", "routes/api/calendar.ts"),
  route("api/create-meeting", "routes/api/create-meeting.ts"),

  // Mentor Routes
  route("mentor/profile-setup", "routes/mentor/profile-setup.tsx"),
  route("mentor/dashboard", "routes/mentor/dashboard.tsx"),

  // Mentee Routes
  route("mentee/browse-mentors", "routes/mentee/browse-mentors.tsx"),
  route(
    "mentee/book-meeting/:mentorId",
    "routes/mentee/book-meeting.$mentorId.tsx"
  ),
  route(
    "mentee/request-service/:mentorId",
    "routes/mentee/request-service.$mentorId.tsx"
  ),
  route("mentee/dashboard", "routes/mentee/dashboard.tsx"),
] satisfies RouteConfig;

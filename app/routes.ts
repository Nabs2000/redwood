import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing Page
  index("routes/home.tsx"),

  // Authentication
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Mentor Routes
  route("mentor/profile-setup", "routes/mentor/profile-setup.tsx"),
  route("mentor/dashboard", "routes/mentor/dashboard.tsx"),

  // Mentee Routes
  route("mentee/browse-mentors", "routes/mentee/browse-mentors.tsx"),
  route("mentee/book-meeting/:mentorId", "routes/mentee/book-meeting.$mentorId.tsx"),
  route("mentee/request-service/:mentorId", "routes/mentee/request-service.$mentorId.tsx"),
  route("mentee/dashboard", "routes/mentee/dashboard.tsx"),

  // Legacy routes (to be migrated)
  route("professional/:professionalId", "routes/professionalPage.tsx"),
  route("client/:clientId", "routes/clientPage.tsx"),
] satisfies RouteConfig;

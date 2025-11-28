import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Card, CardContent } from "~/components/ui/Card";
import { Avatar } from "~/components/ui/Avatar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Mozlem Mentorz
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Community Career Guidance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Connect with Mentors,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
              Grow Your Career
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Join our Muslim community's professional network. Get career
            guidance, referrals, resume reviews, and mock interviews from
            experienced professionals.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                50+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Active Mentors
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                200+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Sessions Completed
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                15+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Industries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white dark:bg-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              How We Help You Succeed
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Professional mentorship services tailored to your career needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
              title="Career Consultation"
              description="Get personalized guidance on your career path from experienced professionals in your field"
            />
            <ServiceCard
              icon={
                <svg
                  className="w-8 h-8"
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
              }
              title="Job Referrals"
              description="Connect with mentors who can refer you to open positions at top companies"
            />
            <ServiceCard
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="Resume Reviews"
              description="Get expert feedback on your resume to stand out in the job market"
            />
            <ServiceCard
              icon={
                <svg
                  className="w-8 h-8"
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
              }
              title="Mock Interviews"
              description="Practice interviewing with real professionals and get actionable feedback"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Simple Process, Powerful Results
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Start your mentorship journey in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Browse Mentors"
              description="Explore our diverse community of professionals across various industries and specialties"
            />
            <StepCard
              number="2"
              title="Book a Session"
              description="Schedule an initial consultation at a time that works for both you and your mentor"
            />
            <StepCard
              number="3"
              title="Grow Together"
              description="Continue your journey with resume reviews, mock interviews, and career guidance"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Success Stories
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Hear from community members who found success through mentorship
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Ahmed"
              role="Software Engineer at Google"
              quote="The mock interviews I received were invaluable. My mentor's feedback helped me land my dream job at Google!"
            />
            <TestimonialCard
              name="Omar Khan"
              role="Product Manager"
              quote="Thanks to my mentor's referral and guidance, I successfully transitioned from engineering to product management."
            />
            <TestimonialCard
              name="Aisha Patel"
              role="UX Designer"
              quote="The resume review session completely transformed how I presented my skills. I got 3 interview calls in one week!"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card>
            <CardContent className="py-16">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Ready to Take the Next Step?
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Join our growing community of mentors and mentees today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/mentee/browse-mentors">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Browse Mentors
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-white">Mozlem Mentorz</span>
              </div>
              <p className="text-sm text-slate-400">
                Empowering our community through professional mentorship and
                career guidance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">For Mentees</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/mentee/browse-mentors"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Browse Mentors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mentee/dashboard"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">For Mentors</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/register"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Become a Mentor
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mentor/dashboard"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Mentor Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mentor/profile-setup"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Profile Setup
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Mozlem Mentorz. Built with ❤️
              for our community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card hover className="h-full">
      <CardContent className="pt-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
          {icon}
        </div>
        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h4>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
        {number}
      </div>
      <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h4>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar size="md" fallback={name} />
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {name}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {role}
            </div>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 italic">"{quote}"</p>
        <div className="flex gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-5 h-5 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

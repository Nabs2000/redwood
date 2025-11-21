import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import { Avatar } from '~/components/ui/Avatar';
import { type ServiceType, ServiceTypeLabels, ServiceTypeDescriptions } from '~/types/mentor.types';

// TODO: Replace with actual data from Firebase
const MOCK_MENTOR = {
  id: '1',
  name: 'Ahmed Rahman',
  title: 'Senior Software Engineer',
  company: 'Tech Corp',
  photo: undefined,
  servicesOffered: ['referral-request', 'resume-review', 'mock-interview', 'career-advice']
};

export default function RequestService() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  // TODO: Fetch mentor from Firebase
  const mentor = MOCK_MENTOR;

  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form data for each service type
  const [referralData, setReferralData] = useState({
    targetCompany: '',
    targetRole: '',
    applicationDeadline: ''
  });

  const [resumeData, setResumeData] = useState({
    resumeUrl: '',
    targetRoles: '',
    additionalNotes: ''
  });

  const [mockInterviewData, setMockInterviewData] = useState({
    interviewType: 'technical',
    targetRole: '',
    focusAreas: '',
    additionalNotes: ''
  });

  const [careerAdviceData, setCareerAdviceData] = useState({
    topics: '',
    specificQuestions: ''
  });

  const handleSubmit = async () => {
    if (!selectedService) {
      alert('Please select a service type');
      return;
    }

    setIsLoading(true);
    try {
      let serviceRequestData = {};

      switch (selectedService) {
        case 'referral-request':
          serviceRequestData = {
            type: 'referral-request',
            referralDetails: {
              targetCompany: referralData.targetCompany,
              targetRole: referralData.targetRole,
              applicationDeadline: referralData.applicationDeadline
                ? new Date(referralData.applicationDeadline)
                : undefined
            }
          };
          break;

        case 'resume-review':
          serviceRequestData = {
            type: 'resume-review',
            resumeReviewDetails: {
              resumeUrl: resumeData.resumeUrl,
              targetRoles: resumeData.targetRoles.split(',').map((r) => r.trim()),
              additionalNotes: resumeData.additionalNotes
            }
          };
          break;

        case 'mock-interview':
          serviceRequestData = {
            type: 'mock-interview',
            mockInterviewDetails: {
              interviewType: mockInterviewData.interviewType,
              targetRole: mockInterviewData.targetRole,
              focusAreas: mockInterviewData.focusAreas.split(',').map((a) => a.trim()),
              additionalNotes: mockInterviewData.additionalNotes
            }
          };
          break;

        case 'career-advice':
          serviceRequestData = {
            type: 'career-advice',
            careerAdviceDetails: {
              topics: careerAdviceData.topics,
              specificQuestions: careerAdviceData.specificQuestions
            }
          };
          break;
      }

      // TODO: Create service request in Firebase
      console.log('Creating service request:', {
        mentorId: mentor.id,
        ...serviceRequestData,
        status: 'pending'
      });

      // Navigate back to mentee dashboard
      navigate('/mentee/dashboard');
    } catch (error) {
      console.error('Error creating service request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate('/mentee/dashboard')} className="mb-4">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar size="lg" fallback={mentor.name} src={mentor.photo} />
              <div>
                <CardTitle>Request Additional Service</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  from {mentor.name} at {mentor.company}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Service Selection */}
            {!selectedService ? (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  What would you like help with?
                </h3>
                <div className="space-y-3">
                  {mentor.servicesOffered.map((service) => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service as ServiceType)}
                      className="w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all duration-200 bg-white dark:bg-slate-800"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {ServiceTypeLabels[service as ServiceType]}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {ServiceTypeDescriptions[service as ServiceType]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Selected Service Form */}
                <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                        {ServiceTypeLabels[selectedService]}
                      </h4>
                      <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                        {ServiceTypeDescriptions[selectedService]}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedService(null)}
                    >
                      Change
                    </Button>
                  </div>
                </div>

                {/* Referral Request Form */}
                {selectedService === 'referral-request' && (
                  <div className="space-y-4">
                    <Input
                      label="Target Company"
                      placeholder="e.g., Google, Microsoft, Amazon"
                      value={referralData.targetCompany}
                      onChange={(e) =>
                        setReferralData({ ...referralData, targetCompany: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Target Role"
                      placeholder="e.g., Software Engineer, Product Manager"
                      value={referralData.targetRole}
                      onChange={(e) =>
                        setReferralData({ ...referralData, targetRole: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Application Deadline (optional)"
                      type="date"
                      value={referralData.applicationDeadline}
                      onChange={(e) =>
                        setReferralData({ ...referralData, applicationDeadline: e.target.value })
                      }
                    />
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> Make sure you have a strong resume ready and have
                        researched the company and role. Your mentor will review your request and
                        decide if they can provide a referral.
                      </p>
                    </div>
                  </div>
                )}

                {/* Resume Review Form */}
                {selectedService === 'resume-review' && (
                  <div className="space-y-4">
                    <Input
                      label="Resume URL"
                      type="url"
                      placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                      value={resumeData.resumeUrl}
                      onChange={(e) =>
                        setResumeData({ ...resumeData, resumeUrl: e.target.value })
                      }
                      required
                      helperText="Make sure the link is publicly accessible"
                    />
                    <Input
                      label="Target Roles"
                      placeholder="e.g., Software Engineer, Data Scientist (comma-separated)"
                      value={resumeData.targetRoles}
                      onChange={(e) =>
                        setResumeData({ ...resumeData, targetRoles: e.target.value })
                      }
                      required
                    />
                    <Textarea
                      label="Additional Notes (optional)"
                      placeholder="Specific areas you'd like feedback on..."
                      rows={4}
                      value={resumeData.additionalNotes}
                      onChange={(e) =>
                        setResumeData({ ...resumeData, additionalNotes: e.target.value })
                      }
                    />
                  </div>
                )}

                {/* Mock Interview Form */}
                {selectedService === 'mock-interview' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Interview Type
                      </label>
                      <div className="space-y-2">
                        {['technical', 'behavioral', 'case-study', 'system-design'].map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <input
                              type="radio"
                              name="interviewType"
                              value={type}
                              checked={mockInterviewData.interviewType === type}
                              onChange={(e) =>
                                setMockInterviewData({
                                  ...mockInterviewData,
                                  interviewType: e.target.value
                                })
                              }
                              className="w-4 h-4 text-emerald-600"
                            />
                            <span className="text-slate-900 dark:text-slate-100 capitalize">
                              {type.replace('-', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Input
                      label="Target Role"
                      placeholder="e.g., Senior Software Engineer"
                      value={mockInterviewData.targetRole}
                      onChange={(e) =>
                        setMockInterviewData({ ...mockInterviewData, targetRole: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Focus Areas"
                      placeholder="e.g., Data Structures, Algorithms, React (comma-separated)"
                      value={mockInterviewData.focusAreas}
                      onChange={(e) =>
                        setMockInterviewData({ ...mockInterviewData, focusAreas: e.target.value })
                      }
                      required
                    />

                    <Textarea
                      label="Additional Notes (optional)"
                      placeholder="Any specific topics or concerns you'd like to focus on..."
                      rows={4}
                      value={mockInterviewData.additionalNotes}
                      onChange={(e) =>
                        setMockInterviewData({
                          ...mockInterviewData,
                          additionalNotes: e.target.value
                        })
                      }
                    />
                  </div>
                )}

                {/* Career Advice Form */}
                {selectedService === 'career-advice' && (
                  <div className="space-y-4">
                    <Textarea
                      label="Topics to Discuss"
                      placeholder="e.g., Career transitions, work-life balance, salary negotiation"
                      rows={3}
                      value={careerAdviceData.topics}
                      onChange={(e) =>
                        setCareerAdviceData({ ...careerAdviceData, topics: e.target.value })
                      }
                      required
                    />

                    <Textarea
                      label="Specific Questions"
                      placeholder="List any specific questions you'd like to ask..."
                      rows={5}
                      value={careerAdviceData.specificQuestions}
                      onChange={(e) =>
                        setCareerAdviceData({
                          ...careerAdviceData,
                          specificQuestions: e.target.value
                        })
                      }
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button onClick={handleSubmit} isLoading={isLoading} className="w-full" size="lg">
                    Submit Request
                  </Button>
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
                    Your mentor will review your request and respond soon
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

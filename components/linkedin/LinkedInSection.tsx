"use client";

import { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { BriefcaseIcon, PencilIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface LinkedInProfile {
  headline?: string;
  summary?: string;
  experiences?: {
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate?: string;
  }[];
  skills?: string[];
}

export function LinkedInSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
 

  // Mock LinkedIn authentication
  const handleLinkedInSignIn = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockProfile: LinkedInProfile = {
        headline: "Software Engineer at Tech Company",
        summary: "Experienced software engineer with a passion for building scalable web applications. Proficient in JavaScript, React, and Node.js.",
        experiences: [
          {
            title: "Senior Software Engineer",
            company: "Tech Company",
            description: "Led development of key features for the company's main product. Collaborated with cross-functional teams to deliver high-quality software.",
            startDate: "2020-01",
            endDate: "Present"
          },
          {
            title: "Software Engineer",
            company: "Previous Company",
            description: "Developed and maintained web applications using React and Node.js.",
            startDate: "2018-03",
            endDate: "2019-12"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS"]
      };
      setProfile(mockProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error signing in with LinkedIn:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (profile: LinkedInProfile) => {
    const suggestions = [];
    if (!profile.headline || profile.headline.length < 20) {
      suggestions.push({
        type: "headline",
        message: "Your headline is too short. Consider adding more details about your role and expertise."
      });
    }
    if (!profile.summary || profile.summary.length < 100) {
      suggestions.push({
        type: "summary",
        message: "Your summary is too brief. Add more details about your experience, skills, and career goals."
      });
    } else if (profile.summary.length > 500) {
      suggestions.push({
        type: "summary",
        message: "Your summary is quite long. Consider making it more concise for better readability."
      });
    }
    if (!profile.experiences || profile.experiences.length === 0) {
      suggestions.push({
        type: "experience",
        message: "Add your work experiences to make your profile more complete."
      });
    } else {
      profile.experiences.forEach((exp, index) => {
        if (exp.description.length < 50) {
          suggestions.push({
            type: "experience",
            index,
            message: `The description for your role at ${exp.company} is too brief. Add more details about your responsibilities and achievements.`
          });
        }
      });
    }
    if (!profile.skills || profile.skills.length < 5) {
      suggestions.push({
        type: "skills",
        message: "Add more skills to showcase your expertise. Aim for at least 10 relevant skills."
      });
    }
    return suggestions;
  };
  

  return (
    <div className="min-h-screen h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#1f2937_40%,#1e40af_100%)] flex">
      {/* Added dark mode */}
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-zinc-950 dark:text-white">LinkedIn Profile Optimizer</h1>

        {/* User Guide */}
        {showGuide && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <InformationCircleIcon className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">How to Use LinkedIn Optimizer</h3>
                <p className="text-blue-700 dark:text-blue-300 mb-2">
                  This tool helps you optimize your LinkedIn profile by analyzing your current profile and providing suggestions for improvement.
                </p>
                <ol className="list-decimal list-inside text-blue-700 dark:text-blue-300 space-y-1 mb-3">
                  <li>Click the &quot;Sign in with LinkedIn&quot; button to authenticate and import your profile data</li>
                  <li>Review your imported profile information</li>
                  <li>Check the suggestions provided to improve your profile</li>
                  <li>Edit your profile based on the suggestions</li>
                  <li>Save your changes and update your LinkedIn profile</li>
                </ol>
                <button 
                  onClick={() => setShowGuide(false)}
                  className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 px-3 py-1 mt-2 rounded-md bg-blue-100 dark:bg-blue-900"
                >
                  Hide Guide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LinkedIn Sign In */}
        {!isAuthenticated ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center flex flex-col items-center">
            <BriefcaseIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-zinc-950 dark:text-white">Connect Your LinkedIn Profile</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign in with LinkedIn to import your profile data and get personalized optimization suggestions.
            </p>
            <button
              onClick={handleLinkedInSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#0077B5] hover:bg-[#006699] text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  Sign in with LinkedIn
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">Profile Overview</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900">
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
              <div className="space-y-4">
                {/* Headline */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">Headline</h3>
                    {profile?.headline && profile.headline.length >= 20 ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" /> Good
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center gap-1">
                        <ExclamationCircleIcon className="w-4 h-4" /> Needs Improvement
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">{profile?.headline || "No headline provided"}</p>
                </div>
                {/* Summary */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">Summary</h3>
                    {profile?.summary && profile.summary.length >= 100 && profile.summary.length <= 500 ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" /> Good
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center gap-1">
                        <ExclamationCircleIcon className="w-4 h-4" /> Needs Improvement
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-line">
                    {profile?.summary || "No summary provided"}
                  </p>
                </div>
                {/* Skills */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">Skills</h3>
                    {profile?.skills && profile.skills.length >= 5 ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" /> Good
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center gap-1">
                        <ExclamationCircleIcon className="w-4 h-4" /> Needs Improvement
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No skills provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-zinc-950 dark:text-white">Work Experience</h2>
              {profile?.experiences && profile.experiences.length > 0 ? (
                <div className="space-y-6">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-100">{exp.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{exp.company}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</h4>
                          {exp.description.length >= 50 ? (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1">
                              <CheckCircleIcon className="w-4 h-4" /> Good
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center gap-1">
                              <ExclamationCircleIcon className="w-4 h-4" /> Too Brief
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No work experience found. Add your work history to enhance your profile.</p>
                </div>
              )}
            </div>
            {/* Suggestions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-zinc-950 dark:text-white">Optimization Suggestions</h2>
              {profile && generateSuggestions(profile).length > 0 ? (
                <ul className="space-y-3">
                  {generateSuggestions(profile).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-900 rounded-md">
                      <ExclamationCircleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-800 dark:text-gray-100">{suggestion.message}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {suggestion.type === "headline" && "Update your headline to be more specific and include your key skills or expertise."}
                          {suggestion.type === "summary" && "Your summary should tell your professional story and highlight your achievements."}
                          {suggestion.type === "experience" && "Include specific achievements and quantifiable results in your experience descriptions."}
                          {suggestion.type === "skills" && "Add skills that are relevant to your industry and match keywords from job descriptions."}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-medium">Great job! Your LinkedIn profile looks well-optimized.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
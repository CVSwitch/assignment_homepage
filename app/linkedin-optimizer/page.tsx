"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LinkedInSection } from "@/components/linkedin/LinkedInSection";
import { resumeService } from "@/services/resumeService";
import {
  DocumentArrowUpIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClipboardIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/auth";

export default function LinkedInOptimizerPage() {
  const { user } = useAuth() as { user: User | null };
  const { resumes, isLoading, uploadResume, uploadLoading } = useResumes(user?.uid);

  interface OptimizationData {
    about: string;
    headline: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string[];
    }>;
    skills: Array<{
      name: string;
      relevance: string;
      match: boolean;
    }>;
    education: string;
    recommendations: string[];
    score: number;
    keywordMatches: string[];
  }

  //Copied Section 
  interface CopiedSections {
    [key: string]: boolean;
  }

  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [optimizationData, setOptimizationData] = useState<OptimizationData | null>(null);
  const [copiedSections, setCopiedSections] = useState<CopiedSections>({});

  const handleResumeClick = (resumeId: string) => {
    setSelectedResumeId(resumeId);
  };

  const handleCopyToClipboard = (sectionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSections(prev => ({ ...prev, [sectionId]: true }));
    setTimeout(() => {
      setCopiedSections(prev => ({ ...prev, [sectionId]: false }));
    }, 2000);
  };

  // interface GetSuggestionsParams {
  //   resumeId: string;
  //   jobDescription?: string;
  // }

  const handleGetLinkedInSuggestions = async () => {
    if (!selectedResumeId) {
      alert('Please select a resume to get LinkedIn suggestions.');
      return;
    }

    setLoadingSuggestions(true);
    try {
      const data = await resumeService.getLinkedInSuggestions(
        user?.uid || '',
        selectedResumeId,
        jobDescription
      );

      const parsedData = JSON.parse(data.data);
      setOptimizationData({
        about: parsedData.About || "",
        headline: parsedData.Headline || "",
        experience: parsedData.Experience || [],
        skills: parsedData.Skills || [],
        education: parsedData.Education || "",
        recommendations: parsedData.Recommendations || [],
        score: parsedData.Score || 0,
        keywordMatches: parsedData.KeywordMatches || []
      });
    } catch (error) {
      console.error('Error fetching LinkedIn suggestions:', error);
      alert('Failed to fetch LinkedIn suggestions. Please try again.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Dummy data for demonstration
  const dummyOptimizationData: OptimizationData = {
    about: "Results-driven software engineer with 5+ years of experience in full-stack development. Specialized in JavaScript, React, and Node.js with a proven track record of delivering scalable web applications. Passionate about clean code and agile methodologies. Recently led a team that improved application performance by 40% through optimized database queries and frontend lazy loading.",
    headline: "Senior Software Engineer | Full-Stack Developer | JavaScript Expert",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        duration: "2020 - Present",
        description: [
          "Led a team of 5 developers to build a customer portal that increased user engagement by 35%",
          "Optimized database queries reducing API response time by 300ms",
          "Implemented CI/CD pipeline reducing deployment time by 50%"
        ]
      },
      {
        title: "Software Developer",
        company: "Digital Innovations",
        duration: "2018 - 2020",
        description: [
          "Developed React components that improved page load performance by 25%",
          "Collaborated with UX team to redesign admin dashboard",
          "Mentored 2 junior developers in JavaScript best practices"
        ]
      }
    ],
    skills: [
      { name: "JavaScript", relevance: "High", match: true },
      { name: "React", relevance: "High", match: true },
      { name: "Node.js", relevance: "High", match: true },
      { name: "TypeScript", relevance: "Medium", match: false },
      { name: "AWS", relevance: "Medium", match: true },
      { name: "Docker", relevance: "Medium", match: false }
    ],
    education: "Bachelor of Science in Computer Science\nUniversity of Technology, 2018",
    recommendations: [
      "Highlight your experience with cloud technologies more prominently",
      "Add metrics to quantify your achievements in previous roles",
      "Include any open-source contributions or side projects"
    ],
    score: 70,
    keywordMatches: ["JavaScript", "React", "Node.js", "Agile", "CI/CD", "AWS", "Docker", "Mentorship"],
  };

  const displayData = optimizationData || dummyOptimizationData;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-72">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">LinkedIn Profile Optimizer</h1>
              <p className="text-slate-600">
                Enhance your LinkedIn profile based on your resume and target job description
              </p>
            </div>
            {displayData.score > 0 && (
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{displayData.score}%</div>
                  <div className="text-sm text-slate-500">Optimization Score</div>
                </div>
                <Progress value={displayData.score} className="w-32 h-2" />
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Resume Selection */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">Select your resume</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading your resumes...</p>
                </div>
              ) : resumes.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    {resumes.map((resume) => (
                      <div
                        key={resume.cloudPath}
                        onClick={() => {
                          if (resume.cloudPath) {
                            handleResumeClick(resume.cloudPath);
                          }
                        }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${selectedResumeId === resume.cloudPath
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-slate-50"
                          } cursor-pointer transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                          <div>
                            <p className="font-medium text-slate-800">{resume.name}</p>
                            <p className="text-sm text-slate-500">
                              Last modified: {resume.lastModified}
                            </p>
                          </div>
                        </div>
                        {selectedResumeId === resume.cloudPath && (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>
                    {user
                      ? "No resumes found. Upload or create a new resume to get started."
                      : "Please sign in to view your resumes."}
                  </p>
                </div>
              )}
            </div>

            {/* Job Description Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Target Job Description (Optional)
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Add a job description to get more tailored suggestions for your profile
              </p>
              <Textarea
                className="min-h-[200px]"
                placeholder="Paste the job description you're targeting..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <Button
                  variant="default"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleGetLinkedInSuggestions}
                  disabled={!selectedResumeId || loadingSuggestions}
                >
                  {loadingSuggestions ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Optimize My Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Optimization Results */}
          {displayData && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Optimization Results</h2>
                {displayData.keywordMatches.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Keyword Matches:</span>
                    <div className="flex flex-wrap gap-2">
                      {displayData.keywordMatches.slice(0, 5).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {keyword}
                        </Badge>
                      ))}
                      {displayData.keywordMatches.length > 5 && (
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          +{displayData.keywordMatches.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto">
                  <TabsTrigger value="about" className="py-2" onClick={() => setActiveTab("about")}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    About
                  </TabsTrigger>
                  <TabsTrigger value="headline" className="py-2" onClick={() => setActiveTab("headline")}>
                    <LightBulbIcon className="w-4 h-4 mr-2" />
                    Headline
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="py-2" onClick={() => setActiveTab("experience")}>
                    <BriefcaseIcon className="w-4 h-4 mr-2" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="py-2" onClick={() => setActiveTab("skills")}>
                    <TrophyIcon className="w-4 h-4 mr-2" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="education" className="py-2" onClick={() => setActiveTab("education")}>
                    <AcademicCapIcon className="w-4 h-4 mr-2" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="py-2" onClick={() => setActiveTab("recommendations")}>
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Tips
                  </TabsTrigger>
                </TabsList>

                {/* Tab Content About */}
                <TabsContent value="about" className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">About Section</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard('about', displayData.about)}
                    >
                      {copiedSections['about'] ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="whitespace-pre-line text-slate-700">{displayData.about}</p>
                  </div>
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      Optimization Tips
                    </h4>
                    <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                      <li>Your summary effectively highlights your technical skills and achievements</li>
                      <li>Consider adding a personal touch about what motivates you in your work</li>
                      <li>The metrics you've included (40% performance improvement) are excellent</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Tab Content Headline */}
                <TabsContent value="headline" className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Headline</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard('headline', displayData.headline)}
                    >
                      {copiedSections['headline'] ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-lg font-medium text-slate-800">{displayData.headline}</p>
                  </div>
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      Optimization Tips
                    </h4>
                    <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                      <li>Strong use of keywords (JavaScript Expert) that recruiters search for</li>
                      <li>Consider adding your years of experience if space allows</li>
                      <li>You might test different versions to see which performs better</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Tab Content Experience */}
                <TabsContent value="experience" className="pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Experience Section</h3>
                  <div className="space-y-6">
                    {displayData.experience.map((exp, index) => (
                      <div key={index} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-slate-800">{exp.title}</h4>
                            <p className="text-slate-600">{exp.company} • {exp.duration}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyToClipboard(`exp-${index}`, `${exp.title}\n${exp.company}\n${exp.duration}\n\n${exp.description.join('\n')}`)}
                          >
                            {copiedSections[`exp-${index}`] ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <ClipboardIcon className="w-4 h-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <ul className="list-disc list-inside ml-5 space-y-1 text-slate-700">
                          {exp.description.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        {index === 0 && (
                          <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                            <h4 className="font-medium text-green-800 mb-1 flex items-center gap-2">
                              <SparklesIcon className="w-4 h-4" />
                              Strong Points
                            </h4>
                            <p className="text-green-700 text-sm">
                              Your current position highlights leadership and measurable impacts effectively.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      Optimization Tips
                    </h4>
                    <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                      <li>All positions include strong action verbs and quantifiable results</li>
                      <li>Consider adding more metrics to your earlier positions if possible</li>
                      <li>Your most recent experience is well-optimized for your target role</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Tab Content Skills */}
                <TabsContent value="skills" className="pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Skills</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {displayData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${skill.match
                          ? "bg-green-50 border-green-200"
                          : "bg-slate-50 border-slate-200"
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-800">{skill.name}</span>
                          {skill.match ? (
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                              Match
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                              Suggested
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-slate-500">Relevance: </span>
                          <span className="text-xs font-medium">
                            {skill.relevance === "High" ? (
                              <span className="text-red-600">High</span>
                            ) : (
                              <span className="text-amber-600">Medium</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      Optimization Tips
                    </h4>
                    <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                      <li>You have all the key skills recruiters look for in your field</li>
                      <li>Consider adding TypeScript as it's increasingly in demand</li>
                      <li>Docker would be a valuable addition to your listed skills</li>
                      <li>Make sure to get endorsements for your top 3 skills</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Tab Content Education */}
                <TabsContent value="education" className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Education</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard('education', displayData.education)}
                    >
                      {copiedSections['education'] ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="whitespace-pre-line text-slate-700">{displayData.education}</p>
                  </div>
                </TabsContent>

                {/* Tab Content Recommendations */}
                <TabsContent value="recommendations" className="pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Additional Recommendations</h3>
                  <div className="space-y-4">
                    {displayData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <SparklesIcon className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex-1">
                          <p className="text-slate-700">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
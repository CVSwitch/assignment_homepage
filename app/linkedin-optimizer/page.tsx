"use client";

import React, { useState, useRef, useEffect} from 'react';
import { LinkedInSection } from "@/components/linkedin/LinkedInSection";
import { resumeService } from "@/services/resumeService";

import {
  DocumentArrowUpIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
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

export default function LinkedInOptimizerPage() {
  const { user } = useAuth();

  const { 
    resumes, 
    isLoading, 
    uploadResume, 
    uploadLoading 
  } = useResumes(user?.id);

  // State to store the selected resume ID
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null); // Store suggestions as an array
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false); // State for loader

  const handleResumeClick = (resumeId: string) => {
    setSelectedResumeId(resumeId);
  };

  const handleGetLinkedInSuggestions = async () => {
    if (selectedResumeId) {
      setLoadingSuggestions(true); // Show loader
      try {
        const suggestions = await resumeService.getLinkedInSuggestions(user?.id || '', selectedResumeId);
        setSuggestions(JSON.parse(suggestions.data).About); // Store fetched suggestions
        console.log('LinkedIn suggestions:', suggestions);
      } catch (error) {
        console.error('Error fetching LinkedIn suggestions:', error);
        alert('Failed to fetch LinkedIn suggestions. Please try again.');
      } finally {
        setLoadingSuggestions(false); // Hide loader
      }
    } else {
      alert('Please select a resume to get LinkedIn suggestions.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Resume Selection Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800">Select a Resume</h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading your resumes...</p>
              </div>
            ) : resumes.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((resume) => (
                    <div
                      key={resume.cloudPath}
                      onClick={() => {
                        if (resume.cloudPath) {
                          handleResumeClick(resume.cloudPath);
                        } else {
                          console.error("cloudPath is undefined for this resume.");
                        }
                      }}
                      className={`flex items-center justify-between p-4 bg-slate-50 rounded-lg border transition-all duration-200 ${
                        selectedResumeId === resume.cloudPath
                          ? "border-indigo-500 bg-indigo-50 shadow-sm"
                          : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                      } cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                        <div className="truncate max-w-[180px]">
                          <p className="font-medium text-slate-800 truncate">{resume.name}</p>
                          <p className="text-sm text-slate-500 truncate">
                            Last modified: {resume.lastModified}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {resume.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-600 hover:bg-slate-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(resume.url, "_blank");
                            }}
                          >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
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

          {/* Get LinkedIn Suggestions Button */}
          <div className="text-center">
            <Button
              variant="default"
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-6 text-lg font-medium"
              onClick={handleGetLinkedInSuggestions}
            >
              Get LinkedIn Suggestions
            </Button>
          </div>

          {/* Suggestions or Key Points Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            {loadingSuggestions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Fetching LinkedIn suggestions...</p>
              </div>
            ) : suggestions ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">About Section</h3>
                  <p className="text-slate-700 leading-relaxed">{suggestions}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">Additional Suggestions</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                      <p className="text-slate-700">Use a professional photo – High-quality headshot with a clean background.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                      <p className="text-slate-700">Write a strong headline – Go beyond just your job title. Show your value (e.g., "Product Manager | Driving Growth through Data-Driven Strategy").</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                      <p className="text-slate-700">Craft a compelling summary – Tell your story: who you are, what you do, and what drives you.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                      <p className="text-slate-700">Highlight achievements in your experience section – Use bullet points, quantify impact (e.g., "Increased sales by 30% in 6 months").</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                      <p className="text-slate-700">Add relevant skills – Keep it focused and up-to-date; LinkedIn uses these for search rankings.</p>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-800">Key Points</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Optimize your LinkedIn profile for better visibility</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Highlight your key skills and achievements</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Ensure your profile photo is professional</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Write a compelling LinkedIn summary</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Use relevant keywords in your profile</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Request recommendations from colleagues</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Keep your work experience up to date</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                    <p className="text-slate-700">Engage with posts and share industry insights</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


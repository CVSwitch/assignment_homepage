"use client";

import { useState, useRef, useEffect } from "react";
import {
  DocumentArrowUpIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  // TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { Loader2 } from "lucide-react";
import { resumeService } from "@/services/resumeService";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
// import { useTheme } from "next-themes";

interface Resume {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
  cloudPath?: string;
  jsonUrl?: string | null;
  parsingStatus?: "parsing" | "completed" | "failed" | undefined;
}

interface ResumeAnalysis {
  Areas_of_Improvment: string[];
  strengths: string[];
}

export function ResumeSection() {
  const [mounted, setMounted] = useState(false);
  // const { theme } = useTheme();
  const { user } = useAuth();
  const { 
    resumes, 
    isLoading, 
    uploadResume, 
    uploadLoading,
    error 
  } = useResumes(user?.id);
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log(resumes, 'resumes')
  
  const [setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "strengths" | "weaknesses" | "improvements"
  >("strengths");
  const [parsingStatus, setParsingStatus] = useState<"idle" | "parsing" | "completed" | "failed">("idle");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [setCurrentlyParsingResumeId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen h-full w-full bg-white dark:bg-gray-900">
        <Sidebar onCollapseChange={setIsCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"} p-4 lg:p-6 w-full max-w-4xl mx-auto`}>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        </main>
      </div>
    );
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && user) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setParsingStatus("idle");
      
      try {
        // Upload the resume
        const uploadedResume = await uploadResume(file);
        
        // Show parsing status
        setParsingStatus("parsing");
        
        if (uploadedResume?.data?.resume_id) {
          const resumeId = uploadedResume?.data?.resume_id;
          setCurrentlyParsingResumeId(resumeId);
          
          // Call parse_uploaded_resume endpoint
          const parseResponse = await axios.get(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARSE_UPLOADED_RESUME}?resume_id=${resumeId}&user_id=${user.uid}`
          );
          
          if (parseResponse.status === 200) {
            setParsingStatus("completed");
            setCurrentlyParsingResumeId(null);
          } else {
            setParsingStatus("failed");
            setCurrentlyParsingResumeId(null);
            setError("Failed to parse resume. Please try again.");
          }
        } else {
          setParsingStatus("failed");
          setCurrentlyParsingResumeId(null);
          setError("Failed to get resume ID. Please try again.");
        }
      } catch (error) {
        console.error("Error in resume upload/parsing:", error);
        setParsingStatus("failed");
        setCurrentlyParsingResumeId(null);
        setError("An error occurred while processing your resume. Please try again.");
      }
    }
  };

  const handleAnalyze = async (resume: Resume) => {
    if (!user?.uid || !resume.jsonUrl) {
      setError('Missing required data for analysis');
      return;
    }

    setAnalysisLoading(true);
    setShowAnalysisModal(true);
    setError(null);
    
    try {
      const analysis = await resumeService.analyzeResume(user.uid, resume.jsonUrl);
      console.log('Analysis response:', analysis); // Debug log
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing the resume');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_RESUME}`,
        {
          user_id: user.uid,
          resume_id: resumeId
        }
      );

      if (response.status === 200) {
        // Refresh the resumes list
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      setError('Failed to delete resume. Please try again.');
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleDeleteClick = (resumeId: string) => {
    setResumeToDelete(resumeId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (resumeToDelete) {
      await handleDelete(resumeToDelete);
      setShowDeleteModal(false);
      setResumeToDelete(null);
    }
  };

  return (
    <div className="min-h-screen h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#1f2937_40%,#1e40af_100%)] flex">
      {/* Added dark mode and responsiveness */}
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className="flex-1 transition-all duration-300 lg:ml-16 lg:data-[sidebar-expanded=true]:ml-64 p-4 lg:p-6 max-w-4xl mx-auto w-full" data-sidebar-expanded={!isCollapsed}>
        <div className="w-full">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
            Resume Optimizer
          </h1>

          {/* Primary Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-solid border-slate-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer"
            >
              {uploadLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
              ) : (
                <DocumentArrowUpIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-3" />
              )}
              <h3 className="font-semibold text-lg mb-1 text-slate-800 dark:text-white">Upload Resume</h3>
              <p className="text-slate-500 dark:text-gray-400 text-center">
                Upload your resume for optimization
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>

            <Link href="/resume/create">
              <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-slate-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer h-full">
                <PencilIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="font-semibold text-lg mb-1 text-slate-800 dark:text-white">
                  Create from Scratch
                </h3>
                <p className="text-slate-500 dark:text-gray-400 text-center">
                  Build a new resume
                </p>
              </div>
            </Link>
          </div>
          
          {/* Parsing Status Message */}
          {parsingStatus !== "idle" && (
            <div className={`text-center p-2 mb-6 rounded-lg ${
              parsingStatus === "parsing" 
                ? "bg-amber-50 text-amber-700" 
                : "bg-green-50 text-green-700"
            }`}>
              {parsingStatus === "parsing" 
                ? "Your resume is being parsed. This may take a few moments..." 
                : "Resume successfully parsed! You can now analyze it."}
            </div>
          )}

          {/* Past Resumes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Past Resumes</h2>

            {error ? (
              <div className="text-center py-8 text-red-500 dark:text-red-400">
                <p>{error}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
                <p className="text-slate-500 dark:text-gray-400">Loading your resumes...</p>
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.map((resume: Resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{resume.name}</p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          Last modified: {resume.lastModified}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/resume/${resume.id}`}>
                        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600">
                          <PencilIcon className="w-5 h-5" />
                        </Button>
                      </Link>

                      {resume.url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600"
                          onClick={() => window.open(resume.url, '_blank')}
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600"
                        onClick={() => handleAnalyze(resume)}
                      >
                        <InformationCircleIcon className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600"
                        onClick={() => handleDeleteClick(resume.id)}
                      >
                        <InformationCircleIcon className="w-5 h-5" />
                      </Button>
                      {resume.parsingStatus === "parsing" && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                          <span className="text-sm">Parsing...</span>
                        </div>
                      )}

                      {resume.parsingStatus === "failed" && (
                        <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                          <InformationCircleIcon className="w-5 h-5" />
                          <span className="text-sm">Failed to parse</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                <p>
                  {user ? "No resumes found. Upload or create a new resume to get started." : 
                   "Please sign in to view your resumes."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analysis Modal */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent className="sm:max-w-4xl p-0 rounded-lg overflow-hidden border-0 shadow-xl">
          <DialogHeader className="border-b border-slate-200 p-4">
            <DialogTitle className="text-slate-800">Resume Analysis</DialogTitle>
          </DialogHeader>

          {error ? (
            <div className="flex items-center justify-center p-12 text-red-600">
              <p>{error}</p>
            </div>
          ) : analysisLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-slate-600">Analyzing your resume...</span>
            </div>
          ) : currentAnalysis ? (
            <div className="flex h-[500px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-slate-200 p-4 bg-slate-50">
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab("strengths")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === "strengths"
                        ? "bg-indigo-100 text-indigo-700 font-medium border-l-4 border-indigo-500"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Strengths
                  </button>
                  <button
                    onClick={() => setActiveTab("improvements")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === "improvements"
                        ? "bg-indigo-100 text-indigo-700 font-medium border-l-4 border-indigo-500"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Improvements
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <ScrollArea className="flex-1 p-6">
                <h3 className="text-lg font-medium mb-4 text-slate-800 capitalize">
                  {activeTab === "improvements" ? "Areas of Improvement" : activeTab}
                </h3>

                <ul className="space-y-4">
                  {activeTab === "strengths" && currentAnalysis.strengths && 
                    currentAnalysis.strengths.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-emerald-500"></span>
                        <p className="text-slate-700">{item}</p>
                      </li>
                    ))
                  }
                  {activeTab === "improvements" && currentAnalysis.Areas_of_Improvment && 
                    currentAnalysis.Areas_of_Improvment.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-amber-500"></span>
                        <p className="text-slate-700">{item}</p>
                      </li>
                    ))
                  }
                </ul>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <p className="text-slate-600">No analysis data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
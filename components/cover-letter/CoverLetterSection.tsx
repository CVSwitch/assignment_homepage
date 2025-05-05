"use client";

import { useState, useRef } from "react";
import {
  DocumentArrowUpIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  // ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCoverLetters } from "@/hooks/useCoverLetters";
// import { useTheme } from "next-themes";

interface CoverLetter {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
}

export default function CoverLetterSection() {
  const { user } = useAuth();
  const { coverLetters, isLoading, uploadCoverLetter, uploadLoading, error } = useCoverLetters(user?.id);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [mounted, setMounted] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && user) {
      const file = event.target.files[0];
      await uploadCoverLetter(file);
    }
  };

  return (
    <div className="min-h-screen h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#1f2937_40%,#1e40af_100%)] flex flex-col md:flex-row">
      {/* Added dark mode and responsiveness */}
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 lg:p-6 max-w-4xl mx-auto w-full`}>
        <div className="w-full">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
            Cover Letter Optimizer
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
              <h3 className="font-semibold text-lg mb-1 text-slate-800 dark:text-white">Upload Cover Letter</h3>
              <p className="text-slate-500 dark:text-gray-400 text-center">
                Upload your cover letter for optimization
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>

            <Link href="/cover-letter/create">
              <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-slate-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer h-full">
                <PencilIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-3" />
                <h3 className="font-semibold text-lg mb-1 text-slate-800 dark:text-white">
                  Create from Scratch
                </h3>
                <p className="text-slate-500 dark:text-gray-400 text-center">
                  Build a new cover letter
                </p>
              </div>
            </Link>
          </div>

          {/* Past Cover Letters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4 md:p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Past Cover Letters</h2>

            {error ? (
              <div className="text-center py-8 text-red-500 dark:text-red-400">
                <p>{error}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
                <p className="text-slate-500 dark:text-gray-400">Loading your cover letters...</p>
              </div>
            ) : coverLetters.length > 0 ? (
              <div className="space-y-3">
                {coverLetters.map((coverLetter: CoverLetter) => (
                  <div
                    key={coverLetter.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{coverLetter.name}</p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          Last modified: {coverLetter.lastModified}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/cover-letter/${coverLetter.id}`}>
                        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600">
                          <PencilIcon className="w-5 h-5" />
                        </Button>
                      </Link>

                      {coverLetter.url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600"
                          onClick={() => window.open(coverLetter.url, '_blank')}
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                <p>
                  {user ? "No cover letters found. Upload or create a new cover letter to get started." : 
                   "Please sign in to view your cover letters."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
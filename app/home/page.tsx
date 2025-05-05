"use client";

import { Sidebar } from "@/components/Sidebar";
import { HeroSection } from "@/components/HeroSection";
import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
// import { useTheme } from 'next-themes';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState(auth.getCurrentUser());
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [pastResumes, setPastResumes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleUploadResume = (file: File) => {
    console.log('Resume uploaded:', file.name);
    setPastResumes((prev) => [...prev, file.name]);
    setHasUploadedResume(true);
  };

  const handleOfferingSelect = async (selectedOption: string) => {
    if (user) {
      try {
        // Implement your offering selection logic here
        console.log('Selected offering:', selectedOption);
      } catch (error) {
        console.error('Error saving user preference:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#1f2937_40%,#1e40af_100%)] flex flex-col md:flex-row">
      {/* Added dark mode. */}
      {/* Sidebar component handles navigation and collapsible menu */}
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 lg:p-6 max-w-4xl mx-auto w-full`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
            Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.username || 'User'}</span>! 👋
          </h1>
        </div>

        <HeroSection 
          user={user} 
          hasUploadedResume={hasUploadedResume} 
          onUploadResume={handleUploadResume}
          pastResumes={pastResumes}
          onOfferingSelect={handleOfferingSelect}
        />
      </main>
    </div>
  );
} 
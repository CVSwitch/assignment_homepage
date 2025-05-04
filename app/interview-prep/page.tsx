"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { InterviewPrepSection } from "@/components/interview/InterviewPrepSection";

// InterviewPrepSection component handles the main interview preparation functionality
// including chat interface, message history, and AI responses

export default function InterviewPrep() {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <InterviewPrepSection isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </div>
  );
} 
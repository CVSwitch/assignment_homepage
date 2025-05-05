"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { ResumeSection } from "@/components/resume-optimizer/ResumeSection";

export default function ResumeOptimizer() {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <ResumeSection isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </div>
  );
} 
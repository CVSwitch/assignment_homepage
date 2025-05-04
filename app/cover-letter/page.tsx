"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import CoverLetterSection from "@/components/cover-letter/CoverLetterSection";

export default function CoverLetter() {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Cover letter section component that handles collapsible sections */}
      <CoverLetterSection isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </div>
  );
} 
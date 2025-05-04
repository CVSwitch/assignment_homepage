"use client";

import { useTheme } from "next-themes";
import CoverLetterSection from "@/components/cover-letter/CoverLetterSection";

export default function CoverLetter() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Cover letter section component that handles collapsible sections */}
      <CoverLetterSection />
    </div>
  );
} 
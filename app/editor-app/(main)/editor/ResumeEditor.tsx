"use client";

import AwardsForm from "./forms/AwardsForm";
import EducationForm from "./forms/EducationForm";
import InterestForm from "./forms/InterestForm";
import LanguagesForm from "./forms/LanguagesForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ReferenceForm from "./forms/ReferenceForm";
import { ResumeProvider, useResume } from "./forms/ResumeProvider";
import SkillsForm from "./forms/SkillsForm";
import VolunteerForm from "./forms/VolunteerForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import ProjectsForm from "./forms/ProjectsForm";
import ResumePreviewSection from "./ResumePreviewSection";
import { ResumeValues } from "@/lib/validation";
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";

// changed the resumeData value to ResumeValues
interface ResumeEditorProps {
  initialData?: ResumeValues;
  onSave: (resumeData: ResumeValues, template: string, pdfFile: File) => void;
  contentRef: React.RefObject<HTMLDivElement>;
}

export interface ResumeEditorRef {
  save: () => Promise<void>;
}

type TemplateType = "single" | "double" | "colored" | "singleColored";

// Internal component that has access to ResumeProvider context
/**
 * The `ResumeEditorInternal` component provides a user interface for editing and previewing a resume.
 * It includes forms for various sections of the resume, such as personal information, work experience,
 * education, projects, skills, and more. The component also allows users to preview the resume and save it as a PDF.
 *
 * @param {Object} props - The props for the component.
 * @param {(resumeData: ResumeValues, template: string, pdfFile: File) => void} props.onSave - Callback function triggered when the resume is saved. It receives the resume data, selected template, and generated PDF file as arguments.
 * @param {React.RefObject<HTMLDivElement>} props.contentRef - A reference to the HTML element containing the resume content for PDF generation.
 * @param {TemplateType} props.template - The currently selected resume template.
 * @param {(template: TemplateType) => void} props.setTemplate - Function to update the selected resume template.
 * @param {React.RefObject<{ save: () => Promise<void> }>} props.saveRef - A reference object exposing a `save` method to trigger the save functionality externally.
 *
 * @returns {JSX.Element} The rendered `ResumeEditorInternal` component.
 *
 * @remarks
 * - The `handleSave` function generates a PDF of the resume using the `html2pdf` library and invokes the `onSave` callback.
 * - The `save` method is exposed via the `saveRef` prop, allowing external components to trigger the save functionality.
 * - The component is structured with a two-column layout: one for forms and the other for the resume preview.
 */
function ResumeEditorInternal({
  onSave,
  contentRef,
  template,
  setTemplate,
  saveRef
}: {
  onSave: (resumeData: ResumeValues, template: string, pdfFile: File) => void;
  contentRef: React.RefObject<HTMLDivElement>;
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
  saveRef: React.RefObject<{ save: () => Promise<void> }>;
}) {
  const { resumeData } = useResume();

  const handleSave = React.useCallback(async () => {
    if (contentRef.current) {
      const options = {
        margin: 1,
        filename: "resume.pdf",
        html2canvas: { scale: 1 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      try {
        const pdfBlob = await html2pdf().set(options).from(contentRef.current).outputPdf("blob");
        const pdfFile = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });
        onSave(resumeData, template, pdfFile);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  }, [contentRef, onSave, resumeData, template]);

  // Expose save method through ref
  useEffect(() => {
    if (saveRef.current) {
      saveRef.current.save = handleSave;
    }
  }, [resumeData, template, handleSave, saveRef]);

  return (
    <div className="flex h-screen">
      <main className="flex grow">
        <div className="w-1/2 px-4 overflow-y-auto mt-16 pb-10 hidden-scrollbar">
          <PersonalInfoForm />
          <WorkExperienceForm />
          <EducationForm />
          <ProjectsForm />
          <SkillsForm />
          <LanguagesForm />
          <VolunteerForm />
          <InterestForm />
          <ReferenceForm />
          <AwardsForm />
        </div>
        <div className="grow border-r h-full" />
        <ResumePreviewSection 
          template={template} 
          setTemplate={setTemplate} 
          contentRef={contentRef as React.RefObject<HTMLDivElement>} 
        />
      </main>
    </div>
  );
}

const ResumeEditor = forwardRef<ResumeEditorRef, ResumeEditorProps>(
  ({ initialData, onSave, contentRef }, ref) => {
    const [template, setTemplate] = useState<TemplateType>("single");
    const internalSaveRef = useRef<{ save: () => Promise<void> }>({ save: async () => {} });

    // Forward the internal save method through the ref
    useImperativeHandle(ref, () => ({
      save: async () => {
        if (internalSaveRef.current) {
          await internalSaveRef.current.save();
        }
      }
    }));

    return (
      <ResumeProvider initialData={initialData}>
        <ResumeEditorInternal
          onSave={onSave}
          contentRef={contentRef}
          template={template}
          setTemplate={setTemplate}
          saveRef={internalSaveRef}
        />
      </ResumeProvider>
    );
  }
);

ResumeEditor.displayName = "ResumeEditor";

export default ResumeEditor;


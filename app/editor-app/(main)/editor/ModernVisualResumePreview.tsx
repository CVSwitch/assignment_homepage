import { cn } from "@/lib/utils";
import { memo, useMemo, useRef } from "react";
import { useResume } from "./forms/ResumeProvider";
import { Phone, Mail, Linkedin, Github, ExternalLink } from "lucide-react";
import { formatDate } from "date-fns/format";
import { ResumeValues } from "@/lib/validation";
import DOMPurify from "dompurify";
import useDimensions from "@/hooks/useDimensions";

interface ModernVisualResumePreviewProps {
    className?: string;
    contentRef?: React.Ref<HTMLDivElement>;
}

interface ResumeSectionProps {
    personalInfo?: ResumeValues["personalInfo"];
    workExperiences?: ResumeValues["workExperiences"];
    education?: ResumeValues["education"];
    projects?: ResumeValues["projects"];
    skills?: ResumeValues["skills"];
    languages?: ResumeValues["languages"];
    volunteer?: ResumeValues["volunteer"];
    interests?: ResumeValues["interests"];
    awards?: ResumeValues["awards"];
    references?: ResumeValues["references"];
}

export default function ModernVisualResumePreview({
    className,
    contentRef
}: ModernVisualResumePreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);
    const { resumeData } = useResume();

    const filteredData = useMemo(
        () => ({
            workExperiences: resumeData?.workExperiences?.filter((exp) =>
                Object.values(exp).some(Boolean)
            ) || [],
            education: resumeData?.education?.filter((edu) =>
                Object.values(edu).some(Boolean)
            ) || [],
            projects: resumeData?.projects?.filter((project) =>
                Object.values(project).some(Boolean)
            ) || [],
        }),
        [resumeData]
    );


    return (
        <div
            className={cn(
                "bg-white text-gray-800 h-fit w-full aspect-[210/297] font-sans shadow-lg",
                className
            )}
            ref={containerRef}
        >
            <div
                className={cn("p-8", !width && "invisible")}
                style={{ zoom: (1 / 794) * width }}
                ref={contentRef}
            >
                {/* Header with accent bar */}
                <div className="relative mb-8">
                    <div className="absolute left-0 top-0 h-full w-2 bg-indigo-600 rounded-r"></div>
                    <PersonalInfoHeader personalInfo={resumeData?.personalInfo} />
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left column - personal details */}
                    <div className="md:col-span-1 space-y-6">
                        {resumeData?.skills?.description && (
                            <SkillsSection skills={resumeData.skills} />
                        )}
                        {resumeData?.languages?.description && (
                            <LanguagesSection languages={resumeData.languages} />
                        )}
                        {resumeData?.interests?.description && (
                            <InterestsSection interests={resumeData.interests} />
                        )}
                        {resumeData?.references?.description && (
                            <ReferencesSection references={resumeData.references} />
                        )}
                    </div>

                    {/* Right column - professional details */}
                    <div className="md:col-span-2 space-y-8">
                        {filteredData.workExperiences.length > 0 && (
                            <WorkExperienceSection workExperiences={filteredData.workExperiences} />
                        )}
                        {filteredData.education.length > 0 && (
                            <EducationSection education={filteredData.education} />
                        )}
                        {filteredData.projects.length > 0 && (
                            <ProjectsSection projects={filteredData.projects} />
                        )}
                        {resumeData?.volunteer?.description && (
                            <VolunteerSection volunteer={resumeData.volunteer} />
                        )}
                        {resumeData?.awards?.description && (
                            <AwardsSection awards={resumeData.awards} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const PersonalInfoHeader = memo(({ personalInfo }: ResumeSectionProps) => {
    const { firstname, lastname, email, phone, socials, city, country, summary } =
        personalInfo || {};
    const { linkedin, github } = socials || {};

    return (
        <div className="pl-6 space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    <span className="text-indigo-600">{firstname}</span> {lastname}
                </h1>
                {(city || country) && (
                    <p className="text-gray-500 text-sm mt-1">
                        {city}
                        {city && country ? ", " : ""}
                        {country}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {phone && (
                    <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-indigo-600" />
                        <span>{phone}</span>
                    </p>
                )}
                {email && (
                    <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        <span>{email}</span>
                    </p>
                )}
                {linkedin && (
                    <p className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-indigo-600" />
                        <span>{linkedin}</span>
                    </p>
                )}
                {github && (
                    <p className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-indigo-600" />
                        <span>{github}</span>
                    </p>
                )}
            </div>

            {summary && (
                <div className="pt-4">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {summary}
                    </p>
                </div>
            )}
        </div>
    );
});

const WorkExperienceSection = memo(({ workExperiences }: ResumeSectionProps) => {
    if (!workExperiences?.length) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Work Experience
            </h2>

            {workExperiences.map((exp, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900">{exp.name}</h3>
                        {exp.startDate && (
                            <span className="text-sm text-indigo-600">
                                {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                                {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                            </span>
                        )}
                    </div>

                    {exp.position && (
                        <p className="text-sm font-medium text-indigo-600">{exp.position}</p>
                    )}

                    {(exp.city || exp.country) && (
                        <p className="text-xs text-gray-500">
                            {exp.city}
                            {exp.city && exp.country ? ", " : ""}
                            {exp.country}
                        </p>
                    )}

                    {exp.description && (
                        <div
                            className="mt-2 text-sm text-gray-700 pl-4 border-l-2 border-indigo-200"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exp.description) }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
});

const EducationSection = memo(({ education }: ResumeSectionProps) => {
    if (!education?.length) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Education
            </h2>

            {education.map((edu, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                        {edu.startDate && (
                            <span className="text-sm text-indigo-600">
                                {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                                {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
                            </span>
                        )}
                    </div>

                    {edu.studyType && (
                        <p className="text-sm font-medium text-indigo-600">{edu.studyType}</p>
                    )}

                    {edu.area && (
                        <p className="text-sm text-gray-700">{edu.area}</p>
                    )}

                    {edu.score && (
                        <p className="text-xs text-gray-500">GPA: {edu.score}</p>
                    )}

                    {edu.courses && (
                        <div
                            className="mt-2 text-sm text-gray-700 pl-4 border-l-2 border-indigo-200"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(edu.courses) }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
});

const ProjectsSection = memo(({ projects }: ResumeSectionProps) => {
    if (!projects?.length) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Projects
            </h2>

            {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        {project.startDate && (
                            <span className="text-sm text-indigo-600">
                                {formatDate(project.startDate, "MM/yyyy")} -{" "}
                                {project.endDate ? formatDate(project.endDate, "MM/yyyy") : "Present"}
                            </span>
                        )}
                    </div>

                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                        >
                            View Project <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    {project.description && (
                        <div
                            className="mt-2 text-sm text-gray-700 pl-4 border-l-2 border-indigo-200"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description) }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
});

const SkillsSection = memo(({ skills }: ResumeSectionProps) => {
    if (!skills?.description) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Skills
            </h2>
            <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(skills.description) }}
            />
        </div>
    );
});

const LanguagesSection = memo(({ languages }: ResumeSectionProps) => {
    if (!languages?.description) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Languages
            </h2>
            <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(languages.description) }}
            />
        </div>
    );
});

const VolunteerSection = memo(({ volunteer }: ResumeSectionProps) => {
    if (!volunteer?.description) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Volunteer Experience
            </h2>
            <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(volunteer.description) }}
            />
        </div>
    );
});

const InterestsSection = memo(({ interests }: ResumeSectionProps) => {
    if (!interests?.description) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Interests
            </h2>
            <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(interests.description) }}
            />
        </div>
    );
});

const AwardsSection = memo(({ awards }: ResumeSectionProps) => {
    if (!awards?.description) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                Awards
            </h2>
            <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(awards.description) }}
            />
        </div>
    );
});

const ReferencesSection = memo(({ references }: ResumeSectionProps) => {
    if (!references?.description) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2">
                References
            </h2>
            <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(references.description) }}
            />
        </div>
    );
});
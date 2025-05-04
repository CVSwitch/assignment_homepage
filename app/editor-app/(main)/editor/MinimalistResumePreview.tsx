import { cn } from "@/lib/utils";
import { memo, useMemo, useRef } from "react";
import { useResume } from "./forms/ResumeProvider";
import { Phone, Mail, Linkedin, Github, ExternalLink } from "lucide-react";
import { formatDate } from "date-fns/format";
import { ResumeValues } from "@/lib/validation";
import DOMPurify from "dompurify";
import useDimensions from "@/hooks/useDimensions";

interface MinimalistResumePreviewProps {
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

interface GenericSectionProps {
    title: string;
    data?: { description?: string; description_text?: string };
}

export default function MinimalistResumePreview({ className, contentRef }: MinimalistResumePreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);
    const { resumeData } = useResume();

    const filteredData = useMemo(
        () => ({
            workExperiences: resumeData?.workExperiences?.filter((exp) =>
                Object.values(exp).some(Boolean)
            ),
            education: resumeData?.education?.filter((edu) =>
                Object.values(edu).some(Boolean)
            ),
            projects: resumeData?.projects?.filter((project) =>
                Object.values(project).some(Boolean)
            ),
        }),
        [resumeData]
    );

    return (
        <div
            className={cn(
                "bg-white text-gray-800 h-fit w-full aspect-[210/297] font-sans",
                className
            )}
            ref={containerRef}
        >
            <div
                className={cn("p-8 space-y-8", !width && "invisible")}
                style={{ zoom: (1 / 794) * width }}
                ref={contentRef}
            >
                <PersonalInfoHeader personalInfo={resumeData?.personalInfo} />

                <div className="space-y-8">
                    {filteredData.workExperiences?.length ? (
                        <WorkExperienceSection workExperiences={filteredData.workExperiences} />
                    ) : null}

                    {filteredData.education?.length ? (
                        <EducationSection education={filteredData.education} />
                    ) : null}

                    {filteredData.projects?.length ? (
                        <ProjectsSection projects={filteredData.projects} />
                    ) : null}

                    {resumeData?.skills?.description ? (
                        <SkillsSection skills={resumeData.skills} />
                    ) : null}

                    {resumeData?.languages?.description ? (
                        <LanguagesSection languages={resumeData.languages} />
                    ) : null}

                    {resumeData?.volunteer?.description ? (
                        <VolunteerSection volunteer={resumeData.volunteer} />
                    ) : null}

                    {resumeData?.interests?.description ? (
                        <InterestsSection interests={resumeData.interests} />
                    ) : null}

                    {resumeData?.awards?.description ? (
                        <AwardsSection awards={resumeData.awards} />
                    ) : null}

                    {resumeData?.references?.description ? (
                        <ReferencesSection references={resumeData.references} />
                    ) : null}
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
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-light tracking-wide break-words">
                    {firstname} <span className="font-medium">{lastname}</span>
                </h1>
                {(city || country) && (
                    <p className="text-gray-500 text-sm mt-1 break-words">
                        {city}
                        {city && country ? ", " : ""}
                        {country}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
                {phone && (
                    <p className="flex items-center gap-2 break-all text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        {phone}
                    </p>
                )}
                {email && (
                    <p className="flex items-center gap-2 break-all text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        {email}
                    </p>
                )}
                {linkedin && (
                    <p className="flex items-center gap-2 break-all text-gray-600">
                        <Linkedin className="w-4 h-4 flex-shrink-0" />
                        {linkedin}
                    </p>
                )}
                {github && (
                    <p className="flex items-center gap-2 break-all text-gray-600">
                        <Github className="w-4 h-4 flex-shrink-0" />
                        {github}
                    </p>
                )}
            </div>

            {summary && (
                <div className="pt-2">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
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
            <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-1">
                Work Experience
            </h2>

            {workExperiences.map((exp, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">{exp.name}</h3>
                        {exp.startDate && (
                            <span className="text-sm text-gray-500">
                                {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                                {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                            </span>
                        )}
                    </div>

                    {exp.position && (
                        <p className="text-sm italic text-gray-600">{exp.position}</p>
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
                            className="mt-1 text-sm text-gray-700"
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
        <div className="space-y-4">
            <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-1">
                Education
            </h2>

            {education.map((edu, index) => (
                <div key={index} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">{edu.institution}</h3>
                        {edu.startDate && (
                            <span className="text-sm text-gray-500">
                                {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                                {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
                            </span>
                        )}
                    </div>

                    {edu.studyType && <p className="text-sm text-gray-600">{edu.studyType}</p>}
                    {edu.area && <p className="text-sm text-gray-600">{edu.area}</p>}
                    {edu.score && <p className="text-xs text-gray-500">Score: {edu.score}</p>}

                    {edu.courses && (
                        <div
                            className="mt-1 text-sm text-gray-700"
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
        <div className="space-y-4">
            <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-1">
                Projects
            </h2>

            {projects.map((project, index) => (
                <div key={index} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">{project.title}</h3>
                        {project.startDate && (
                            <span className="text-sm text-gray-500">
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
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                            View Project <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    {project.description && (
                        <div
                            className="mt-1 text-sm text-gray-700"
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
            <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-1">
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
    return <GenericSection title="Languages" data={languages} />;
});

const VolunteerSection = memo(({ volunteer }: ResumeSectionProps) => {
    return <GenericSection title="Volunteer Experience" data={volunteer} />;
});

const InterestsSection = memo(({ interests }: ResumeSectionProps) => {
    return <GenericSection title="Interests" data={interests} />;
});

const AwardsSection = memo(({ awards }: ResumeSectionProps) => {
    return <GenericSection title="Awards" data={awards} />;
});

const ReferencesSection = memo(({ references }: ResumeSectionProps) => {
    return <GenericSection title="References" data={references} />;
});

const GenericSection = memo(({ title, data }: GenericSectionProps) => {
    if (!data || !data.description || data.description === "<p></p>") return null;
    const sanitizedHTML = DOMPurify.sanitize(data.description);

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-1">
                {title}
            </h2>
            <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            />
        </div>
    );
});
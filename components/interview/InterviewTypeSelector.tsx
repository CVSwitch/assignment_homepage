import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { InterviewType } from '@/app/interview/page';

const interviewTypes = {
  behavioral: {
    name: "Behavioral Interviews",
    description: "STAR method questions about past experiences",
  },
  technical: {
    name: "Technical Interviews",
    description: "Coding and system design questions",
  },
  "case-study": {
    name: "Case Studies",
    description: "Business and problem-solving scenarios",
  },
  hr: {
    name: "HR Questions",
    description: "Common HR and career questions",
  },
  
};

interface Props {
  selected: InterviewType;
  onSelect: (type: InterviewType) => void;
  onResumeUpload?: (file: File) => void;
}

export function InterviewTypeSelector({ selected, onSelect, onResumeUpload }: Props) {
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onResumeUpload) {
      onResumeUpload(file);
      onSelect('resume-based');
    }
  };

  return (
    <Menu as="div" className="relative z-50">
      <Menu.Button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-blue-200 transition-colors">
        {interviewTypes[selected].name}
        <ChevronDownIcon className="w-5 h-5" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 w-72 rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          {Object.entries(interviewTypes).map(([key, { name, description }]) => (
            <Menu.Item key={key}>
              {({ active }) => (
                key === 'resume-based' ? (
                  <label
                    className={`w-full text-left px-4 py-3 cursor-pointer ${
                      active ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <DocumentArrowUpIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-gray-500">{description}</div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleResumeUpload}
                    />
                  </label>
                ) : (
                  <button
                    className={`w-full text-left px-4 py-3 ${
                      active ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => onSelect(key as InterviewType)}
                  >
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{description}</div>
                  </button>
                )
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 
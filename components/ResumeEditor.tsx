import React, { useState } from 'react';
import { ResumeData } from '../types';
import { ChevronDown } from 'lucide-react';
import { ProfileSection } from './ProfileSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { MentorshipSection } from './MentorshipSection';
import { OtherSection } from './OtherSection';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('profile');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({
      ...data,
      profile: { ...data.profile, [e.target.name]: e.target.value }
    });
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Profile Section */}
      <Section 
        title="Personal Information" 
        isOpen={activeSection === 'profile'} 
        onToggle={() => toggleSection('profile')}
      >
        <ProfileSection profile={data.profile} onChange={handleProfileChange} />
      </Section>

      {/* Experience Section */}
      <Section 
        title="Work Experience" 
        isOpen={activeSection === 'experience'} 
        onToggle={() => toggleSection('experience')}
      >
        <ExperienceSection 
          experience={data.experience} 
          onChange={(experience) => onChange({ ...data, experience })}
        />
      </Section>

      {/* Education Section */}
      <Section 
        title="Education" 
        isOpen={activeSection === 'education'} 
        onToggle={() => toggleSection('education')}
      >
        <EducationSection 
          education={data.education} 
          onChange={(education) => onChange({ ...data, education })}
        />
      </Section>

      {/* Skills Section */}
      <Section 
        title="Skills" 
        isOpen={activeSection === 'skills'} 
        onToggle={() => toggleSection('skills')}
      >
        <SkillsSection 
          skills={data.skills} 
          onChange={(skills) => onChange({ ...data, skills })}
        />
      </Section>

      {/* Mentorship Section */}
      <Section 
        title="Mentorship" 
        isOpen={activeSection === 'mentorship'} 
        onToggle={() => toggleSection('mentorship')}
      >
        <MentorshipSection 
          mentorship={data.mentorship} 
          onChange={(mentorship) => onChange({ ...data, mentorship })}
        />
      </Section>

      {/* Other Items Section */}
      <Section 
        title="Other" 
        isOpen={activeSection === 'others'} 
        onToggle={() => toggleSection('others')}
      >
        <OtherSection 
          others={data.others} 
          onChange={(others) => onChange({ ...data, others })}
        />
      </Section>
    </div>
  );
};

// Reusable Section Component

const Section: React.FC<{ title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, isOpen, onToggle, children }) => (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors"
        >
          <span className="font-semibold text-slate-800 text-base">{title}</span>
          <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={20} />
          </div>
        </button>
        {isOpen && (
            <div className="p-5 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
);
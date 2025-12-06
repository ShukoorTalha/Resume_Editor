import React, { useState } from 'react';
import { ResumeData, Experience, Education } from '../types';
import { Plus, Trash2, ChevronDown, GripVertical } from 'lucide-react';

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

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, { id: Date.now().toString(), school: '', degree: '', field: '', graduationDate: '' }]
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  const updateSkill = (id: string, name: string) => {
      onChange({
          ...data,
          skills: data.skills.map(s => s.id === id ? {...s, name} : s)
      });
  };

  const addSkill = () => {
      onChange({
          ...data,
          skills: [...data.skills, { id: Date.now().toString(), name: '', level: 'Intermediate'}]
      })
  }
  
  const removeSkill = (id: string) => {
      onChange({...data, skills: data.skills.filter(s => s.id !== id)});
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Profile Section */}
      <Section 
        title="Personal Information" 
        isOpen={activeSection === 'profile'} 
        onToggle={() => toggleSection('profile')}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Full Name" name="fullName" placeholder="e.g. Jane Doe" value={data.profile.fullName} onChange={handleProfileChange} />
            <Input label="Job Title" name="title" placeholder="e.g. Senior Product Designer" value={data.profile.title} onChange={handleProfileChange} />
            <Input label="Email" name="email" placeholder="e.g. jane@example.com" value={data.profile.email} onChange={handleProfileChange} />
            <Input label="Phone" name="phone" placeholder="e.g. (555) 123-4567" value={data.profile.phone} onChange={handleProfileChange} />
            <Input label="Location" name="location" placeholder="e.g. San Francisco, CA" value={data.profile.location} onChange={handleProfileChange} />
            <Input label="LinkedIn" name="linkedin" placeholder="linkedin.com/in/jane" value={data.profile.linkedin} onChange={handleProfileChange} />
            <Input label="Website" name="website" placeholder="janedoe.com" value={data.profile.website} onChange={handleProfileChange} />
          </div>
          
          <div>
            <div className="mb-2 ml-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Professional Summary</label>
            </div>
            <textarea 
              name="summary"
              rows={4}
              value={data.profile.summary}
              onChange={handleProfileChange}
              className="w-full rounded-lg bg-slate-100 border-2 border-transparent px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none placeholder:text-slate-400"
              placeholder="Briefly describe your professional background..."
            />
          </div>
        </div>
      </Section>

      {/* Experience Section */}
      <Section 
        title="Work Experience" 
        isOpen={activeSection === 'experience'} 
        onToggle={() => toggleSection('experience')}
      >
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => removeExperience(exp.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove Position"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <Input label="Company" value={exp.company} placeholder="e.g. Google" onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                <Input label="Position" value={exp.position} placeholder="e.g. Product Manager" onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
                <Input label="Start Date" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                <div className="flex flex-col">
                    <Input 
                        label="End Date" 
                        type="month" 
                        value={exp.endDate} 
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} 
                        disabled={exp.current}
                        className={exp.current ? 'opacity-50 cursor-not-allowed' : ''}
                    />
                    <div className="mt-2 ml-1">
                        <label className="inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            />
                            <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ms-2 text-xs font-medium text-slate-600">I currently work here</span>
                        </label>
                    </div>
                </div>
              </div>
              
              <div>
                <div className="mb-2 ml-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Achievements</label>
                </div>
                <textarea 
                  rows={4}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="w-full rounded-lg bg-slate-100 border-2 border-transparent px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none placeholder:text-slate-400"
                  placeholder="• Led a team of 5..."
                />
              </div>
            </div>
          ))}
          
          <button 
            onClick={addExperience}
            className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm"
          >
            <Plus size={18} /> Add Position
          </button>
        </div>
      </Section>

      {/* Education Section */}
      <Section 
        title="Education" 
        isOpen={activeSection === 'education'} 
        onToggle={() => toggleSection('education')}
      >
        <div className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => removeEducation(edu.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove Education"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="School / University" value={edu.school} placeholder="e.g. Stanford University" onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} />
                <Input label="Degree" value={edu.degree} placeholder="e.g. Bachelor of Science" onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                <Input label="Field of Study" value={edu.field} placeholder="e.g. Computer Science" onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} />
                <Input label="Graduation Date" type="month" value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} />
              </div>
            </div>
          ))}
          <button 
            onClick={addEducation}
            className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm"
          >
            <Plus size={18} /> Add Education
          </button>
        </div>
      </Section>

       {/* Skills Section */}
       <Section 
        title="Skills" 
        isOpen={activeSection === 'skills'} 
        onToggle={() => toggleSection('skills')}
      >
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {data.skills.map((skill) => (
                     <div key={skill.id} className="group flex items-center bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 rounded-lg px-3 py-2 border border-transparent focus-within:border-primary/50 transition-all">
                         <div className="mr-2 text-slate-400">
                            <GripVertical size={14} />
                         </div>
                         <input 
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full text-slate-700 placeholder:text-slate-400 outline-none"
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, e.target.value)}
                            placeholder="e.g. React"
                         />
                         <button 
                            onClick={() => removeSkill(skill.id)} 
                            className="text-slate-300 hover:text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                             <Trash2 size={14} />
                         </button>
                     </div>
                 ))}
                 <button 
                    onClick={addSkill}
                    className="flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                >
                    <Plus size={14} /> Add Skill
                </button>
             </div>
        </div>
      </Section>
    </div>
  );
};

// Reusable Components

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

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="group">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative">
      <input 
        {...props}
        className={`
          w-full rounded-lg bg-slate-100 border-2 border-transparent px-4 py-2.5 text-sm text-slate-900 
          placeholder:text-slate-400
          focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 
          hover:bg-slate-50
          transition-all duration-200 outline-none
          ${className}
        `}
      />
    </div>
  </div>
);
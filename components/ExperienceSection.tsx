import React from 'react';
import { Experience } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface ExperienceSectionProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className, ...props }) => (
  <div className="group">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
      {label}
    </label>
    <input 
      {...props}
      className={`
        w-full rounded-lg bg-slate-100 border-2 border-transparent px-4 py-2.5 text-sm text-slate-900 
        placeholder:text-slate-400
        focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 
        hover:bg-slate-50
        transition-all duration-200 outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    />
  </div>
);

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, onChange }) => {
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    );
  };

  const addExperience = () => {
    onChange([
      {
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        location: '',
        current: false,
        description: ''
      },
      ...experience
    ]);
  };

  const removeExperience = (id: string) => {
    onChange(experience.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {experience.map((exp) => (
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
            <Input label="Location" value={exp.location} placeholder="e.g. San Francisco, CA" onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} />
            <Input label="Start Date" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
            <div className="flex flex-col">
              <Input 
                label="End Date" 
                type="month" 
                value={exp.endDate} 
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} 
                disabled={exp.current}
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
  );
};

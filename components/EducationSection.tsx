import React from 'react';
import { Education } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
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
        ${className}
      `}
    />
  </div>
);

export const EducationSection: React.FC<EducationSectionProps> = ({ education, onChange }) => {
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(
      education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    );
  };

  const addEducation = () => {
    onChange([
      ...education,
      {
        id: Date.now().toString(),
        school: '',
        degree: '',
        field: '',
        graduationDate: ''
      }
    ]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {education.map((edu) => (
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
  );
};

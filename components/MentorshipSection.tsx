import React from 'react';
import { Mentorship } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface MentorshipSectionProps {
  mentorship: Mentorship[];
  onChange: (mentorship: Mentorship[]) => void;
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

export const MentorshipSection: React.FC<MentorshipSectionProps> = ({ mentorship, onChange }) => {
  const updateMentorship = (id: string, field: keyof Mentorship, value: any) => {
    onChange(
      mentorship.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const addMentorship = () => {
    onChange([
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        link: ''
      },
      ...mentorship
    ]);
  };

  const removeMentorship = (id: string) => {
    onChange(mentorship.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {mentorship.map((item) => (
        <div key={item.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative group">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => removeMentorship(item.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Remove Mentorship"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <Input label="Title" value={item.title} placeholder="e.g. Junior Developer Mentor" onChange={(e) => updateMentorship(item.id, 'title', e.target.value)} />
            <Input label="Link" value={item.link || ''} placeholder="e.g. https://..." onChange={(e) => updateMentorship(item.id, 'link', e.target.value)} />
          </div>
          
          <div>
            <div className="mb-2 ml-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
            </div>
            <textarea 
              rows={3}
              value={item.description}
              onChange={(e) => updateMentorship(item.id, 'description', e.target.value)}
              className="w-full rounded-lg bg-slate-100 border-2 border-transparent px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none placeholder:text-slate-400"
              placeholder="Describe your mentorship experience..."
            />
          </div>
        </div>
      ))}
      
      <button 
        onClick={addMentorship}
        className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm"
      >
        <Plus size={18} /> Add Mentorship
      </button>
    </div>
  );
};

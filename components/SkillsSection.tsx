import React from 'react';
import { Skill } from '../types';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onChange }) => {
  const updateSkill = (id: string, name: string) => {
    onChange(
      skills.map(s => s.id === id ? { ...s, name } : s)
    );
  };

  const updateCategory = (id: string, category: string) => {
    onChange(
      skills.map(s => s.id === id ? { ...s, category } : s)
    );
  };

  const updateSkillLevel = (id: string, level: 'Beginner' | 'Intermediate' | 'Expert') => {
    onChange(
      skills.map(s => s.id === id ? { ...s, level } : s)
    );
  };

  const addSkill = () => {
    onChange([
      ...skills,
      {
        id: Date.now().toString(),
        name: '',
        level: 'Intermediate',
        category: ''
      }
    ]);
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="group flex flex-col bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 rounded-lg px-3 py-2 border border-transparent focus-within:border-primary/50 transition-all">
            <div className="flex items-center mb-2">
              <div className="text-slate-400 mr-2">
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
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <input
                className="bg-transparent border border-slate-200 rounded-md px-2 py-1 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none placeholder:text-slate-400"
                value={skill.category || ''}
                onChange={(e) => updateCategory(skill.id, e.target.value)}
                placeholder="Category (e.g. Cloud)"
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkillLevel(skill.id, e.target.value as 'Beginner' | 'Intermediate' | 'Expert')}
                className="bg-transparent border border-slate-200 rounded-md px-2 py-1 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
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
  );
};

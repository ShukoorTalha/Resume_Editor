import React from 'react';
import { Profile } from '../types';

interface ProfileSectionProps {
  profile: Profile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className, ...props }) => (
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

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Full Name" name="fullName" placeholder="e.g. Jane Doe" value={profile.fullName} onChange={onChange} />
        <Input label="Job Title" name="title" placeholder="e.g. Senior Product Designer" value={profile.title} onChange={onChange} />
        <Input label="Email" name="email" placeholder="e.g. jane@example.com" value={profile.email} onChange={onChange} />
        <Input label="Phone" name="phone" placeholder="e.g. (555) 123-4567" value={profile.phone} onChange={onChange} />
        <Input label="Location" name="location" placeholder="e.g. San Francisco, CA" value={profile.location} onChange={onChange} />
        <Input label="LinkedIn" name="linkedin" placeholder="linkedin.com/in/jane" value={profile.linkedin} onChange={onChange} />
        <Input label="GitHub" name="github" placeholder="github.com/jane" value={profile.github || ''} onChange={onChange} />
        <Input label="Website" name="website" placeholder="janedoe.com" value={profile.website} onChange={onChange} />
      </div>
      
      <div>
        <div className="mb-2 ml-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Professional Summary</label>
        </div>
        <textarea 
          name="summary"
          rows={4}
          value={profile.summary}
          onChange={onChange}
          className="w-full rounded-lg bg-slate-100 border-2 border-transparent px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none placeholder:text-slate-400"
          placeholder="Briefly describe your professional background..."
        />
      </div>
    </div>
  );
};

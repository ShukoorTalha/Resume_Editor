import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { profile, experience, education, skills } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01'); // Append day to make it valid
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] mx-auto">
      <div id="resume-preview" className="w-full h-full p-[10mm] md:p-[15mm] text-slate-800 bg-white">
        {/* Header */}
        <header className="border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900 mb-2">{profile.fullName}</h1>
          <p className="text-xl text-slate-600 font-medium mb-4">{profile.title}</p>
          
          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600">
            {profile.email && (
              <div className="flex items-center gap-1.5">
                <Mail size={14} />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={14} />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin size={14} />
                <span className="truncate max-w-[150px]">{profile.linkedin.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
             {profile.website && (
              <div className="flex items-center gap-1.5">
                <Globe size={14} />
                <span className="truncate max-w-[150px]">{profile.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {profile.summary && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-slate-700">{profile.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-slate-700 font-medium text-sm mb-2">{exp.company}</div>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900">{edu.school}</h3>
                    <span className="text-sm text-slate-500 font-medium">{formatDate(edu.graduationDate)}</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
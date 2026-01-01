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

  const bulletLines = (text: string) =>
    text
      .split(/\n+/)
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);

  const groupedSkills = skills.reduce<Record<string, string[]>>((acc, skill) => {
    const key = skill.category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill.name);
    return acc;
  }, {});

  const sortedSkillGroups = Object.entries(groupedSkills).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="resume-page shadow-2xl print:shadow-none" id="resume-preview">
      {/* Header */}
      <header className="resume-header">
        <h1 className="resume-name">{profile.fullName}</h1>
        <p className="resume-title">{profile.title}</p>
        <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-[10pt]">
          {profile.email && (
            <span className="flex items-center gap-1"><Mail size={12} />{profile.email}</span>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1"><Phone size={12} />{profile.phone}</span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1"><MapPin size={12} />{profile.location}</span>
          )}
          {profile.linkedin && (
            <span className="flex items-center gap-1"><Linkedin size={12} />{profile.linkedin.replace(/^https?:\/\//, '')}</span>
          )}
          {profile.website && (
            <span className="flex items-center gap-1"><Globe size={12} />{profile.website.replace(/^https?:\/\//, '')}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section style={{ marginBottom: '18px' }}>
          <div className="section-title">Professional Summary</div>
          <p style={{ lineHeight: 1.45 }}>{profile.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <div className="section-title">Experience</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {experience.map((exp) => {
              const bullets = bulletLines(exp.description);
              return (
                <div key={exp.id}>
                  <div className="entry-head">
                    <span className="entry-role">{exp.position} | {exp.company}</span>
                    <span className="entry-meta">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="compact-list">
                      {bullets.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <div className="section-title">Education</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="entry-head">
                  <span className="entry-role">{edu.degree}{edu.field ? ` | ${edu.field}` : ''} | {edu.school}</span>
                  <span className="entry-meta">{formatDate(edu.graduationDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <div className="section-title">Skills</div>
          <div className="skills-grid">
            {sortedSkillGroups.map(([category, names]) => (
              <div className="skills-row" key={category}>
                <span className="category">{category}:</span>
                <span className="items">{names.join(' | ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
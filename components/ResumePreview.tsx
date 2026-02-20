import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, Linkedin, Globe } from 'lucide-react';

export const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { profile, experience, education, skills, projects, mentorship, others } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01'); // Append day to make it valid
    return date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
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

  const languageSkills = groupedSkills['Languages'] || [];
  const otherSkills = skills.filter(s => s.category !== 'Languages').map(s => s.name);

  // Styles based on user request
  const styles = {
    page: {
      width: '8.5in',
      minHeight: '11in',
      padding: '0.5in',
      backgroundColor: '#FFFFFF',
      fontFamily: "'Lato', sans-serif",
      color: '#1A1A1A',
      fontSize: '10pt',
      lineHeight: '1.1',
    },
    nameHeader: {
      textAlign: 'center' as const,
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '38pt',
      fontWeight: 400,
      color: '#1A1A1A',
      letterSpacing: '0.05em',
      marginBottom: '4px',
      textTransform: 'uppercase' as const,
    },
    contactBar: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '9pt',
      marginBottom: '10px',
    },
    sectionHeader: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '11pt',
      fontWeight: 700,
      color: '#2E6DA4',
      textTransform: 'uppercase' as const,
      marginBottom: '0px',
      marginTop: '12px',
      display: 'flex',
      alignItems: 'center',
    },
    divider: {
      height: '1px', // Approximate 0.5pt
      backgroundColor: '#AAAAAA',
      width: '100%',
      border: 'none',
      margin: '0 0 6px 0',
    },
    link: {
      color: '#2E6DA4',
      textDecoration: 'none',
      borderBottom: '1px solid #2E6DA4', // underlined style
    },
    icon: {
      width: '12px',
      height: '12px',
      color: '#2E6DA4',
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: '4px',
    },
    separator: {
      color: '#AAAAAA',
      margin: '0 4px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '2px',
    },
    jobTitle: {
      fontWeight: 700,
      fontSize: '10.5pt',
    },
    companyName: {
        fontWeight: 700,
        color: '#2E6DA4',
        textDecoration: 'none',
        borderBottom: '1px solid #2E6DA4',
    },
    location: {
        fontStyle: 'italic',
    },
    dateRange: {
        textAlign: 'right' as const,
        fontSize: '10pt',
        marginLeft: 'auto',
    },
    bulletList: {
        listStyleType: 'disc',
        paddingLeft: '0.25in',
        margin: '2px 0 6px 0',
    },
    bulletItem: {
        marginBottom: '1px',
    }
  };

  const Separator = () => <span style={styles.separator}>|</span>;

  return (
    <div className="resume-page shadow-2xl print:shadow-none" style={styles.page} id="resume-preview">
      {/* Header */}
      <header>
        <div style={styles.nameHeader}>{profile.fullName}</div>
        <div style={styles.contactBar}>
            {profile.linkedin && (
                <>
                    <span>
                        <Linkedin style={styles.icon} />
                        <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} style={styles.link}>
                            LinkedIn
                        </a>
                    </span>
                    <Separator />
                </>
            )}
            {profile.phone && (
                <>
                    <span>
                        <Phone style={styles.icon} />
                        <a href={`tel:${profile.phone}`} style={styles.link}>{profile.phone}</a>
                    </span>
                    <Separator />
                </>
            )}
             {profile.website && (
                <>
                    <span>
                        <Globe style={styles.icon} />
                        <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} style={styles.link}>
                            {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                    </span>
                    <Separator />
                </>
            )}
            {profile.email && (
                <>
                    <span>
                        <Mail style={styles.icon} />
                        <a href={`mailto:${profile.email}`} style={styles.link}>{profile.email}</a>
                    </span>
                </>
             )}
        </div>
      </header>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>SKILLS</div>
          <hr style={styles.divider} />
          <p style={{ ...styles.bulletItem, marginBottom: '6px' }}>
             {otherSkills.join(' | ')} {otherSkills.length > 0 ? '|' : ''}
          </p>
          {languageSkills.length > 0 && (
            <p style={{ ...styles.bulletItem, fontStyle: 'italic' }}>
              Languages: {languageSkills.join(' | ')} |
            </p>
          )}
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>EXPERIENCE</div>
           <hr style={styles.divider} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {experience.map((exp) => {
              const bullets = bulletLines(exp.description);
              return (
                <div key={exp.id}>
                  <div style={styles.row}>
                    <span>
                        <span style={styles.jobTitle}>{exp.position}</span>
                        <span style={{ margin: '0 8px' }}>&nbsp;</span>
                        <span style={styles.companyName}>{exp.company}</span>
                        <span style={{ margin: '0 8px' }}>&nbsp;</span>
                        <span style={styles.location}>{exp.location}</span>
                    </span>
                    <span style={styles.dateRange}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  {bullets.length > 0 && (
                    <ul style={styles.bulletList}>
                      {bullets.map((line, idx) => (
                        <li key={idx} style={styles.bulletItem} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>EDUCATION</div>
           <hr style={styles.divider} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={styles.row}>
                  <span>
                       <span style={styles.jobTitle}>{edu.degree}</span>
                       <span style={{ margin: '0 8px' }}>&nbsp;</span>
                       <span style={styles.companyName}>{edu.school}</span>
                       <span style={{ margin: '0 8px' }}>&nbsp;</span>
                       <span style={styles.location}>{edu.location}</span>
                  </span>
                  <span style={styles.dateRange}>{formatDate(edu.graduationDate)}</span>
                </div>
                <ul style={styles.bulletList}>
                    {edu.field && <li style={styles.bulletItem}>Major in {edu.field}</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>PROJECTS</div>
           <hr style={styles.divider} />
           <ul style={styles.bulletList}>
            {projects.map((proj) => (
                <li key={proj.id} style={styles.bulletItem}>
                    <strong>{proj.title}</strong>: {proj.description} 
                    {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={{...styles.link, marginLeft: '5px'}}>Link</a>}
                </li>
            ))}
           </ul>
        </section>
      )}

      {/* MENTORSHIP */}
      {mentorship && mentorship.length > 0 && (
        <section>
           <div style={styles.sectionHeader}>MENTORSHIP</div>
           <hr style={styles.divider} />
           <ul style={styles.bulletList}>
            {mentorship.map((ment) => (
                <li key={ment.id} style={styles.bulletItem}>
                    <strong>{ment.title}</strong>: {ment.description}
                </li>
            ))}
           </ul>
        </section>
      )}
      
       {/* OTHERS */}
       {others && others.length > 0 && (
        <section>
           <div style={styles.sectionHeader}>OTHERS</div>
           <hr style={styles.divider} />
           <ul style={styles.bulletList}>
            {others.map((oth) => (
                <li key={oth.id} style={styles.bulletItem}>
                    <strong>{oth.title}</strong>: {oth.description}
                </li>
            ))}
           </ul>
        </section>
      )}

    </div>
  );
};
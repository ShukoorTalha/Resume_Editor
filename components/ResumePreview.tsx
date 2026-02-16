import React, { useMemo } from "react";
import { ResumeData } from "../types";
import { Mail, Phone, Linkedin, Globe, Github } from "lucide-react";

// --- Types ---
interface ContactItem {
  id: string;
  element: React.ReactNode;
}

// --- Styles ---
// Moved outside component to prevent recreation on every render
const styles = {
  page: {
    width: "8.5in",
    minHeight: "11in",
    padding: "0.5in",
    backgroundColor: "#FFFFFF",
    fontFamily: "'Lato', sans-serif",
    color: "#1A1A1A",
    fontSize: "10pt",
    lineHeight: "1.3",
    boxSizing: "border-box" as const,
  },
  nameHeader: {
    textAlign: "center" as const,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "38pt",
    fontWeight: "400",
    color: "#1A1A1A",
    letterSpacing: "0.05em",
    marginBottom: "8px",
    lineHeight: "1",
    textTransform: "uppercase" as const,
  },
  contactBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "9pt",
    marginBottom: "16px",
    flexWrap: "wrap" as const,
  },
  sectionHeader: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "11pt",
    fontWeight: "700",
    color: "#255784",
    textTransform: "uppercase" as const,
    marginBottom: "0px",
    marginTop: "12px",
    lineHeight: "1.2",
    display: "flex",
    alignItems: "center",
  },
  divider: {
    height: "1px",
    borderBottom: "0.5px solid #AAAAAA",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    margin: "0 0 6px 0",
    width: "100%",
    display: "block",
  },
  link: {
    color: "#255784",
    textDecoration: "none",
    borderBottom: "1px solid #255784",
    cursor: "pointer",
  },
  icon: {
    width: "12px",
    height: "12px",
    color: "#255784",
    display: "inline-block",
    marginRight: "5px",
    position: "relative" as const,
    top: "-1px",
  },
  separator: {
    color: "#AAAAAA",
    margin: "0 2px",
    userSelect: "none" as const,
  },
  expRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "2px",
    width: "100%",
  },
  leftContent: {
    display: "flex",
    alignItems: "baseline",
    gap: "24px",
    flexWrap: "wrap" as const,
  },
  jobTitle: {
    fontWeight: "700",
    fontSize: "10.5pt",
    color: "#1A1A1A",
  },
  companyName: {
    fontWeight: "700",
    color: "#255784",
    textDecoration: "none",
    borderBottom: "1px solid #255784",
  },
  location: {
    fontStyle: "italic",
    color: "#1A1A1A",
  },
  dateRange: {
    fontSize: "10pt",
    color: "#1A1A1A",
    whiteSpace: "nowrap" as const,
  },
  bulletList: {
    listStyleType: "disc",
    paddingLeft: "0.25in",
    margin: "2px 0 4px 0",
  },
  bulletItem: {
    marginBottom: "1px",
  },
};

// --- Helpers ---

// Improved Date Formatting: Handles YYYY-MM correctly without timezone shifting
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length < 2) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    // Month is 0-indexed in Date constructor, but we want 1-based display
    const date = new Date(year, month - 1, 1);

    // Check for invalid date
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

const bulletLines = (text: string): string[] =>
  text
    .split(/\n+/)
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

const highlightText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
};

// --- Components ---

const Separator = () => <span style={styles.separator}>|</span>;

export const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => {
  // Destructure with default empty values for safety
  const {
    profile = {} as any,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    mentorship = [],
    others = [],
  } = data || {};

  // Memoize contact items to avoid unnecessary re-creation
  const contactItems: ContactItem[] = useMemo(() => {
    const items = [
      profile.linkedin && {
        id: "linkedin",
        element: (
          <a
            href={
              profile.linkedin.startsWith("http")
                ? profile.linkedin
                : `https://${profile.linkedin}`
            }
            style={{ ...styles.link, display: "flex", alignItems: "center", borderBottom: "none" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={12} style={styles.icon} strokeWidth={2} aria-hidden="true" />
            <span style={{ borderBottom: "1px solid #255784" }}>
              {profile.linkedin
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .replace(/^linkedin\.com\/in\//, "")
                .replace(/\/$/, "")}
            </span>
          </a>
        ),
      },
      profile.phone && {
        id: "phone",
        element: (
          <a
            href={`tel:${profile.phone}`}
            style={{ ...styles.link, display: "flex", alignItems: "center", borderBottom: "none" }}
            aria-label={`Call ${profile.phone}`}
          >
            <Phone size={12} style={styles.icon} strokeWidth={2} aria-hidden="true" />
            <span style={{ borderBottom: "1px solid #255784" }}>{profile.phone}</span>
          </a>
        ),
      },
      profile.website && {
        id: "website",
        element: (
          <a
            href={
              profile.website.startsWith("http")
                ? profile.website
                : `https://${profile.website}`
            }
            style={{ ...styles.link, display: "flex", alignItems: "center", borderBottom: "none" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Personal Website"
          >
            <Globe size={12} style={styles.icon} strokeWidth={2} aria-hidden="true" />
            <span style={{ borderBottom: "1px solid #255784" }}>
              {profile.website.replace(/^https?:\/\//, "")}
            </span>
          </a>
        ),
      },
      profile.email && {
        id: "email",
        element: (
          <a
            href={`mailto:${profile.email}`}
            style={{ ...styles.link, display: "flex", alignItems: "center", borderBottom: "none" }}
            aria-label={`Email ${profile.email}`}
          >
            <Mail size={12} style={styles.icon} strokeWidth={2} aria-hidden="true" />
            <span style={{ borderBottom: "1px solid #255784" }}>{profile.email}</span>
          </a>
        ),
      },
      profile.github && {
        id: "github",
        element: (
          <a
            href={
              profile.github.startsWith("http")
                ? profile.github
                : `https://${profile.github}`
            }
            style={{ ...styles.link, display: "flex", alignItems: "center", borderBottom: "none" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <Github size={12} style={styles.icon} strokeWidth={2} aria-hidden="true" />
            <span style={{ borderBottom: "1px solid #255784" }}>
              {profile.github
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .replace(/^github\.com\//, "")
                .replace(/\/$/, "")}
            </span>
          </a>
        ),
      },
    ];
    return items.filter(Boolean) as ContactItem[];
  }, [profile]);

  // Group skills logic - Memoized
  const { groupedSkills, skillCategories, languageSkills } = useMemo(() => {
    const grouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
      const key = skill.category || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(skill.name);
      return acc;
    }, {});

    const langs = grouped["Languages"] || [];
    if (Object.prototype.hasOwnProperty.call(grouped, "Languages")) {
        delete grouped["Languages"];
    }
    const cats = Object.keys(grouped);
    
    return { groupedSkills: grouped, skillCategories: cats, languageSkills: langs };
  }, [skills]);

  return (
    <div
      className="resume-page shadow-2xl print:shadow-none"
      style={styles.page}
      id="resume-preview"
    >
      {/* Name Header */}
      <div style={styles.nameHeader}>{profile.fullName}</div>

      {/* Contact Bar */}
      <div style={styles.contactBar}>
        {contactItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.element}
            {index < contactItems.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>
            SKILLS
            <div style={{ flex: 1, borderBottom: "0.5px solid #AAAAAA", marginLeft: "8px" }} />
          </div>
          <ul style={{ ...styles.bulletList, marginTop: "4px", marginBottom: "4px" }}>
            {skillCategories.map((cat) => (
              <li key={cat} style={styles.bulletItem}>
                {cat !== "Other" && (
                    <span style={{ fontWeight: "700" }}>{cat}: </span>
                )}
                <span>{groupedSkills[cat].join(" | ")}</span>
              </li>
            ))}
            {languageSkills.length > 0 && (
              <li style={styles.bulletItem}>
                <span style={{ fontWeight: "700" }}>Languages: </span>
                <span style={{ fontStyle: "italic" }}>
                  {languageSkills.join(" | ")}
                </span>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>
            EXPERIENCE
            <div style={{ flex: 1, borderBottom: "0.5px solid #AAAAAA", marginLeft: "8px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {experience.map((exp, index) => {
              const bullets = bulletLines(exp.description);
              return (
                <div key={exp.id} style={{ marginBottom: "6px" }}>
                  <div 
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "1fr auto 1fr", 
                      alignItems: "baseline", 
                      marginBottom: "2px",
                      gap: "8px"
                    }}
                  >
                    {/* Left: Position */}
                    <div style={{ justifySelf: "start" }}>
                      <span style={styles.jobTitle}>{exp.position}</span>
                    </div>
                    
                    {/* Center: Company */}
                    <div style={{ justifySelf: "center", textAlign: "center" }}>
                      {exp.company && (
                        <span style={styles.companyName}>{exp.company}</span>
                      )}
                    </div>

                    {/* Right: Location + Date */}
                    <div style={{ justifySelf: "end", textAlign: "right", display: "flex", gap: "16px", alignItems: "baseline" }}>
                      {exp.location && (
                        <span style={styles.location}>{exp.location}</span>
                      )}
                      <span style={styles.dateRange} className="min-w-fit">
                        {formatDate(exp.startDate)} –{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                  {bullets.length > 0 && (
                    <ul style={styles.bulletList}>
                      {bullets.map((line, idx) => (
                        <li
                          key={idx}
                          style={styles.bulletItem}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(line),
                          }}
                        />
                      ))}
                    </ul>
                  )}
                  {/* Separator line after each experience, except the last one */}
                  {index < experience.length - 1 && (
                    <div style={{ borderBottom: "0.5px solid #AAAAAA", marginTop: "8px", marginBottom: "8px" }} />
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
          <div style={styles.sectionHeader}>
            EDUCATION
            <div style={{ flex: 1, borderBottom: "0.5px solid #AAAAAA", marginLeft: "8px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "6px" }}>
                <div 
                  style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr auto 1fr", 
                    alignItems: "baseline", 
                    marginBottom: "2px",
                    gap: "8px" 
                  }}
                >
                  {/* Left: School */}
                  <div style={{ justifySelf: "start" }}>
                    <span style={styles.jobTitle}>{edu.school}</span>
                  </div>

                  {/* Center: Degree */}
                  <div style={{ justifySelf: "center", textAlign: "center" }}>
                    {edu.degree && (
                      <span style={{ fontStyle: "italic" }}>{edu.degree}</span>
                    )}
                  </div>

                  {/* Right: Location + Date */}
                  <div style={{ justifySelf: "end", textAlign: "right", display: "flex", gap: "16px", alignItems: "baseline" }}>
                     {edu.location && (
                      <span style={styles.location}>{edu.location}</span>
                     )}
                     <span style={styles.dateRange} className="min-w-fit">
                      {formatDate(edu.graduationDate)}
                     </span>
                  </div>
                </div>
                {edu.field && (
                  <div style={{ paddingLeft: "0", fontSize: "10pt" }}>
                      Major: {edu.field}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>
            PROJECTS
            <div style={{ flex: 1, borderBottom: "0.5px solid #AAAAAA", marginLeft: "8px" }} />
          </div>
          <ul style={styles.bulletList}>
            {projects.map((proj) => (
              <li key={proj.id} style={styles.bulletItem}>
                <span style={{ fontWeight: "700" }}>{proj.title}</span>
                {": " + proj.description}
                {proj.link && (
                  <React.Fragment>
                    {" - "}
                    <a
                      href={
                        proj.link.startsWith("http")
                          ? proj.link
                          : `https://${proj.link}`
                      }
                      style={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${proj.title} link`}
                    >
                      Link
                    </a>
                  </React.Fragment>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* MENTORSHIP */}
      {mentorship && mentorship.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>
            MENTORSHIP
            <div style={{ flex: 1, borderBottom: "0.5px solid #AAAAAA", marginLeft: "8px" }} />
          </div>
          <ul style={styles.bulletList}>
            {mentorship.map((ment) => (
              <li key={ment.id} style={styles.bulletItem}>
                <span style={{ fontWeight: "700" }}>{ment.title}</span>
                {": " + ment.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* OTHERS */}
      {others && others.length > 0 && (
        <section>
          <div style={styles.sectionHeader}>
            OTHERS
            <div style={{ flex: 1, borderBottom: "0.5px solid #AAAAAA", marginLeft: "8px" }} />
          </div>
          <ul style={styles.bulletList}>
            {others.map((oth) => (
              <li key={oth.id} style={styles.bulletItem}>
                <span style={{ fontWeight: "700" }}>{oth.title}</span>
                {": " + oth.description}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

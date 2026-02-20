export interface Profile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  graduationDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface Mentorship {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface OtherItem {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  mentorship: Mentorship[];
  others: OtherItem[];
}

export const initialResumeState: ResumeData = {
  profile: {
    fullName: "ALEX JORDAN",
    title: "", // Not used in new template but keeping for compatibility
    email: "alex.jordan@gmail.com",
    phone: "123-456-7890",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjordan",
    website: "alexjordan.com",
    summary: "", // Not used in new template
  },
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "Present",
      current: true,
      description: "• Led a team of 5 developers to build a scalable microservices architecture.\n• Improved system performance by 30% through optimizing database queries and caching strategies."
    },
    {
      id: "2",
      company: "Startup Inc",
      position: "Software Engineer",
      location: "New York, NY",
      startDate: "2018-05",
      endDate: "2019-12",
      current: false,
      description: "• Developed full-stack features using React and Node.js.\n• Collaborated with product managers to define requirements and deliver high-quality software."
    }
  ],
  education: [
    {
      id: "1",
      school: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "San Francisco, CA",
      graduationDate: "2018-05"
    }
  ],
  skills: [
    { id: "1", name: "JavaScript", level: "Expert", category: "Languages" },
    { id: "2", name: "TypeScript", level: "Expert", category: "Languages" },
    { id: "3", name: "React", level: "Expert", category: "Frontend" },
    { id: "4", name: "Node.js", level: "Intermediate", category: "Backend" }
  ],
  projects: [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Built a scalable e-commerce platform handling 10k+ concurrent users.",
      link: "github.com/alexjordan/ecommerce"
    }
  ],
  mentorship: [
    {
      id: "1",
      title: "Junior Developer Mentor",
      description: "Mentored 3 junior developers, guiding them through code reviews and career growth."
    }
  ],
  others: [
    {
      id: "1",
      title: "Open Source Contributor",
      description: "Contributed to major React ecosystem libraries."
    }
  ]
};
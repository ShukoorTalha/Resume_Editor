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
  graduationDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface ResumeData {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export const initialResumeState: ResumeData = {
  profile: {
    fullName: "Alex Jordan",
    title: "Senior Product Designer",
    email: "alex.jordan@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjordan",
    website: "alexjordan.design",
    summary: "Creative and detail-oriented Product Designer with over 6 years of experience in building user-centric digital products. passionate about bridging the gap between engineering and design.",
  },
  experience: [
    {
      id: "1",
      company: "TechFlow Solutions",
      position: "Senior UI/UX Designer",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: "• Led the redesign of the core SaaS platform, improving user retention by 25%.\n• Managed a team of 3 junior designers and established a unified design system.\n• Collaborated closely with product managers to define feature roadmaps.",
    },
    {
      id: "2",
      company: "Creative Pulse Agency",
      position: "UI Designer",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: "• Designed responsive websites for over 20 clients in fintech and healthcare.\n• Conducted user research and usability testing to iterate on interface designs.",
    }
  ],
  education: [
    {
      id: "1",
      school: "University of California, Berkeley",
      degree: "Bachelor of Arts",
      field: "Cognitive Science",
      graduationDate: "2018-05",
    }
  ],
  skills: [
    { id: "1", name: "Figma", level: "Expert" },
    { id: "2", name: "React", level: "Intermediate" },
    { id: "3", name: "TypeScript", level: "Intermediate" },
    { id: "4", name: "User Research", level: "Expert" },
  ]
};
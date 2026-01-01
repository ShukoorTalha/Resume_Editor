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
  category: string;
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
      description: "• Led redesign of core SaaS platform to cut task time by 25% and lift retention by 12 pts.\n• Standardized a design system across 18 screens, reducing handoff defects by 35%.\n• Partnered with PM/Eng to prioritize roadmap, shipping 9 releases/quarter.",
    },
    {
      id: "2",
      company: "Creative Pulse Agency",
      position: "UI Designer",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: "• Delivered 20+ responsive client sites (fintech/healthcare) with Lighthouse 90+ scores.\n• Ran usability tests with 30 participants, driving 18% conversion uplift post-iteration.",
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
    { id: "1", name: "Figma", level: "Expert", category: "Design" },
    { id: "2", name: "React", level: "Intermediate", category: "Frontend" },
    { id: "3", name: "TypeScript", level: "Intermediate", category: "Frontend" },
    { id: "4", name: "User Research", level: "Expert", category: "Product" },
  ]
};
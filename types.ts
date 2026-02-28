export interface Profile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github?: string;
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
    fullName: "EMILY CHEN",
    title: "Product Manager",
    email: "emily.chen@example.com",
    phone: "212-555-0987",
    location: "New York, NY",
    linkedin: "linkedin.com/in/emilychen-pm",
    website: "emilychenpm.com",
    summary: "Strategic Product Manager with 8+ years of experience leading cross-functional teams to deliver user-centric SaaS products.",
  },
  experience: [
    {
      id: "1",
      company: "InnovateTech Solutions",
      position: "Senior Product Manager",
      location: "New York, NY",
      startDate: "2020-05",
      endDate: "Present",
      current: true,
      description: "• Led the end-to-end development and launch of a new AI-driven analytics dashboard, resulting in a 35% increase in user engagement.\n• Managed a cross-functional team of 15 engineers and designers, utilizing Agile methodologies to accelerate time-to-market by 20%.\n• Conducted extensive user research and A/B testing, driving data-informed decisions that improved conversion rates by 15%.\n• Established key performance indicators (KPIs) and actively tracked product analytics to iteratively optimize feature adoption."
    },
    {
      id: "2",
      company: "Growth Dynamics App",
      position: "Product Manager",
      location: "Boston, MA",
      startDate: "2016-09",
      endDate: "2020-04",
      current: false,
      description: "• Directed the mobile app redesign strategy, achieving a 4.8-star user rating and significantly reducing user churn by 25%.\n• Prioritized product roadmap features based on customer feedback loops and competitive market analysis.\n• Collaborated closely with the marketing team to align product launches with major campaigns, boosting quarterly revenue by $2M."
    },
    {
      id: "3",
      company: "StartUp Inc.",
      position: "Associate Product Manager",
      location: "Austin, TX",
      startDate: "2014-06",
      endDate: "2016-08",
      current: false,
      description: "• Authored detailed product requirements documents (PRDs) and user stories for core platform enhancements.\n• Coordinated sprint planning and daily standups as a certified Scrum Master."
    }
  ],
  education: [
    {
      id: "1",
      school: "New York University (NYU)",
      degree: "Master of Business Administration (MBA)",
      field: "Product Strategy",
      location: "New York, NY",
      graduationDate: "2014-05"
    },
    {
      id: "2",
      school: "Boston University",
      degree: "Bachelor of Science",
      field: "Business Administration",
      location: "Boston, MA",
      graduationDate: "2012-05"
    }
  ],
  skills: [
    { id: "1", name: "Product Strategy", level: "Expert", category: "Core" },
    { id: "2", name: "Agile/Scrum", level: "Expert", category: "Core" },
    { id: "3", name: "Data Analytics", level: "Expert", category: "Core" },
    { id: "4", name: "User Research", level: "Expert", category: "Core" },
    { id: "5", name: "A/B Testing", level: "Intermediate", category: "Core" },
    { id: "10", name: "Jira / Confluence", level: "Expert", category: "Tools" },
    { id: "11", name: "Mixpanel / Amplitude", level: "Expert", category: "Tools" },
    { id: "12", name: "Figma", level: "Expert", category: "Tools" },
    { id: "13", name: "SQL", level: "Intermediate", category: "Tools" }
  ],
  projects: [
    {
      id: "1",
      title: "OpenEventMesh",
      description: "Open-source distributed event mesh written in Rust handling 1M+ msg/sec node throughput. 5,000+ GitHub stars.",
      link: "github.com/alexanderjordan/OpenEventMesh"
    },
    {
      id: "2",
      title: "KubeScaler",
      description: "Custom horizontal pod autoscaler controller based on predictive ML models of traffic patterns.",
      link: ""
    }
  ],
  mentorship: [
    {
      id: "1",
      title: "Principal Engineering Mentor, CloudScale",
      description: "Established the formal engineering mentorship program, directly mentoring 15+ engineers and increasing department retention by 20%."
    },
    {
      id: "2",
      title: "Open Source Contributor Guide",
      description: "Host bi-monthly workshops for underrepresented groups on making their first open-source contributions to CNCF projects."
    }
  ],
  others: [
    {
      id: "1",
      title: "Conference Speaker",
      description: "Presented 'Scaling Event Sourcing to 50B Events' at KubeCon NA 2023."
    },
    {
      id: "2",
      title: "Patents",
      description: "Co-inventor on US Patent #9876543: 'Method for deterministic routing in distributed caching systems'."
    }
  ]
};
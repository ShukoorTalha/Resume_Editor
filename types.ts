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
    fullName: "ALEXANDER JORDAN",
    title: "Senior Staff Software Engineer",
    email: "alexander.jordan@gmail.com",
    phone: "415-555-0198",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexanderjordan-swe",
    website: "alexanderjordan.dev",
    summary: "Senior engineering leader with 10+ years of experience architecting distributed systems.",
  },
  experience: [
    {
      id: "1",
      company: "CloudScale Technologies",
      position: "Senior Staff Software Engineer",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "Present",
      current: true,
      description: "• Architected a globally-distributed, multi-region event streaming platform handling 50B+ events daily with 99.99% uptime.\n• Led a cross-functional organization of 25 engineers across 4 squads to migrate legacy monoliths to a golang microservices architecture.\n• Reduced cloud infrastructure spending by 40% ($1.2M annually) through optimizing kubernetes resource allocation and implementing spot instance orchestration.\n• Mentored 8 senior engineers through promotion to staff level, standardizing system design review processes across the engineering department."
    },
    {
      id: "2",
      company: "DataFlow Systems",
      position: "Senior Software Engineer",
      location: "Seattle, WA",
      startDate: "2017-08",
      endDate: "2021-02",
      current: false,
      description: "• Designed and implemented a distributed caching tier using Redis Cluster, reducing median API latency from 250ms to 45ms.\n• Spearheaded the adoption of GraphQL, reducing client over-fetching and decreasing payload sizes by 60%.\n• Developed critical path payment processing pipelines handling $50M+ in daily transaction volume with zero data loss."
    },
    {
      id: "3",
      company: "Acme Analytics",
      position: "Software Engineer",
      location: "New York, NY",
      startDate: "2014-06",
      endDate: "2017-07",
      current: false,
      description: "• Built robust ETL pipelines using Python and Apache Airflow to process 10TB of daily telemetry data.\n• Transitioned core services from on-premise hardware to AWS."
    }
  ],
  education: [
    {
      id: "1",
      school: "University of California, Berkeley",
      degree: "Master of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      graduationDate: "2014-05"
    },
    {
      id: "2",
      school: "University of Washington",
      degree: "Bachelor of Science",
      field: "Computer Engineering",
      location: "Seattle, WA",
      graduationDate: "2012-05"
    }
  ],
  skills: [
    { id: "1", name: "Golang", level: "Expert", category: "Languages" },
    { id: "2", name: "Python", level: "Expert", category: "Languages" },
    { id: "3", name: "Java", level: "Expert", category: "Languages" },
    { id: "4", name: "TypeScript", level: "Expert", category: "Languages" },
    { id: "5", name: "Rust", level: "Intermediate", category: "Languages" },
    { id: "10", name: "Distributed Systems Architecture", level: "Expert", category: "Core" },
    { id: "11", name: "Microservices", level: "Expert", category: "Core" },
    { id: "12", name: "System Design", level: "Expert", category: "Core" },
    { id: "13", name: "Kubernetes/Docker", level: "Expert", category: "Core" },
    { id: "14", name: "AWS/GCP Multi-Cloud", level: "Expert", category: "Core" }
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
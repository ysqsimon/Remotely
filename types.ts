
export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  type: 'Full-time' | 'Contract' | 'Part-time';
  location: string;
  tags: string[];
  postedAt: string;
  description: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
}

export interface Talent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  hourlyRate: string;
  hourlyRateValue: number;
  skills: string[];
  availability: string;
  bio: string;
  rating: number;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Expert';
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  logo: string;
  openRoles: number;
  website: string;
}

export type User = {
  name: string;
  email: string;
  avatar: string;
} | null;

export enum NavigationTab {
  JOBS = 'jobs',
  TALENTS = 'talents',
  COMPANIES = 'companies',
  AI_SEARCH = 'ai-search',
  LOGIN = 'login'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  // Optional payloads to render cards in the chat
  data?: {
    type: 'jobs' | 'talents' | 'companies';
    items: (Job | Talent | Company)[];
  };
}

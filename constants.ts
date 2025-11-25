
import { Job, Talent, Company } from './types';

// Generators to create 100+ realistic items
export const COMPANIES_LIST = [
  { name: 'NebulaStream', logo: 'https://picsum.photos/48/48?random=11', industry: 'Cloud Infrastructure', website: 'nebulastream.io', desc: 'Building the next generation of serverless edge computing for global applications.' },
  { name: 'ApexFin', logo: 'https://picsum.photos/48/48?random=12', industry: 'FinTech', website: 'apexfin.tech', desc: 'Democratizing algorithmic trading for the everyday investor.' },
  { name: 'FlowSync', logo: 'https://picsum.photos/48/48?random=13', industry: 'Productivity', website: 'flowsync.app', desc: 'Asynchronous communication platform designed for deep work.' },
  { name: 'BaseCore', logo: 'https://picsum.photos/48/48?random=14', industry: 'Database', website: 'basecore.db', desc: 'The distributed SQL database built for infinite scale.' },
  { name: 'MerchantX', logo: 'https://picsum.photos/48/48?random=15', industry: 'E-commerce', website: 'merchantx.shop', desc: 'Headless commerce API for modern frontend developers.' },
  { name: 'IdeaSpace', logo: 'https://picsum.photos/48/48?random=16', industry: 'Productivity', website: 'ideaspace.so', desc: 'Where creative teams organize, brainstorm, and ship.' },
  { name: 'RoamStay', logo: 'https://picsum.photos/48/48?random=17', industry: 'Travel', website: 'roamstay.co', desc: 'Subscription living for digital nomads worldwide.' },
  { name: 'StreamVibe', logo: 'https://picsum.photos/48/48?random=18', industry: 'Entertainment', website: 'streamvibe.tv', desc: 'Interactive streaming platform for live coding and creative arts.' },
  { name: 'TalkHub', logo: 'https://picsum.photos/48/48?random=19', industry: 'Social', website: 'talkhub.chat', desc: 'Privacy-first community platform for professional networks.' },
  { name: 'PixelDraft', logo: 'https://picsum.photos/48/48?random=20', industry: 'Design', website: 'pixeldraft.design', desc: 'AI-powered prototyping tool for UI/UX designers.' },
];

export const ROLES_LIST = [
  'Senior Frontend Engineer', 'Backend Developer (Go)', 'Product Designer', 'DevOps Engineer', 
  'Full Stack Developer', 'Marketing Manager', 'Content Writer', 'Data Scientist', 
  'Machine Learning Engineer', 'Customer Success Lead', 'iOS Developer', 'Android Developer',
  'Product Manager', 'QA Engineer', 'Sales Representative'
];

export const LOCATIONS_LIST = ['Remote (Worldwide)', 'Remote (US)', 'Remote (EU)', 'Remote (APAC)', 'Remote (Americas)'];
export const TYPES_LIST: ('Full-time' | 'Contract' | 'Part-time')[] = ['Full-time', 'Full-time', 'Full-time', 'Contract', 'Part-time'];
export const SKILLS_LIST = ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'AWS', 'Figma', 'Kubernetes', 'SQL', 'Rust', 'Next.js', 'Tailwind', 'GraphQL'];
export const EXPERIENCE_LEVELS: ('Entry' | 'Mid' | 'Senior' | 'Lead')[] = ['Entry', 'Mid', 'Senior', 'Senior', 'Lead'];

// Generate 100 Jobs
export const MOCK_JOBS: Job[] = Array.from({ length: 100 }).map((_, i) => {
  const company = COMPANIES_LIST[i % COMPANIES_LIST.length];
  const role = ROLES_LIST[i % ROLES_LIST.length];
  const skills = [SKILLS_LIST[i % SKILLS_LIST.length], SKILLS_LIST[(i + 1) % SKILLS_LIST.length], SKILLS_LIST[(i + 2) % SKILLS_LIST.length]];
  const minSal = 80 + (i % 10) * 10;
  const maxSal = 120 + (i % 10) * 15;
  const expLevel = EXPERIENCE_LEVELS[i % EXPERIENCE_LEVELS.length];
  
  const fullDescription = `
We are ${company.name}, a leader in ${company.industry}. We are seeking a highly skilled **${role}** (${expLevel} Level) to join our distributed team.

**About the Role:**
In this position, you will play a pivotal role in architecting and building scalable solutions that power our core platform. You will work closely with cross-functional teams including product managers, designers, and other engineers to deliver high-quality software.

**Key Responsibilities:**
- Design, develop, and maintain efficient, reusable, and reliable code.
- Collaborate with the design team to implement intuitive user interfaces.
- Participate in code reviews and contribute to engineering best practices.
- Troubleshoot, debug, and upgrade existing systems.
- Mentor junior developers and share technical knowledge.

**Requirements:**
- Proven experience with **${skills.join(', ')}**.
- Strong understanding of software design patterns and principles.
- Experience with cloud infrastructure and CI/CD pipelines.
- Excellent problem-solving skills and attention to detail.
- Strong written and verbal communication skills in English.
- Ability to work effectively in a remote, asynchronous environment.

**Benefits:**
- Competitive salary and equity package.
- 100% remote work policy with flexible hours.
- Home office stipend and co-working space reimbursement.
- Comprehensive health, dental, and vision insurance.
- Annual learning and development budget.

Join us at ${company.name} and help shape the future of ${company.industry}!
`.trim();

  return {
    id: `job-${i + 1}`,
    title: role,
    company: company.name,
    companyLogo: company.logo,
    salary: `$${minSal}k - $${maxSal}k`,
    salaryMin: minSal,
    salaryMax: maxSal,
    experienceLevel: expLevel,
    type: TYPES_LIST[i % TYPES_LIST.length],
    location: LOCATIONS_LIST[i % LOCATIONS_LIST.length],
    tags: skills,
    postedAt: `${(i % 24) + 1}h ago`,
    description: fullDescription
  };
});

// Generate 50 Talents
const NAMES = ['Sarah', 'James', 'Michael', 'Emily', 'David', 'Emma', 'Daniel', 'Olivia', 'Alex', 'Sophia'];
const LAST_NAMES = ['Chen', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
const TALENT_EXP_LEVELS: ('Junior' | 'Mid' | 'Senior' | 'Expert')[] = ['Junior', 'Mid', 'Senior', 'Expert'];

export const MOCK_TALENTS: Talent[] = Array.from({ length: 50 }).map((_, i) => {
  const firstName = NAMES[i % NAMES.length];
  const lastName = LAST_NAMES[i % LAST_NAMES.length];
  const role = ROLES_LIST[i % ROLES_LIST.length];
  const skills = [SKILLS_LIST[i % SKILLS_LIST.length], SKILLS_LIST[(i + 3) % SKILLS_LIST.length], SKILLS_LIST[(i + 5) % SKILLS_LIST.length]];
  const rate = 40 + (i % 10) * 10;
  const expLevel = TALENT_EXP_LEVELS[i % TALENT_EXP_LEVELS.length];
  
  const bio = `
I am a dedicated **${role}** (${expLevel}) with over ${5 + (i % 10)} years of experience in building scalable web applications and digital products. My expertise lies in **${skills.join(', ')}**, and I have a proven track record of delivering high-quality work for startups and enterprise clients alike.

I thrive in remote environments and excel at asynchronous communication. I am passionate about clean code, user-centric design, and solving complex technical challenges. 

**Recent Projects:**
- Led the migration of a legacy monolith to microservices architecture.
- Designed and implemented a design system used by 20+ developers.
- Optimized application performance, reducing load times by 40%.

I am currently looking for ${i % 2 === 0 ? 'contract opportunities' : 'a full-time role'} where I can make a significant impact.
`.trim();

  return {
    id: `talent-${i + 1}`,
    name: `${firstName} ${lastName}`,
    role: role,
    avatar: `https://picsum.photos/200/200?random=${100 + i}`,
    hourlyRate: `$${rate}/hr`,
    hourlyRateValue: rate,
    skills: skills,
    availability: i % 3 === 0 ? 'Available now' : 'Available in 2 weeks',
    bio: bio,
    rating: 4.0 + (i % 10) / 10,
    experienceLevel: expLevel
  };
});

// Helper to extract companies from MOCK_JOBS
export const getCompaniesFromJobs = (): Company[] => {
  const uniqueCompanies = new Map<string, Company>();
  
  MOCK_JOBS.forEach(job => {
    if (!uniqueCompanies.has(job.company)) {
      const companyInfo = COMPANIES_LIST.find(c => c.name === job.company);
      if (companyInfo) {
        // Detailed description generation
        const detailedDesc = `
${companyInfo.desc}

**About ${companyInfo.name}:**
Founded in 20${15 + (job.id.length % 5)}, ${companyInfo.name} has grown to become a key player in the ${companyInfo.industry} space. Our mission is to empower users through innovative technology and seamless experiences.

**Our Culture:**
We believe in autonomy, mastery, and purpose. We are a fully distributed team spread across 15+ countries. We value output over hours and trust our employees to manage their own schedules.

**Why Join Us?**
- Work with a diverse, global team of experts.
- Solve challenging problems at scale.
- Contribute to open-source projects.
- Regular company retreats in exotic locations.

We are constantly growing and looking for talented individuals to join our journey.
        `.trim();

        uniqueCompanies.set(job.company, {
          id: `comp-${job.company}`,
          name: job.company,
          industry: companyInfo.industry,
          size: '100-500',
          description: detailedDesc,
          logo: job.companyLogo,
          openRoles: MOCK_JOBS.filter(j => j.company === job.company).length,
          website: companyInfo.website
        });
      }
    }
  });
  
  return Array.from(uniqueCompanies.values());
};

export const MOCK_COMPANIES = getCompaniesFromJobs();

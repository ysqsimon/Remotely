import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { Job, Talent, Company, ChatMessage } from "../types";
import { MOCK_JOBS, MOCK_TALENTS, MOCK_COMPANIES, ROLES_LIST, SKILLS_LIST, COMPANIES_LIST } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to delay for simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Static Data Fetchers (Now filtering local Mock Data) ---

export const fetchJobs = async (query: string): Promise<Job[]> => {
  await delay(600); // Simulate network
  if (!query) return MOCK_JOBS;
  const lowerQuery = query.toLowerCase();
  return MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(lowerQuery) || 
    job.company.toLowerCase().includes(lowerQuery) ||
    job.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const fetchTalents = async (query: string): Promise<Talent[]> => {
  await delay(600);
  if (!query) return MOCK_TALENTS;
  const lowerQuery = query.toLowerCase();
  return MOCK_TALENTS.filter(talent => 
    talent.role.toLowerCase().includes(lowerQuery) || 
    talent.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
  );
};

export const fetchCompanies = async (): Promise<Company[]> => {
    await delay(600);
    return MOCK_COMPANIES;
};

export const generateCoverLetter = async (job: Job, userSkills: string = "React, TypeScript, Node.js"): Promise<string> => {
    if (!ai) {
        await delay(1000);
        return `[Simulated AI Mode - No API Key]\n\nDear Hiring Manager at ${job.company},\n\nI am writing to express my enthusiastic interest in the ${job.title} position...`;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a professional, concise cover letter for: Role: ${job.title}, Company: ${job.company}. My skills: ${userSkills}. Description: ${job.description}. Keep it under 200 words.`
        });
        return response.text || "Could not generate cover letter.";
    } catch (e) {
        console.error(e);
        return "Error generating cover letter. Please try again.";
    }
};

// --- AI Search Implementation ---

// 1. Define Tools for Gemini
const searchJobsTool: FunctionDeclaration = {
    name: "search_jobs",
    description: "Search for remote job postings. Automatically normalizes vague terms (e.g., 'front-end' -> 'Frontend') to match database standards.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            keywords: { type: Type.STRING, description: "The single most relevant NORMALIZED keyword matching our database (e.g. 'Frontend', 'Go', 'Manager')." },
            location: { type: Type.STRING, description: "Preferred location (e.g., 'US', 'Worldwide')" }
        },
        required: ["keywords"]
    }
};

const searchTalentsTool: FunctionDeclaration = {
    name: "search_talents",
    description: "Find remote freelancers or talents. Normalizes input to match standard roles.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            roleOrSkill: { type: Type.STRING, description: "The normalized role or skill (e.g., 'Designer', 'React')." }
        },
        required: ["roleOrSkill"]
    }
};

const searchCompaniesTool: FunctionDeclaration = {
    name: "search_companies",
    description: "Find remote-first companies information.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            industry: { type: Type.STRING, description: "Industry or company name" }
        },
        required: ["industry"]
    }
};

const tools: Tool[] = [{
    functionDeclarations: [searchJobsTool, searchTalentsTool, searchCompaniesTool]
}];

// 2. Main Chat Function
export const chatWithAI = async (history: ChatMessage[], userMessage: string): Promise<ChatMessage> => {
    // If no API key, fallback to simple keyword match
    if (!ai) {
        await delay(800);
        if (userMessage.includes("job")) {
             return {
                id: Date.now().toString(),
                role: 'ai',
                text: "I'm running in offline mode. Here are some jobs I found matching your request:",
                data: { type: 'jobs', items: MOCK_JOBS.slice(0, 4) }
             };
        }
        return {
            id: Date.now().toString(),
            role: 'ai',
            text: "I'm running in offline mode. Please add an API key to enable smart search. (Try asking for 'jobs')",
        };
    }

    try {
        const model = 'gemini-2.5-flash';
        
        // Inject database context into system instruction
        const systemInstruction = `
            You are a helpful recruitment assistant for 'Remotely'.
            
            DATABASE CONTEXT:
            - Known Roles: ${ROLES_LIST.join(', ')}
            - Known Skills: ${SKILLS_LIST.join(', ')}
            - Known Companies: ${COMPANIES_LIST.map(c => c.name).join(', ')}

            INSTRUCTIONS:
            1. Analyze the user's input to understand their true intent.
            2. NORMALIZE keywords before calling tools:
               - "front-end", "frontend", "ui dev" -> Map to "Frontend" or "Product Designer"
               - "golang" -> Map to "Go"
               - "reactjs" -> Map to "React"
               - "node", "nodejs" -> Map to "Node.js"
            3. Fix typos automatically (e.g., "phyton" -> "Python").
            4. If the user asks for "opportunities", they mean "jobs".
            
            Always respond with a friendly, concise message summarising what you found.
        `;

        const result = await ai.models.generateContent({
            model,
            contents: userMessage,
            config: {
                tools: tools,
                systemInstruction: systemInstruction,
            }
        });

        const call = result.functionCalls?.[0];
        
        if (call) {
            // Execute the tool locally against our MOCK data
            const args = call.args as any;
            let responseData: any = null;
            let responseType: 'jobs' | 'talents' | 'companies' = 'jobs';
            let summary = "";

            if (call.name === 'search_jobs') {
                const kw = (args.keywords || '').toLowerCase();
                const loc = (args.location || '').toLowerCase();
                
                // Enhanced filtering: Check title, tags, and company
                responseData = MOCK_JOBS.filter(j => 
                    (j.title.toLowerCase().includes(kw) || 
                     j.tags.some(t => t.toLowerCase().includes(kw)) || 
                     j.company.toLowerCase().includes(kw) ||
                     (kw === 'engineer' && j.title.toLowerCase().includes('developer')) // Extra fallback
                    ) &&
                    (loc ? j.location.toLowerCase().includes(loc) : true)
                ).slice(0, 5); // Limit to 5 for UI
                
                responseType = 'jobs';
                summary = responseData.length > 0 
                    ? `I found ${responseData.length} jobs related to "${args.keywords}".`
                    : `I couldn't find any jobs matching "${args.keywords}". Try searching for specific roles like "Frontend" or "Backend".`;
            } 
            else if (call.name === 'search_talents') {
                const term = (args.roleOrSkill || '').toLowerCase();
                responseData = MOCK_TALENTS.filter(t => 
                    t.role.toLowerCase().includes(term) || t.skills.some(s => s.toLowerCase().includes(term))
                ).slice(0, 4);
                responseType = 'talents';
                summary = responseData.length > 0
                    ? `Here are some top talents matching "${args.roleOrSkill}".`
                    : `I couldn't find talents matching "${args.roleOrSkill}".`;
            }
            else if (call.name === 'search_companies') {
                const ind = (args.industry || '').toLowerCase();
                responseData = MOCK_COMPANIES.filter(c => 
                    c.name.toLowerCase().includes(ind) || c.industry.toLowerCase().includes(ind)
                ).slice(0, 4);
                responseType = 'companies';
                summary = responseData.length > 0
                    ? `I found these companies related to "${args.industry}".`
                    : `No companies found for "${args.industry}".`;
            }

            return {
                id: Date.now().toString(),
                role: 'ai',
                text: summary,
                data: responseData && responseData.length > 0 ? {
                    type: responseType,
                    items: responseData
                } : undefined
            };
        }

        // If no tool called, just return text
        return {
            id: Date.now().toString(),
            role: 'ai',
            text: result.text || "I'm not sure how to help with that. Try asking for 'React jobs' or 'Designers'."
        };

    } catch (error) {
        console.error("Gemini Chat Error", error);
        return {
            id: Date.now().toString(),
            role: 'ai',
            text: "Sorry, I encountered an error processing your request."
        };
    }
};
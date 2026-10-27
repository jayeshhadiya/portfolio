export interface ExperienceSchema {
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  employmentType?: string;
  start: string;
  end?: string;
  summary: string;
  highlights: string[];
  tools: string[];
}

import { ExperienceSchema } from '@data/schema/experience.schema';

// Newest job first. Leave `end` out for your current role; it shows as "Present".
const experienceData: ExperienceSchema[] = [
  {
    role: 'DevOps Engineer',
    company: 'Upvision Software',
    companyUrl: 'https://www.upvision.in/',
    employmentType: 'Full-time',
    start: 'Sep 2023',
    summary: 'Building and running the CI/CD pipelines, containers and cloud infrastructure that the engineering team ships on.',
    highlights: [
      'Built and maintained CI/CD pipelines that build, test and deploy every change automatically.',
      'Containerized applications with Docker and deployed and managed them on Kubernetes.',
      'Provisioned and managed cloud infrastructure as code.',
      'Set up monitoring, logging and alerting to catch issues before users notice them.',
    ],
    tools: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS', 'Linux', 'Git'],
  },
  {
    role: '.NET Developer Intern',
    company: 'TatvaSoft',
    companyUrl: 'https://www.tatvasoft.com',
    employmentType: 'Internship',
    start: 'Jan 2023',
    end: 'Aug 2023',
    summary: 'Developed web applications with .NET and SQL Server as part of the development team.',
    highlights: [
      'Built features and REST APIs with C# and ASP.NET Core.',
      'Designed database tables and wrote SQL queries and stored procedures in SQL Server.',
      'Fixed bugs and worked with Git in code reviews alongside senior developers.',
    ],
    tools: ['C#', '.NET Core', 'ASP.NET Core', 'SQL Server', 'SQL', 'Git'],
  },
];

export default experienceData;

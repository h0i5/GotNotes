export const securityTopics = [
  {
    id: 1,
    name: "College Notes",
    description: "Secure server-side rendering & API routes",
  },
  {
    id: 2,
    name: "Lecture Notes",
    description: "Database & authentication security",
  },
  {
    id: 6,
    name: "Exam Papers",
    description: "Software as a Service security best practices",
  },
  {
    id: 3,
    name: "Class Notes",
    description: "Protected endpoints & data validation",
  },
  {
    id: 4,
    name: "Education",
    description: "OAuth, JWT & session management",
  },
  { id: 5, name: "Everything", description: "Secure deployment pipelines" },
];

// Extended app list for blocks
export const appBlocks = [
  { id: 1, name: "Next.js", icon: "⚡" },
  { id: 2, name: "React", icon: "⚛️" },
  { id: 3, name: "Vue", icon: "🔰" },
  { id: 4, name: "Supabase", icon: "📊" },
  { id: 5, name: "Firebase", icon: "🔥" },
  { id: 6, name: "AWS", icon: "☁️" },
  { id: 7, name: "Docker", icon: "🐳" },
  { id: 8, name: "GraphQL", icon: "📈" },
  { id: 9, name: "MongoDB", icon: "🍃" },
  { id: 11, name: "Kubernetes", icon: "🚢" },
  { id: 12, name: "GitHub", icon: "🐙" },
];

// Define icon paths instead of components for better separation
export type ServiceItem = {
  title: string;
  description: string;
  iconPath: string;
};

export const servicesList: ServiceItem[] = [
  {
    title: "Security Audits",
    description:
      "Comprehensive analysis of your application's security posture",
    iconPath: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Code Review",
    description: "Expert review of your codebase for security vulnerabilities",
    iconPath:
      "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  },
  {
    title: "Integration Security",
    description: "Secure your third-party integrations and API connections",
    iconPath:
      "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244",
  },
];

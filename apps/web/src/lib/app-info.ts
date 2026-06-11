export type AppInfo = {
  company: string;
  title: string;
  subtitle: string;
  projectName: string;
  user: {
    name: string;
    organization: string;
    role: string;
  };
};

export const APP_INFO: AppInfo = {
  company: "SUCOFINDO",
  title: "ASSET INTEGRITY MANAGEMENT",
  subtitle: "Risk-Based Inspection Platform",
  projectName: "PT Nusantara Geothermal Energy - Kamojang Unit 3",
  user: {
    name: "Frido Satrio",
    organization: "SUCOFINDO",
    role: "Superadmin",
  },
};
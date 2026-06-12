export type Tone =
  | "blue"
  | "green"
  | "cyan"
  | "amber"
  | "red"
  | "purple"
  | "slate";

export type ProfileTab = "access" | "notifications" | "activity";

export type PreferredLanguage =
  | "Bahasa Indonesia / English"
  | "Bahasa Indonesia"
  | "English";

export type ToneStyle = {
  badge: string;
  iconBox: string;
  icon: string;
};

export type ProfileForm = {
  title: string;
  fullName: string;
  displayName: string;
  email: string;
  role: string;
  company: string;
  preferredLanguage: PreferredLanguage;
};

export type AccessScopeItem = {
  id: string;
  projectKey: string;
  entity: string;
  purpose: string;
  level: string;
  tone: Tone;
  enabled: boolean;
  route: string;
};

export type ProjectAccessGroup = {
  key: string;
  projectName: string;
  description: string;
  accessLevel: string;
  tone: Tone;
};

export type ActivityItem = {
  title: string;
  subtitle: string;
  timestamp: string;
  tone: Tone;
  route: string;
};

export type NotificationItem = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  channel: "Email + in-app" | "Email only" | "In-app only";
  priority: "Normal" | "High" | "Escalation";
};
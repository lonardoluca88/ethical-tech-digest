
export type NewsCategory = 'ai' | 'robotics' | 'biotech';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  logo?: string;
  reliability: number; // 1-10 rating
}

export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  url: string;
  date: string;
  sourceId: string;
  category: NewsCategory;
  imageUrl?: string;
}

export interface AppSettings {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  emailSettings: EmailSettings;
  emailNotificationsEnabled: boolean;
}

export interface EmailSettings {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
  };
  recipientEmail: string;
  senderEmail: string;
  weeklyDigestDay: number; // 0-6, where 0 is Sunday
}

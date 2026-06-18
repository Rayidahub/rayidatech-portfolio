// types/contact.ts
export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  created_at: string;
}
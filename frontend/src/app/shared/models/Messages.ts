//messages interface to create dialogue between user and patient
export interface Message {
  sender: 'user' | 'patient';
  content: string;
}

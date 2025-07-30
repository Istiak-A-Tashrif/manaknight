export interface Recipient {
  id: string;
  name: string;
  email: string;
}

export interface DocumentField {
  id: string;
  type: 'signature' | 'text' | 'date' | 'checkbox' | 'initial';
  recipientId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  required: boolean;
  page: number;
  value?: string;
}

export interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  status: 'draft' | 'pending' | 'completed';
  recipients: Recipient[];
  fields: DocumentField[];
  file: File | null;
}
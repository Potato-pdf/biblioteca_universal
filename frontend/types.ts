export enum UserRole {
  STUDENT = 'STUDENT',
  LIBRARIAN = 'LIBRARIAN'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  university: string; // Universidad de origen
  description: string;
  coverUrl: string;
  pdfUrl: string; // En una app real, esto sería un link a un blob storage
  publishedYear: number;
}
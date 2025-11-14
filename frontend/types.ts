
export enum UserRole {
  Librarian = 'LIBRARIAN',
  Student = 'STUDENT',
}

export enum DataSource {
  Internal = 'INTERNAL',
  External = 'EXTERNAL',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  source: DataSource;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  source: DataSource;
  coverUrl: string;
}

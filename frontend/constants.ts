import { Book, User, UserRole } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Maestro Bibliotecario',
    role: UserRole.LIBRARIAN
  },
  {
    id: '2',
    username: 'alumno',
    name: 'Estudiante Dedicado',
    role: UserRole.STUDENT
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '101',
    title: 'El Arte de la Guerra',
    author: 'Sun Tzu',
    university: 'Universidad Imperial',
    description: 'Un tratado militar antiguo que enseña estrategia y táctica.',
    coverUrl: 'https://picsum.photos/id/20/300/450',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishedYear: -500
  },
  {
    id: '102',
    title: 'Historias de Genji',
    author: 'Murasaki Shikibu',
    university: 'Universidad de Kioto',
    description: 'Una obra maestra de la literatura japonesa sobre la vida en la corte.',
    coverUrl: 'https://picsum.photos/id/24/300/450',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishedYear: 1008
  },
  {
    id: '103',
    title: 'Botánica Moderna',
    author: 'Dr. Tanaka',
    university: 'Universidad de Tokio',
    description: 'Estudios avanzados sobre la flora de las islas.',
    coverUrl: 'https://picsum.photos/id/106/300/450',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishedYear: 2021
  },
  {
    id: '104',
    title: 'Arquitectura de Templos',
    author: 'Kenzo Tange',
    university: 'Universidad de Artes',
    description: 'Análisis estructural de pagodas y templos antiguos.',
    coverUrl: 'https://picsum.photos/id/200/300/450',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishedYear: 1985
  },
  {
    id: '105',
    title: 'Cálculo Avanzado II',
    author: 'Prof. Smith',
    university: 'Universidad Extranjera de Oxford',
    description: 'Libro de texto compartido por convenio interuniversitario.',
    coverUrl: 'https://picsum.photos/id/175/300/450',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishedYear: 2019
  }
];
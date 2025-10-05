
import { QuizQuestion } from '../types';

const ZOO_SCHEMA_CONTEXT = `
You are evaluating SQL queries against a zoo database with the following tables:

1.  **hewan (Animal)**
    *   id_hewan (INT, Primary Key)
    *   nama_hewan (VARCHAR)
    *   spesies (VARCHAR)
    *   id_kandang (INT, Foreign Key to kandang.id_kandang)

2.  **pegawai (Employee)**
    *   id_pegawai (INT, Primary Key)
    *   nama_pegawai (VARCHAR)
    *   jabatan (VARCHAR)

3.  **kandang (Cage)**
    *   id_kandang (INT, Primary Key)
    *   nama_kandang (VARCHAR)
    *   lokasi (VARCHAR)

4.  **perawatan (Treatment)**
    *   id_perawatan (INT, Primary Key)
    *   id_hewan (INT, Foreign Key to hewan.id_hewan)
    *   id_pegawai (INT, Foreign Key to pegawai.id_pegawai)
    *   tgl_perawatan (DATE)
    *   keterangan (VARCHAR)
`;

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    questionText: 'Write the output of the following query:',
    code: `SELECT k.lokasi, COUNT(h.id_hewan) AS jumlah_hewan
FROM kandang k
LEFT JOIN hewan h ON k.id_kandang = h.id_kandang
GROUP BY k.lokasi
ORDER BY jumlah_hewan DESC;`,
    options: [
      'Barat: 3, Utara: 2, Timur: 2, Selatan: 1',
      'Utara: 2, Timur: 2, Barat: 2, Selatan: 1',
      'Barat: 3, Utara: 2, Timur: 2, Selatan: 0',
      'Selatan: 1, Timur: 2, Utara: 2, Barat: 3',
    ],
    correctAnswer: 'Barat: 3, Utara: 2, Timur: 2, Selatan: 1',
  },
  {
    id: 2,
    type: 'multiple-choice',
    questionText: 'Write the output of the following query:',
    code: `SELECT h.nama_hewan, COUNT(r.id_perawatan) AS jumlah_perawatan
FROM hewan h
JOIN perawatan r ON h.id_hewan = r.id_hewan
GROUP BY h.nama_hewan
HAVING COUNT(r.id_perawatan) > 1
ORDER BY jumlah_perawatan DESC;`,
    options: [
      'Simba: 3, Koko: 2, Rango: 2',
      'Simba: 3, Koko: 2',
      'Simba: 3',
      'Nala: 1, Rio: 1, Dumbo: 1, Taro: 1',
    ],
    correctAnswer: 'Simba: 3, Koko: 2, Rango: 2',
  },
   {
    id: 3,
    type: 'multiple-choice',
    questionText: 'What is the result of this query?',
    code: `SELECT k.lokasi, p.nama_pegawai, COUNT(r.id_perawatan) AS jumlah_perawatan
FROM kandang k
JOIN hewan h ON k.id_kandang = h.id_kandang
JOIN perawatan r ON h.id_hewan = r.id_hewan
JOIN pegawai p ON r.id_pegawai = p.id_pegawai
GROUP BY k.lokasi, p.nama_pegawai
ORDER BY k.lokasi, jumlah_perawatan DESC;`,
    options: [
      'Barat: Andi(2), Siti(1); Selatan: Andi(1); Timur: Siti(1), Budi(1); Utara: Budi(2), Siti(1), Andi(1)',
      'Barat: Andi(2), Siti(1); Selatan: Andi(1); Timur: Budi(1), Siti(1); Utara: Budi(2), Siti(1), Andi(1)',
      'Utara: Budi(2), Siti(1), Andi(1); Timur: Siti(1), Budi(1); Selatan: Andi(1); Barat: Andi(2), Siti(1)',
      'A list of locations, employee names, and their treatment counts, ordered by location alphabetically, then by count descending.',
    ],
    correctAnswer: 'A list of locations, employee names, and their treatment counts, ordered by location alphabetically, then by count descending.',
  },
  {
    id: 4,
    type: 'multiple-choice',
    questionText: 'What is the result of this query?',
    code: `SELECT p.nama_pegawai, COUNT(DISTINCT r.id_hewan) AS jumlah_hewan
FROM pegawai p
JOIN perawatan r ON p.id_pegawai = r.id_pegawai
GROUP BY p.nama_pegawai;`,
    options: [
        'A list of employees and the number of unique animals they have treated.',
        'A list of employees and the total number of treatments they have performed.',
        'A list of animals and the number of employees who treated them.',
        'A list of employees and the number of distinct treatments.',
    ],
    correctAnswer: 'A list of employees and the number of unique animals they have treated.',
  },
  {
    id: 5,
    type: 'matching',
    questionText: 'Match the queries (Q) with their functions (F).',
    queries: [
      { id: 'Q1', text: 'SELECT k.nama_kandang, COUNT(h.id_hewan) AS jumlah_hewan FROM kandang k JOIN hewan h ON k.id_kandang = h.id_kandang GROUP BY k.nama_kandang;' },
      { id: 'Q2', text: 'SELECT p.nama_pegawai, COUNT(r.id_perawatan) AS jumlah_perawatan FROM pegawai p JOIN perawatan r ON p.id_pegawai = r.id_pegawai GROUP BY p.nama_pegawai ORDER BY jumlah_perawatan DESC LIMIT 1;' },
      { id: 'Q3', text: 'SELECT k.nama_kandang, COUNT(DISTINCT h.spesies) AS jumlah_spesies FROM kandang k JOIN hewan h ON k.id_kandang = h.id_kandang GROUP BY k.nama_kandang;' },
      { id: 'Q4', text: 'SELECT h.nama_hewan, p.nama_pegawai, r.tgl_perawatan FROM perawatan r JOIN hewan h ON r.id_hewan = h.id_hewan JOIN pegawai p ON r.id_pegawai = p.id_pegawai;' },
    ],
    functions: [
      { id: 'F1', text: 'Looking for employees who do the most animal care.' },
      { id: 'F2', text: 'Look for the number of different animal species in each enclosure.' },
      { id: 'F3', text: 'Displays the name of the animal, the name of the person caring for it, and the date of care.' },
      { id: 'F4', text: 'Displays the number of animals in each cage along with the name of the cage.' },
    ],
    correctMapping: {
      Q1: 'F4',
      Q2: 'F1',
      Q3: 'F2',
      Q4: 'F3',
    },
  },
  {
    id: 6,
    type: 'open-ended-sql',
    questionText: 'Create a query to display the number of animals of each species cared for by each employee.',
    geminiPrompt: "Evaluate if the user's SQL query correctly displays the number of animals of each species cared for by each employee.",
    schemaContext: ZOO_SCHEMA_CONTEXT,
  },
    {
    id: 7,
    type: 'open-ended-sql',
    questionText: 'Create a query to display a list of cages along with the number of different employees who have cared for animals in those cages.',
    geminiPrompt: "Evaluate if the user's SQL query correctly displays a list of cages with the count of distinct employees who cared for animals in them.",
    schemaContext: ZOO_SCHEMA_CONTEXT,
  },
  {
    id: 8,
    type: 'open-ended-sql',
    questionText: 'Create a query showing the employee who takes care of the most animals in the "Kandang Singa" (lion cage).',
    geminiPrompt: 'Evaluate if the user\'s SQL query correctly identifies the employee who has performed the most treatments on animals located in the cage named "Kandang Singa".',
    schemaContext: ZOO_SCHEMA_CONTEXT,
  },
  {
    id: 9,
    type: 'open-ended-text',
    questionText: 'Does the order in which inner joins are written affect the final table output? Give an example and explain!',
    modelAnswer: "No, the order of INNER JOINs does not affect the final result set. The database's query optimizer treats INNER JOINs as a commutative and associative set of operations. It will analyze the joins, table sizes, and indexes to determine the most efficient execution plan, regardless of the order you write them in. For example, joining `pegawai` to `perawatan` and then to `hewan` will produce the same result as joining `hewan` to `perawatan` and then to `pegawai` because only rows that exist in all three tables will be included.",
    geminiPrompt: "Evaluate the user's explanation on whether INNER JOIN order affects the final output.",
  },
  {
    id: 10,
    type: 'open-ended-text',
    questionText: 'Does the order in which you write an outer join affect the final result? Give an example and explain!',
    modelAnswer: "Yes, the order of OUTER JOINs (like LEFT JOIN or RIGHT JOIN) absolutely affects the final result. A LEFT JOIN preserves all rows from the left table and finds matches in the right. If you swap the tables, the set of preserved rows changes. For example, `A LEFT JOIN B` keeps all rows of A, while `B LEFT JOIN A` keeps all rows of B. These will produce different results unless every row in A has a corresponding row in B and vice-versa (which would be like an INNER JOIN).",
    geminiPrompt: "Evaluate the user's explanation on whether OUTER JOIN order affects the final output.",
  },
  {
    id: 11,
    type: 'multiple-select',
    questionText: 'Which of the following queries has the same goal as query Q1 from the matching exercise? (Select all that apply)',
    code: `Q1: SELECT k.nama_kandang, COUNT(h.id_hewan) AS jumlah_hewan
FROM kandang k
JOIN hewan h ON k.id_kandang = h.id_kandang
GROUP BY k.nama_kandang;`,
    options: [
        `SELECT k.nama_kandang, COUNT(h.id_hewan) AS jumlah_hewan FROM kandang k LEFT JOIN hewan h ON k.id_kandang = h.id_kandang GROUP BY k.nama_kandang;`,
        `SELECT k.nama_kandang, COUNT(h.id_hewan) AS jumlah_hewan FROM hewan h JOIN kandang k ON h.id_kandang = k.id_kandang GROUP BY k.nama_kandang;`,
        `SELECT k.nama_kandang, COUNT(*) FROM kandang k, hewan h WHERE k.id_kandang = h.id_kandang GROUP BY k.nama_kandang;`,
        `SELECT nama_kandang, (SELECT COUNT(*) FROM hewan WHERE id_kandang = k.id_kandang) FROM kandang k;`
    ],
    correctAnswers: [
        `SELECT k.nama_kandang, COUNT(h.id_hewan) AS jumlah_hewan FROM hewan h JOIN kandang k ON h.id_kandang = k.id_kandang GROUP BY k.nama_kandang;`,
        `SELECT k.nama_kandang, COUNT(*) FROM kandang k, hewan h WHERE k.id_kandang = h.id_kandang GROUP BY k.nama_kandang;`
    ],
  },
  {
    id: 12,
    type: 'multiple-select',
    questionText: 'Based on the query below, which statements are correct? (Select all that apply)',
    code: `SELECT
    a.nama_area,
    k.nama_kandang,
    COUNT(h.id_hewan) AS jumlah_hewan,
    COUNT(DISTINCT pr.id_pegawai) AS jumlah_pegawai_perawatan
FROM
    area a
INNER JOIN
    kandang k ON a.id_area = k.id_area
LEFT JOIN
    hewan h ON k.id_kandang = h.id_kandang
LEFT JOIN
    perawatan pr ON h.id_hewan = pr.id_hewan
GROUP BY
    a.nama_area, k.nama_kandang
HAVING
    COUNT(h.id_hewan) > 0
ORDER BY
    a.nama_area, jumlah_hewan DESC;`,
    options: [
        'This query focuses on the number of animals and the number of employees involved in care in each pen.',
        'An INNER JOIN ensures that only kennels in a valid area are considered, while LEFT JOINs ensure each kennel appears even if it has no animals or treatments.',
        'The COUNT aggregate function is used to count total animals per pen and distinct employees caring for animals in that pen.',
        "The HAVING clause filters out pens that have no animals, effectively hiding empty pens from the final results.",
        'The query uses an INNER JOIN to ensure that only employees who have a maintenance record appear in the results.'
    ],
    correctAnswers: [
        'This query focuses on the number of animals and the number of employees involved in care in each pen.',
        'The COUNT aggregate function is used to count total animals per pen and distinct employees caring for animals in that pen.',
        "The HAVING clause filters out pens that have no animals, effectively hiding empty pens from the final results."
    ],
  },
];

import Papa, { ParseResult } from 'papaparse';

export const parseCsvFile = async (file: File): Promise<Record<string, string>[]> => {
  const text = await file.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Record<string, string>>) => resolve(results.data),
      error: (error: Error) => reject(error),
    });
  });
};

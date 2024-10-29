import Papa, { ParseResult } from 'papaparse';

export type CsvParseResult = {
  table: Record<string, string>[];
  fields: string[];
};

export const parseCsvFile = async (file: File): Promise<CsvParseResult> => {
  const text = await file.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Record<string, string>>) =>
        resolve({
          table: results.data,
          fields: results.meta.fields ?? [],
        }),
      error: (error: Error) => reject(error),
    });
  });
};

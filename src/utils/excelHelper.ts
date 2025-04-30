import xlsx from 'xlsx';
interface ExcelOptions<T> {
  filePath: string;
  sheetIndex?: number;
  mapRow?: (row: any) => T;
}

export function parseExcelFile<T = any>({
  filePath,
  sheetIndex = 0,
  mapRow,
}: ExcelOptions<T>): T[] {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[sheetIndex];
  const sheet = workbook.Sheets[sheetName];

  const rawData: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  if (mapRow) {
    return rawData.map(mapRow);
  }

  return rawData as T[];
}

import xlsx from 'xlsx';

interface SeatExcelData {
  seatNumber: string;
  seatAvailability: 'AVAILABLE' | 'RESERVED' | 'BOOKED';
  row: number;
  column: string;
  wagonId: string;
}

export const parseExcelFile = (filePath: string): SeatExcelData[] => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json<SeatExcelData>(worksheet);

  return jsonData;
};

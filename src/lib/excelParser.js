import * as XLSX from 'xlsx';

export function parseTaskText(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `text-${index + 1}`,
      task: line,
      timeSpent: '',
      taskType: '',
      painPoint: '',
      reflection: ''
    }));
}

export async function parseExcelFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, blankrows: false, defval: '' });

  return rows
    .slice(1)
    .map((row, index) => ({
      id: `xlsx-${index + 1}`,
      task: String(row[0] ?? '').trim(),
      timeSpent: String(row[1] ?? '').trim(),
      taskType: String(row[2] ?? '').trim(),
      painPoint: String(row[3] ?? '').trim(),
      reflection: String(row[4] ?? '').trim()
    }))
    .filter((row) => row.task);
}

import * as XLSX from 'xlsx';
import { defaultTemplateRows, templateHeaders } from './templateRows.js';

export function downloadExcelTemplate() {
  const worksheet = XLSX.utils.aoa_to_sheet([templateHeaders, ...defaultTemplateRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Role Tasks');
  XLSX.writeFile(workbook, 'role-redesign-template.xlsx');
}

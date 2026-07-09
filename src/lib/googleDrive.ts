import * as XLSX from 'xlsx';

import { PartnerData } from '../types';

export function generateExcelBlob(data: PartnerData): Blob {
  const wb = XLSX.utils.book_new();
  
  // Format data elegantly inside cells
  const content = [
    ['FORMULARIO DE RECOGIDA DE COLABORADORES - BEJOB LOGÍSTICA'],
    [],
    ['1. DATOS DE LA EMPRESA'],
    ['Nombre de la Empresa', data.companyName],
    ['Descripción Genérica', data.companyDescription],
    ['Persona de Contacto', data.contactPerson],
    ['Cargo', data.contactRole],
    ['Email de Contacto', data.contactEmail],
    ['Teléfono de Contacto', data.contactPhone],
    [],
    ['2. PARTICIPACIÓN EN EL PROGRAMA (CENTROS Y PERFILES)'],
    ['Nº', 'Centro de Trabajo (Ubicación Exacta)', 'Perfil con posibilidad de incorporación', 'Funciones', 'Competencias', 'Plazas Prácticas']
  ];

  // Append each work center participation
  data.participations.forEach((part, index) => {
    content.push([
      String(index + 1),
      part.locationExact,
      part.profile,
      part.functions,
      part.competencies,
      String(part.slotsCount)
    ]);
  });

  content.push([]);
  content.push(['3. INFORMACIÓN DE CONTROL']);
  content.push(['Fecha de Envío', new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES')]);
  content.push(['Origen', 'Portal de colaboradores BeJob']);

  const ws = XLSX.utils.aoa_to_sheet(content);

  // Set basic column widths for readability in Excel
  ws['!cols'] = [
    { wch: 6 },   // Column A
    { wch: 35 },  // Column B
    { wch: 30 },  // Column C
    { wch: 40 },  // Column D
    { wch: 40 },  // Column E
    { wch: 15 }   // Column F
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Ficha Colaborador");
  
  // Generate ArrayBuffer and create Blob
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function uploadExcelToGoogleDrive(
  accessToken: string,
  blob: Blob,
  fileName: string,
  folderId: string = '1OOMer7OYFkRji9KcPn22ZZzwCBTzrKPj'
): Promise<any> {
  const fileMetadata = {
    name: fileName,
    parents: [folderId]
  };

  const boundary = '3d_applet_boundary_xlsx';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const arrayBuffer = await blob.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = btoa(binary);

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(fileMetadata) +
    delimiter +
    'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n' +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error de API de Google Drive (${response.status}): ${errText || response.statusText}`);
  }

  return await response.json();
}

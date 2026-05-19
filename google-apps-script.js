// GOOGLE APPS SCRIPT - Pegá este código en tu proyecto de Google Apps Script
// Este script funciona como API REST para guardar y leer datos de Google Sheets

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tickets');
    const data = JSON.parse(e.postData.contents);
    
    // Si es una acción de marcar como usado
    if (data.action === 'markAsUsed') {
      return markTicketAsUsed(sheet, data.id);
    }
    
    // Si es una reserva nueva
    const row = [
      data.id,
      data.nombre,
      data.email,
      data.telefono,
      data.cantidad,
      data.estado,
      data.timestamp,
      '' // columna para timestamp de uso
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Ticket guardado'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tickets');
    const data = sheet.getDataRange().getValues();
    
    // Saltar header row
    const tickets = data.slice(1).map(row => ({
      id: row[0],
      nombre: row[1],
      email: row[2],
      telefono: row[3],
      cantidad: row[4],
      estado: row[5],
      timestamp: row[6],
      timestampUso: row[7]
    }));
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      tickets: tickets
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function markTicketAsUsed(sheet, ticketId) {
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === ticketId) {
      sheet.getRange(i + 1, 6).setValue('usado'); // columna estado
      sheet.getRange(i + 1, 8).setValue(new Date().toISOString()); // timestamp de uso
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Ticket marcado como usado'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Ticket no encontrado'
  })).setMimeType(ContentService.MimeType.JSON);
}

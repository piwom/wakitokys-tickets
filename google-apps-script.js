// GOOGLE APPS SCRIPT - Pegá este código en tu proyecto de Google Apps Script
// Envío de emails con GmailApp (100% gratis, 100 emails/día)

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
      data.cantidad,
      data.estado,
      data.timestamp,
      '' // columna para timestamp de uso
    ];
    
    sheet.appendRow(row);
    
    // Enviar email
    try {
      sendTicketEmail(data.email, data.nombre, data.id, data.cantidad);
    } catch (emailError) {
      Logger.log('Error enviando email: ' + emailError);
    }
    
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
    
    const tickets = data.slice(1).map(row => ({
      id: row[0],
      nombre: row[1],
      email: row[2],
      cantidad: row[3],
      estado: row[4],
      timestamp: row[5],
      timestampUso: row[6]
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
      sheet.getRange(i + 1, 5).setValue('usado');
      sheet.getRange(i + 1, 7).setValue(new Date().toISOString());
      
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

function sendTicketEmail(toEmail, toName, ticketId, quantity) {
  const shortId = ticketId.split('-')[1].substring(0, 4);
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 20px;">¡NOS VEMOS AHÍ!</h1>
      
      <p style="font-size: 16px; margin-bottom: 10px;">Hola <strong>${toName}</strong>,</p>
      
      <p style="font-size: 16px; margin-bottom: 20px;">
        Tu reserva está confirmada. Guardá este email o descargá el ticket desde tu navegador.
      </p>
      
      <div style="background: #F2EDE3; padding: 20px; margin: 20px 0; border: 2px solid #0A0A0A;">
        <p style="margin: 0; font-size: 12px; text-transform: uppercase; opacity: 0.6;">EVENTO</p>
        <h2 style="margin: 5px 0; font-size: 24px;">WAKITOKYS - ¿A DÓNDE VA?</h2>
        
        <p style="margin: 15px 0 5px 0;"><strong>📅 Fecha:</strong> Domingo 08 de Julio 2026 - 21hs</p>
        <p style="margin: 5px 0;"><strong>📍 Lugar:</strong> Tanque Cultural - Acassuso 6930, CABA</p>
        <p style="margin: 5px 0;"><strong>🎟️ Entradas:</strong> ${quantity}</p>
        <p style="margin: 5px 0;"><strong>🆔 Código:</strong> ${shortId}</p>
      </div>
      
      <p style="font-size: 14px; margin: 20px 0;">
        <strong>En la puerta:</strong><br>
        • Mostrá este email o el QR que descargaste<br>
        • Si no lo tenés, decinos tu nombre y apellido
      </p>
      
      <p style="font-size: 12px; color: #666; margin-top: 30px;">
        Nos vemos el 08/07 🎵
      </p>
    </div>
  `;
  
  // Enviar con GmailApp (usa tu cuenta de Google)
  GmailApp.sendEmail(
    toEmail,
    '✓ Tu entrada para WAKITOKYS - 08/07',
    'Tu reserva está confirmada. Abrí este email en un navegador para ver los detalles.',
    {
      htmlBody: emailHtml,
      name: 'WAKITOKYS'
    }
  );
  
  Logger.log('Email enviado a: ' + toEmail);
}

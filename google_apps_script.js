/**
 * GOOGLE APPS SCRIPT - WEB APP FOR EMAIL NOTIFICATIONS
 * 
 * Instrucciones:
 * 1. Abra https://script.google.com
 * 2. Haga clic en "Nuevo proyecto"
 * 3. Reemplace todo el contenido con este código.
 * 4. Guarde el proyecto (Ctrl + S o icono de guardar).
 * 5. Haga clic en "Desplegar" -> "Nuevo despliegue".
 * 6. Seleccione Tipo: "Aplicación web".
 * 7. Configure las opciones exactamente así:
 *    - Ejecutar como: "Yo" (su cuenta de Google, dueña del correo)
 *    - Quién tiene acceso: "Cualquiera" (esto permite que la aplicación envíe los datos sin pedir login al usuario final)
 * 8. Haga clic en "Desplegar" y autorice los permisos necesarios (especialmente los de Gmail/MailApp para enviar correos).
 * 9. Copie la "URL de la aplicación web" resultante y péguela en la pestaña "Bandeja de Entrada" de su aplicación.
 */

function doPost(e) {
  try {
    // 1. Obtener los datos del POST enviados desde el navegador
    var data = JSON.parse(e.postData.contents);
    var emailRecipient = "srubin@bejob.com";
    
    // 2. Verificar si es un Mensaje de Soporte o un Registro de Colaborador
    if (data.type === "ticket" || data.type === "message" || !data.base64Data) {
      var fullName = data.fullName || "Usuario de la App";
      var userEmail = data.email || "No especificado";
      var subjectLine = data.subject || "Consulta Técnica";
      var messageText = data.message || "";
      
      var emailSubject = "Nuevo Mensaje de Soporte: " + subjectLine;
      var emailBody = "Hola,\n\n" +
        "Se ha recibido una nueva consulta o mensaje de soporte a través de la aplicación:\n\n" +
        "Nombre completo: " + fullName + "\n" +
        "Correo electrónico de contacto: " + userEmail + "\n" +
        "Asunto: " + subjectLine + "\n\n" +
        "Mensaje:\n" + messageText + "\n\n" +
        "Saludos cordiales,\nSistema de Registro de Colaboradores";
        
      MailApp.sendEmail({
        to: emailRecipient,
        subject: emailSubject,
        body: emailBody
      });
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Mensaje de soporte enviado con éxito por correo a " + emailRecipient
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 3. Caso de Registro de Colaborador (archivo Excel)
    var fileName = data.fileName || "Ficha_Colaborador.xlsx";
    
    // Decodificar el archivo Excel enviado en formato Base64
    var decoded = Utilities.base64Decode(data.base64Data);
    var blob = Utilities.newBlob(
      decoded, 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
      fileName
    );
    
    // Intentar guardar en la carpeta de Google Drive (opcional, en segundo plano)
    var fileUrl = "";
    var fileId = "";
    try {
      var folderId = "1OOMer7OYFkRji9KcPn22ZZzwCBTzrKPj";
      var folder = DriveApp.getFolderById(folderId);
      var file = folder.createFile(blob);
      fileId = file.getId();
      fileUrl = file.getUrl();
    } catch(driveErr) {
      console.warn("No se pudo guardar en Drive: " + driveErr.toString());
    }
    
    // Enviar correo electrónico con la ficha Excel adjunta directamente a srubin@bejob.com
    var emailSubject = "Nueva Ficha de Colaborador Recibida: " + fileName.replace(".xlsx", "").replace(/_/g, " ");
    var emailBody = "Hola,\n\n" +
      "Se ha recibido un nuevo registro de colaborador a través del formulario de la aplicación.\n\n" +
      "Se adjunta a este correo la ficha generada automáticamente en formato Excel (.xlsx) para su revisión directa.\n\n";
      
    if (fileUrl) {
      emailBody += "También se ha guardado una copia de respaldo en la carpeta de Google Drive:\n" + fileUrl + "\n\n";
    }
    
    emailBody += "Saludos cordiales,\nSistema de Registro de Colaboradores";
    
    MailApp.sendEmail({
      to: emailRecipient,
      subject: emailSubject,
      body: emailBody,
      attachments: [blob]
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileId: fileId,
      url: fileUrl,
      message: "Ficha enviada con éxito por correo a " + emailRecipient + " y respaldada en Drive."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    // Retornar error de forma controlada si algo falla
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Opciones de preflight para navegadores (CORS)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

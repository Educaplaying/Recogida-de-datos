import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with a limit for base64 file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Helper to get SMTP transporter lazily
  function getTransporter() {
    // Credenciales SMTP escritas directamente para srubin@bejob.com (Outlook / Office 365)
    const host = "smtp.office365.com";
    const port = 587;
    const user = "srubin@bejob.com";
    
    // IMPORTANTE: Reemplace "TU_CONTRASEÑA_DE_APLICACION_DE_OUTLOOK" con su contraseña de aplicación de Microsoft
    // obtenida de la configuración de seguridad de su cuenta (por ejemplo: "abcd-efgh-ijkl-mnop").
    const pass = process.env.SMTP_PASS || "TU_CONTRASEÑA_DE_APLICACION_DE_OUTLOOK";

    if (pass === "TU_CONTRASEÑA_DE_APLICACION_DE_OUTLOOK") {
      throw new Error(
        "Falta configurar su contraseña de aplicación de Outlook/Microsoft en server.ts. Abra el archivo /server.ts y reemplace 'TU_CONTRASEÑA_DE_APLICACION_DE_OUTLOOK' con su contraseña de 16 caracteres."
      );
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: false, // TLS
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3"
      }
    });
  }

  // API endpoint for Partner Form Submission (including Excel attachment)
  app.post("/api/send-partner", async (req, res) => {
    try {
      const { partner, excelBase64, fileName } = req.body;

      if (!partner) {
        return res.status(400).json({ error: "Faltan los datos del colaborador" });
      }

      const emailRecipient = "srubin@bejob.com";
      const fromName = process.env.SMTP_FROM_NAME || "BeJob Portal";
      const fromEmail = "srubin@bejob.com";

      const subject = `Nueva Ficha de Colaboración: ${partner.companyName}`;
      
      let participationsHtml = "";
      if (partner.participations && Array.isArray(partner.participations)) {
        partner.participations.forEach((part: any, index: number) => {
          participationsHtml += `
            <div style="margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background-color: #fafafa;">
              <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #f97316; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Centro de Trabajo #${index + 1}</h4>
              <p style="margin: 4px 0; font-size: 13.5px;"><strong>Ubicación Exacta:</strong> ${part.locationExact}</p>
              <p style="margin: 4px 0; font-size: 13.5px;"><strong>Perfil Solicitado:</strong> ${part.profile}</p>
              <p style="margin: 4px 0; font-size: 13.5px;"><strong>Plazas disponibles:</strong> ${part.slotsCount} vacantes</p>
              <p style="margin: 8px 0 4px 0; font-size: 13.5px;"><strong>Funciones:</strong></p>
              <p style="margin: 0; font-size: 13px; color: #475569; white-space: pre-wrap; line-height: 1.4;">${part.functions}</p>
              <p style="margin: 8px 0 4px 0; font-size: 13.5px;"><strong>Competencias:</strong></p>
              <p style="margin: 0; font-size: 13px; color: #475569; white-space: pre-wrap; line-height: 1.4;">${part.competencies}</p>
            </div>
          `;
        });
      }

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background-color: #0f172a; padding: 28px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.025em; text-transform: uppercase;">Nueva Colaboración Registrada</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Ficha de empresa y centros asociados</p>
          </div>
          <div style="padding: 28px; background-color: #ffffff;">
            <p style="margin-top: 0; font-size: 15px;">Hola,</p>
            <p style="font-size: 15px;">Se ha recibido una nueva ficha de colaboración registrada de forma segura en el portal:</p>
            
            <h3 style="border-bottom: 2px solid #f97316; padding-bottom: 6px; font-size: 15px; color: #0f172a; text-transform: uppercase; margin-top: 24px;">1. Datos de la Empresa</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 12px 0 24px 0; font-size: 13.5px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #475569; width: 35%;">Empresa:</td>
                <td style="padding: 10px 8px; color: #0f172a; font-weight: bold;">${partner.companyName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #475569; vertical-align: top;">Descripción:</td>
                <td style="padding: 10px 8px; color: #334155; line-height: 1.4;">${partner.companyDescription || ''}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Persona de Contacto:</td>
                <td style="padding: 10px 8px; color: #0f172a;">${partner.contactPerson || ''}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Cargo / Puesto:</td>
                <td style="padding: 10px 8px; color: #0f172a;">${partner.contactRole || ''}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Email:</td>
                <td style="padding: 10px 8px; color: #0284c7; font-weight: bold;"><a href="mailto:${partner.contactEmail || ''}" style="color: #0284c7; text-decoration: none;">${partner.contactEmail || ''}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Teléfono:</td>
                <td style="padding: 10px 8px; color: #0f172a;">${partner.contactPhone || ''}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #475569;">Fecha de Registro:</td>
                <td style="padding: 10px 8px; color: #64748b; font-size: 13px;">${partner.submissionDate}</td>
              </tr>
            </table>

            <h3 style="border-bottom: 2px solid #f97316; padding-bottom: 6px; font-size: 15px; color: #0f172a; text-transform: uppercase; margin-top: 24px;">2. Participación en el Programa</h3>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Plazas, ubicaciones exactas y perfiles detallados:</p>
            
            ${participationsHtml}

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 24px; display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px; margin-right: 12px;">📊</div>
              <div>
                <strong style="display: block; font-size: 13px; color: #0f172a;">Ficha Excel Adjunta</strong>
                <span style="font-size: 12px; color: #64748b;">Se ha generado el archivo estructurado para su importación inmediata en Microsoft Excel.</span>
              </div>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Portal de Registro de Colaboradores BeJob &copy; 2026
          </div>
        </div>
      `;

      const attachments = [];
      if (excelBase64) {
        attachments.push({
          filename: fileName || `Ficha_Colaborador_${partner.companyName.trim().replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
          content: Buffer.from(excelBase64, "base64"),
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
      }

      try {
        const transporter = getTransporter();
        // Send email in the background so SMTP connection/delivery never blocks the HTTP response
        transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: emailRecipient,
          subject,
          html: htmlBody,
          attachments
        }).then(() => {
          console.log("Email sent successfully to srubin@bejob.com in background");
        }).catch((err) => {
          console.error("Nodemailer background mail delivery failed:", err);
        });
      } catch (transporterErr: any) {
        console.warn("SMTP Transporter not configured or failed to initialize, skipping email delivery:", transporterErr.message);
      }

      return res.status(200).json({ success: true, message: "Ficha recibida. El correo se procesará en segundo plano." });
    } catch (err: any) {
      console.error("Error general en send-partner:", err);
      return res.status(500).json({ error: "Error interno del servidor", details: err.message });
    }
  });

  // API endpoint for Support / Message submission
  app.post("/api/send-support", async (req, res) => {
    try {
      const { ticket } = req.body;

      if (!ticket) {
        return res.status(400).json({ error: "Faltan los datos del mensaje" });
      }

      const emailRecipient = "srubin@bejob.com";
      const fromName = process.env.SMTP_FROM_NAME || "BeJob Soporte";
      const fromEmail = "srubin@bejob.com";

      const subject = `Nuevo Mensaje de Soporte: ${ticket.subject}`;

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background-color: #0284c7; padding: 28px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: -0.025em;">Mensaje de Soporte / Contacto</h2>
          </div>
          <div style="padding: 28px; bg-color: #ffffff;">
            <p style="margin-top: 0; font-size: 15px;">Hola,</p>
            <p style="font-size: 15px;">Se ha recibido un nuevo mensaje de soporte técnico a través del portal:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569; width: 35%;">Remitente:</td>
                <td style="padding: 12px 8px; color: #0f172a; font-weight: 500;">${ticket.fullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569;">Email de Contacto:</td>
                <td style="padding: 12px 8px; color: #0284c7; font-weight: 500;"><a href="mailto:${ticket.email}" style="color: #0284c7; text-decoration: none;">${ticket.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569;">Asunto:</td>
                <td style="padding: 12px 8px; color: #0f172a; font-weight: 600;">${ticket.subject}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569;">Fecha:</td>
                <td style="padding: 12px 8px; color: #64748b; font-size: 13px;">${ticket.submissionDate}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 18px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; font-weight: bold; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Mensaje Escrito:</p>
              <p style="margin: 0; font-size: 14.5px; white-space: pre-wrap; color: #0f172a; line-height: 1.6;">${ticket.message}</p>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Portal de Registro de Colaboradores BeJob &copy; 2026
          </div>
        </div>
      `;

      try {
        const transporter = getTransporter();
        // Send email in the background so it never blocks the HTTP response
        transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: emailRecipient,
          subject,
          html: htmlBody
        }).then(() => {
          console.log("Support email sent successfully in background");
        }).catch((err) => {
          console.error("Nodemailer background support mail failed:", err);
        });
      } catch (transporterErr: any) {
        console.warn("SMTP Transporter not configured or failed to initialize for support, skipping email:", transporterErr.message);
      }

      return res.status(200).json({ success: true, message: "Mensaje de soporte recibido. Se procesará en segundo plano." });
    } catch (err: any) {
      console.error("Error general en send-support:", err);
      return res.status(500).json({ error: "Error interno del servidor", details: err.message });
    }
  });

  // Vite middleware for development or Static Assets for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

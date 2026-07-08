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
    // Credenciales SMTP escritas directamente para srubin@bejob.com
    const host = "smtp.gmail.com";
    const port = 587;
    const user = "srubin@bejob.com";
    
    // IMPORTANTE: Reemplace "TU_CONTRASEÑA_DE_APLICACION_DE_GMAIL" con su contraseña de aplicación de 16 caracteres
    // obtenida de su cuenta de Google (por ejemplo: "abcd efgh ijkl mnop").
    const pass = process.env.SMTP_PASS || "TU_CONTRASEÑA_DE_APLICACION_DE_GMAIL";

    if (pass === "TU_CONTRASEÑA_DE_APLICACION_DE_GMAIL") {
      throw new Error(
        "Falta configurar su contraseña de aplicación de Gmail en server.ts. Abra el archivo /server.ts y reemplace 'TU_CONTRASEÑA_DE_APLICACION_DE_GMAIL' con su contraseña de 16 caracteres."
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

      const subject = `Nueva Ficha de Colaborador Recibida: ${partner.companyName}`;
      
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background-color: #0f172a; padding: 28px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: -0.025em;">Registro de Nuevo Colaborador</h2>
          </div>
          <div style="padding: 28px; bg-color: #ffffff;">
            <p style="margin-top: 0; font-size: 15px;">Hola,</p>
            <p style="font-size: 15px;">Se ha recibido una nueva ficha de colaborador registrada a través del portal de la aplicación:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569; width: 35%;">Empresa:</td>
                <td style="padding: 12px 8px; color: #0f172a; font-weight: 500;">${partner.companyName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569;">Ubicación:</td>
                <td style="padding: 12px 8px; color: #0f172a;">${partner.location}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569;">Capacidad:</td>
                <td style="padding: 12px 8px; color: #0f172a; font-weight: 500;">${partner.capacity} vacantes</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569;">Perfil Solicitado:</td>
                <td style="padding: 12px 8px; color: #0f172a; font-weight: 500;">${partner.profile === 'Otros' && partner.otherProfileText ? `${partner.profile} (${partner.otherProfileText})` : partner.profile}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569; vertical-align: top;">Funciones Principales:</td>
                <td style="padding: 12px 8px; color: #334155; white-space: pre-wrap; font-size: 13.5px; line-height: 1.5;">${partner.functions}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569; vertical-align: top;">Competencias:</td>
                <td style="padding: 12px 8px; color: #334155; white-space: pre-wrap; font-size: 13.5px; line-height: 1.5;">${partner.competencies}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; font-weight: bold; color: #475569;">Fecha de Registro:</td>
                <td style="padding: 12px 8px; color: #64748b; font-size: 13px;">${partner.submissionDate}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 24px; display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">📊</div>
              <div>
                <strong style="display: block; font-size: 13px; color: #0f172a;">Ficha Excel Adjunta</strong>
                <span style="font-size: 12px; color: #64748b;">Se ha generado el archivo estructurado para su importación inmediata.</span>
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

      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: emailRecipient,
        subject,
        html: htmlBody,
        attachments
      });

      return res.status(200).json({ success: true, message: "Correo enviado con éxito a srubin@bejob.com" });
    } catch (err: any) {
      console.error("Error al enviar correo de colaborador:", err);
      return res.status(500).json({
        error: "No se pudo enviar el correo electrónico con la ficha.",
        details: err.message || "Error de conexión o credenciales"
      });
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

      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: emailRecipient,
        subject,
        html: htmlBody
      });

      return res.status(200).json({ success: true, message: "Mensaje de soporte enviado con éxito a srubin@bejob.com" });
    } catch (err: any) {
      console.error("Error al enviar correo de soporte:", err);
      return res.status(500).json({
        error: "No se pudo enviar el mensaje de soporte por correo.",
        details: err.message || "Error de conexión o credenciales"
      });
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

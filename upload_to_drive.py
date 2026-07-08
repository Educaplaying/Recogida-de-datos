#!/usr/bin/env python3
"""
PYTHON SCRIPT - GOOGLE DRIVE BACKGROUND UPLOADER (SERVER-TO-SERVER)

Este script permite subir un archivo Excel (.xlsx) a la carpeta especificada
de forma automatizada en segundo plano utilizando una Cuenta de Servicio (Service Account)
de Google Cloud. No requiere ninguna interacción ni inicio de sesión del usuario final.

Requisitos técnicos:
1. Instale las dependencias de Google API en su servidor:
   pip install google-auth google-api-python-client

2. Cree una Cuenta de Servicio en Google Cloud Console:
   - Vaya a la consola de Google Cloud -> API y servicios -> Credenciales.
   - Haga clic en "Crear credenciales" -> "Cuenta de servicio".
   - Descargue el archivo de clave privada en formato JSON y guárdelo como 'service_account.json' en el mismo directorio.

3. Comparta su carpeta de Google Drive con la cuenta de servicio:
   - Abra su carpeta: https://drive.google.com/drive/folders/1OOMer7OYFkRji9KcPn22ZZzwCBTzrKPj
   - Haga clic en Compartir y agregue el correo de la cuenta de servicio (ejemplo: mi-cuenta@mi-proyecto.iam.gserviceaccount.com) con permiso de "Editor".
"""

import os
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Configuración básica
FOLDER_ID = "1OOMer7OYFkRji9KcPn22ZZzwCBTzrKPj"
CREDENTIALS_FILE = "service_account.json"

def upload_excel_to_drive(file_path, custom_file_name=None):
    """
    Sube un archivo local a la carpeta de Google Drive de forma silenciosa.
    """
    if not os.path.exists(file_path):
        print(f"Error: El archivo local '{file_path}' no existe.")
        return None

    if not os.path.exists(CREDENTIALS_FILE):
        print(f"Error: Archivo de credenciales '{CREDENTIALS_FILE}' no encontrado.")
        print("Siga las instrucciones en el encabezado de este script para configurar su Cuenta de Servicio.")
        return None

    try:
        # 1. Cargar las credenciales de la cuenta de servicio y alcances
        scopes = ['https://www.googleapis.com/auth/drive.file']
        creds = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, 
            scopes=scopes
        )

        # 2. Inicializar el servicio de la API de Google Drive
        service = build('drive', 'v3', credentials=creds)

        # 3. Preparar metadatos del archivo
        file_name = custom_file_name if custom_file_name else os.path.basename(file_path)
        file_metadata = {
            'name': file_name,
            'parents': [FOLDER_ID]
        }

        # 4. Cargar archivo con tipo mime adecuado
        media = MediaFileUpload(
            file_path, 
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            resumable=True
        )

        print(f"Iniciando subida silenciosa de '{file_name}'...")
        
        # 5. Ejecutar la subida a Drive
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink'
        ).execute()

        print("¡Éxito! Archivo subido correctamente en segundo plano.")
        print(f"ID del Archivo: {file.get('id')}")
        print(f"Enlace de visualización: {file.get('webViewLink')}")
        return file

    except Exception as e:
        print(f"Ocurrió un error inesperado al interactuar con la API de Google Drive: {e}")
        return None

if __name__ == "__main__":
    # Ejemplo de uso desde línea de comandos: python upload_to_drive.py ruta/a/mi_archivo.xlsx
    if len(sys.argv) < 2:
        print("Uso: python upload_to_drive.py <ruta_del_archivo_excel> [nombre_personalizado.xlsx]")
        sys.exit(1)
        
    local_file = sys.argv[1]
    name_on_drive = sys.argv[2] if len(sys.argv) > 2 else None
    upload_excel_to_drive(local_file, name_on_drive)

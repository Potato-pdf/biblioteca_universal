// PDF Upload Component - Uploads to UploadThing and returns URL
// NO BUSINESS LOGIC - only file upload UI
import React, { useState } from "react";
import { useUploadThing } from "../hooks/useUploadThing";

interface PdfUploadProps {
  onUploadComplete: (url: string) => void;
  currentPdfUrl?: string;
  disabled?: boolean;
}

export const PdfUpload: React.FC<PdfUploadProps> = ({
  onUploadComplete,
  currentPdfUrl,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startUpload } = useUploadThing("bookPdfUploader");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF");
      return;
    }

    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
      setError("El PDF no debe superar 16MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await startUpload([file]);
      if (result && result[0]) {
        onUploadComplete(result[0].url);
      }
    } catch (err) {
      setError("Error al subir el PDF");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Archivo PDF del libro
      </label>

      {currentPdfUrl && (
        <div className="mb-2">
          <a
            href={currentPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            📄 Ver PDF actual
          </a>
        </div>
      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100
          disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {uploading && (
        <p className="text-sm text-green-600">Subiendo PDF...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Máximo 16MB. Solo archivos PDF
      </p>
    </div>
  );
};

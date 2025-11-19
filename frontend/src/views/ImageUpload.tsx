// Image Upload Component - Uploads to UploadThing and returns URL
// NO BUSINESS LOGIC - only file upload UI
import React, { useState } from "react";
import { useUploadThing } from "../hooks/useUploadThing";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  currentImageUrl,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startUpload } = useUploadThing("bookCoverUploader");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen");
      return;
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      setError("La imagen no debe superar 4MB");
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
      setError("Error al subir la imagen");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Imagen de portada
      </label>
      
      {currentImageUrl && (
        <div className="mb-2">
          <img
            src={currentImageUrl}
            alt="Portada actual"
            className="w-32 h-48 object-cover rounded border"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {uploading && (
        <p className="text-sm text-blue-600">Subiendo imagen...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Máximo 4MB. Formatos: JPG, PNG, GIF, WEBP
      </p>
    </div>
  );
};

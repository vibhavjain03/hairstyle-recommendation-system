import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';

export const Dropzone = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onImageUpload(imageUrl);
      }
    }
  }, [onImageUpload]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onImageUpload(imageUrl);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        "relative flex flex-col items-center justify-center w-full max-w-xl p-12 mx-auto mt-8 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
        isDragging 
          ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]" 
          : "border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-500 backdrop-blur-md"
      )}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center pointer-events-none">
        <UploadCloud className={clsx("w-16 h-16 mb-4 transition-colors", isDragging ? "text-primary" : "text-gray-400")} />
        <p className="mb-2 text-lg font-medium text-gray-200">
          <span className="text-primary font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-gray-500">SVG, PNG, JPG or WEBP (max. 800x400px)</p>
      </div>
    </div>
  );
};

'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/LanguageContext';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, selectedImage, onClear, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      }
    }
  }, [disabled]);

  const handleFileSelect = (file: File) => {
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Card className="overflow-hidden border-2 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
      {!selectedImage ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer transition-all duration-300
            border-2 border-dashed rounded-xl p-8 sm:p-12 md:p-16
            ${isDragging 
              ? 'border-green-500 bg-green-50 dark:bg-green-950/30 scale-[1.02] shadow-lg shadow-green-500/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50/50 dark:hover:bg-green-950/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className={`
              rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300
              ${isDragging 
                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white scale-110 shadow-xl shadow-green-500/50' 
                : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400'
              }
            `}>
              <Upload className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={2.5} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                {isDragging ? t('dropHere') : t('uploadImage')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
                {isDragging 
                  ? t('releaseToUpload')
                  : t('dragDropText')
                }
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('supportsFormats')}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              type="button" 
              disabled={disabled}
              className="border-2 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-500 transition-all duration-300 shadow-md"
              size="lg"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              {t('chooseImage')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="aspect-video w-full relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
            {previewUrl && (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
              </>
            )}
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleClear}
              disabled={disabled}
              className="shadow-xl hover:shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 transition-all duration-300 border-2 border-transparent hover:border-red-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-t-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">{selectedImage.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {(selectedImage.size / 1024).toFixed(2)} KB • {t('readyForAnalysis')}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/50 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">{t('uploadedBadge')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

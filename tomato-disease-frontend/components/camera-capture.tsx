'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Camera, X, SwitchCamera, Aperture, RotateCcw, CheckCircle2, AlertCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/LanguageContext';

interface CameraCaptureProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function CameraCapture({ onImageSelect, selectedImage, onClear, disabled }: CameraCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isFlashing, setIsFlashing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, [stream]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      // Stop existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setCameraError(t('cameraPermissionDenied'));
        } else if (err.name === 'NotFoundError') {
          setCameraError(t('cameraNotFound'));
        } else {
          setCameraError(t('cameraGenericError'));
        }
      } else {
        setCameraError(t('cameraGenericError'));
      }
    }
  }, [facingMode, stream, t]);

  const switchCamera = useCallback(async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (isCameraActive) {
      // Will restart with new facing mode
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: newMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
        setStream(mediaStream);
      } catch (err) {
        console.error('Error switching camera:', err);
      }
    }
  }, [facingMode, isCameraActive, stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    // Convert canvas to blob, then to File
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `camera-capture-${timestamp}.jpg`, { type: 'image/jpeg' });
        const url = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(url);
        onImageSelect(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.95);
  }, [onImageSelect, stopCamera]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    onClear();
    startCamera();
  }, [onClear, startCamera]);

  const handleClear = useCallback(() => {
    setCapturedImage(null);
    stopCamera();
    onClear();
  }, [onClear, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className="overflow-hidden border-2 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {!isCameraActive && !capturedImage && !selectedImage ? (
        /* Initial State - Open Camera Button */
        <div
          onClick={disabled ? undefined : startCamera}
          className={`
            relative cursor-pointer transition-all duration-300
            border-2 border-dashed rounded-xl p-8 sm:p-12 md:p-16
            border-gray-300 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 
            hover:bg-green-50/50 dark:hover:bg-green-950/20
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400 group-hover:scale-110">
               <Camera className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={2.5} />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                {t('openCamera')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
                {t('cameraDescription')}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <Video className="w-3.5 h-3.5" />
                <span>{t('cameraLivePreview')}</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={disabled}
              className="border-2 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-500 transition-all duration-300 shadow-md"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              {t('openCameraBtn')}
            </Button>
          </div>

          {cameraError && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">{cameraError}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{t('cameraRetryHint')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : isCameraActive ? (
        /* Live Camera Feed */
        <div className="relative">
          {/* Flash overlay */}
          <div
            className={`absolute inset-0 bg-white z-20 pointer-events-none transition-opacity duration-200 ${
              isFlashing ? 'opacity-80' : 'opacity-0'
            }`}
          />

          {/* Camera Viewfinder */}
          <div className="relative aspect-[4/3] sm:aspect-video w-full bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Viewfinder Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            </div>

            {/* Corner Brackets */}
            <div className="absolute inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/70 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/70 rounded-br-lg" />
            </div>

            {/* Camera status indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white">{t('cameraLive')}</span>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="p-3 sm:p-5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900">
            <div className="flex items-center justify-between">
              {/* Close Camera */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full w-11 h-11 sm:w-12 sm:h-12 touch-target"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>

              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                disabled={disabled}
                className="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 touch-target"
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-white/80 group-hover:border-white transition-colors" />
                {/* Inner circle */}
                <div className="absolute inset-2 rounded-full bg-white group-hover:bg-green-100 transition-all duration-300 shadow-lg shadow-white/20 flex items-center justify-center">
                  <Aperture className="w-7 h-7 text-gray-700 group-hover:text-green-600 transition-colors" />
                </div>
              </button>

              {/* Switch Camera */}
              <Button
                variant="ghost"
                size="icon"
                onClick={switchCamera}
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full w-11 h-11 sm:w-12 sm:h-12 touch-target"
              >
                <SwitchCamera className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Captured Image Preview */
        <div className="relative group">
          <div className="aspect-[4/3] sm:aspect-video w-full relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
            {capturedImage && (
              <>
                <img
                  src={capturedImage}
                  alt="Captured Preview"
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
              onClick={handleRetake}
              disabled={disabled}
              className="shadow-xl hover:shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-all duration-300 border-2 border-transparent hover:border-blue-300"
              title={t('retakePhoto')}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
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
                <p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">
                  {selectedImage?.name || t('capturedPhoto')}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {selectedImage && `${(selectedImage.size / 1024).toFixed(2)} KB • `}{t('readyForAnalysis')}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/50 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">{t('capturedBadge')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

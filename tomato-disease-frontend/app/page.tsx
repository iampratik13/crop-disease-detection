'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/image-upload';
import { CameraCapture } from '@/components/camera-capture';
import { DiseaseInfoDisplay } from '@/components/disease-info-display';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { DiseaseDetectionService } from '@/lib/api';
import { DiseaseInfo, getDiseaseInfoTranslated } from '@/lib/disease-data';
import { Leaf, Loader2, AlertCircle, Sparkles, ArrowRight, CheckCircle, Info, Globe, Upload, Camera } from 'lucide-react';
import { useLanguage, LanguageCode } from '@/lib/LanguageContext';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedDisease, setDetectedDisease] = useState<DiseaseInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [inputMode, setInputMode] = useState<'upload' | 'camera'>('upload');

  const { t, language, setLanguage } = useLanguage();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setDetectedDisease(null);
    setError(null);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setDetectedDisease(null);
    setError(null);
    setProgress(0);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Call the backend API
      const prediction = await DiseaseDetectionService.predictDisease(selectedImage);
      
      // Get disease information - using our translation layer
      const diseaseInfo = getDiseaseInfoTranslated(prediction, language);
      
      if (diseaseInfo) {
        setDetectedDisease(diseaseInfo);
        setProgress(100);
      } else if (prediction === 'Invalid_leaf_image') {
        setError(t('invalidLeafImage'));
      } else {
        setError(`Unknown disease detected: ${prediction}. Please try another image.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please ensure the backend server is running on http://localhost:5001');
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Whenever language changes, if a disease is selected, re-fetch it in new language
  useState(() => {
    // We cannot use setDetectedDisease right inside render or an effect that would re-trigger predict
    // For simplicity, we assume we just live update via translate on the component. But if it's already generated,
    // we should ideally re-fetch getDiseaseInfoTranslated using the current detectedDisease.id
    // But let's assume it detects correctly and use useEffect.
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-green-200/20 dark:bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm safe-area-top">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl shadow-lg shadow-green-500/30 animate-float shrink-0">
                <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent truncate">
                  {t('appTitle')}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  {t('appSubtitle')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/50 dark:bg-gray-800/50 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 ml-0.5 sm:ml-1" />
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value as LanguageCode);
                    if (detectedDisease) {
                      const newInfo = getDiseaseInfoTranslated(detectedDisease.id, e.target.value as LanguageCode);
                      if (newInfo) setDetectedDisease(newInfo);
                    }
                  }}
                  className="bg-transparent text-xs sm:text-sm font-medium border-none outline-none focus:ring-0 text-gray-700 dark:text-gray-300 cursor-pointer touch-target"
                >
                  <option value="en">English</option>
                  <option value="mr">मराठी</option>
                  <option value="hi">हिंदी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                </select>
              </div>
            
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/50 rounded-full border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('systemActive')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fadeIn">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mobile-text-wrap px-2">
            {t('heroTitle')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t('heroSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Upload Section */}
          <div className="space-y-4 sm:space-y-6 animate-slideInLeft">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-green-100 dark:border-green-900/50 hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="truncate">{t('uploadAnalyzeTitle')}</span>
                </h2>
                {selectedImage && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/50 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('ready')}</span>
                  </div>
                )}
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-1 sm:p-1.5 gap-1">
                <button
                  onClick={() => { if (!isAnalyzing) setInputMode('upload'); }}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold 
                    transition-all duration-300 relative overflow-hidden touch-target
                    ${inputMode === 'upload'
                      ? 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-lg shadow-green-500/10'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }
                  `}
                  disabled={isAnalyzing}
                >
                  <Upload className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {t('uploadTab')}
                  {inputMode === 'upload' && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => { if (!isAnalyzing) setInputMode('camera'); }}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold 
                    transition-all duration-300 relative overflow-hidden touch-target
                    ${inputMode === 'camera'
                      ? 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-lg shadow-green-500/10'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }
                  `}
                  disabled={isAnalyzing}
                >
                  <Camera className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {t('cameraTab')}
                  {inputMode === 'camera' && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                  )}
                </button>
              </div>

              {/* Conditional Rendering: Upload or Camera */}
              {inputMode === 'upload' ? (
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onClear={handleClear}
                  disabled={isAnalyzing}
                />
              ) : (
                <CameraCapture
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onClear={handleClear}
                  disabled={isAnalyzing}
                />
              )}

              {selectedImage && !detectedDisease && (
                <div className="mt-6 space-y-4">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 group"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('analyzingBtn')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        {t('analyzeBtn')}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {isAnalyzing && (
                    <div className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800">
                      <Progress value={progress} className="w-full h-2" />
                      <p className="text-sm text-center text-green-700 dark:text-green-300 font-medium flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('analyzingProgress')} {progress}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Instructions */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">
                    {t('howToUseTitle')}
                  </h3>
                </div>
                <ol className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">1</span>
                    <span className="leading-relaxed">{t('step1')}</span>
                  </li>
                  <li className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">2</span>
                    <span className="leading-relaxed">{t('step2')}</span>
                  </li>
                  <li className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">3</span>
                    <span className="leading-relaxed">{t('step3')}</span>
                  </li>
                  <li className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">4</span>
                    <span className="leading-relaxed">{t('step4')}</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Right Column - Results Section */}
          <div className="space-y-4 sm:space-y-6 animate-slideInRight">
            {detectedDisease ? (
              <div className="space-y-4 animate-fadeIn">
                <DiseaseInfoDisplay disease={detectedDisease} />
                
                <Button 
                  onClick={handleClear}
                  variant="outline"
                  className="w-full border-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/30 dark:hover:to-emerald-950/30 hover:border-green-500 transition-all duration-300 group"
                  size="lg"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  {t('analyzeAnotherBtn')}
                </Button>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-12 md:p-16 shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[600px] hover:shadow-green-500/5 transition-all duration-300">
                <div className="text-center space-y-6 max-w-md animate-pulse-slow">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                    <Leaf className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600 dark:text-green-400 animate-float" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {t('readyToAnalyzeTitle')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('readyToAnalyzeSubtitle')}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span>{t('waitingForUpload')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
          <FeatureCard
            title={t('feature1Title')}
            description={t('feature1Desc')}
            icon="🔬"
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            title={t('feature2Title')}
            description={t('feature2Desc')}
            icon="📚"
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            title={t('feature3Title')}
            description={t('feature3Desc')}
            icon="🛡️"
            gradient="from-green-500 to-emerald-500"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 sm:mt-16 md:mt-20 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-md relative z-10 safe-area-bottom">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg sm:rounded-xl">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {t('appTitle')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
              {t('footerText1')}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>© 2025</span>
              <span>•</span>
              <span>{t('footerText2')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon, gradient }: { title: string; description: string; icon: string; gradient: string }) {
  return (
    <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 overflow-hidden hover:-translate-y-2">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <div className="relative">
        <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{icon}</div>
        <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
    </div>
  );
}

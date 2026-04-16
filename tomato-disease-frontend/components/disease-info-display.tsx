'use client';

import { DiseaseInfo, getSeverityVariant } from '@/lib/disease-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  AlertTriangle, 
  Leaf, 
  Droplet, 
  Shield, 
  Stethoscope, 
  Calendar,
  Wind,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface DiseaseInfoDisplayProps {
  disease: DiseaseInfo;
}

export function DiseaseInfoDisplay({ disease }: DiseaseInfoDisplayProps) {
  const isHealthy = disease.id === 'healthy';
  const { t } = useLanguage();

  return (
    <Card className="w-full shadow-2xl border-2 hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${isHealthy ? 'from-green-400 to-emerald-500' : 'from-orange-400 to-red-500'}`}></div>
      <CardHeader className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <CardTitle className="text-4xl flex items-center gap-4 group">
              <div className={`p-3 rounded-2xl ${isHealthy ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'} group-hover:scale-110 transition-transform duration-300`}>
                {isHealthy ? (
                  <CheckCircle2 className="w-10 h-10 text-green-500 animate-pulse" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-orange-500" />
                )}
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {disease.name}
              </span>
            </CardTitle>
            <CardDescription className="text-lg italic flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Leaf className="w-4 h-4" />
              {disease.scientificName}
            </CardDescription>
          </div>
          <Badge 
            variant={getSeverityVariant(disease.severity)} 
            className={`text-sm px-4 py-2 shadow-lg font-bold ${
              isHealthy ? 'bg-green-500 hover:bg-green-600' : ''
            }`}
          >
            {disease.severity.toUpperCase()}{t('severitySuffix')}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mt-6 leading-relaxed text-base border-l-4 border-green-500 pl-4 bg-green-50/50 dark:bg-green-950/20 p-4 rounded-r-lg">
          {disease.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-8 p-8">
        {!isHealthy && (
          <Alert className="border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 shadow-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-900 dark:text-orange-100 font-medium ml-2">
              ⚠️ {t('earlyDetectionWarning')}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={<Leaf className="w-6 h-6" />}
            title={t('affectedParts')}
            content={disease.affectedParts.join(', ')}
            gradient="from-green-500 to-emerald-500"
          />
          <InfoCard
            icon={<Wind className="w-6 h-6" />}
            title={t('spreadMethod')}
            content={disease.spreadMethod}
            gradient="from-blue-500 to-cyan-500"
          />
          <InfoCard
            icon={<Calendar className="w-6 h-6" />}
            title={t('seasonalOccurence')}
            content={disease.seasonalOccurrence}
            className="md:col-span-2"
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="symptoms" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <TabsTrigger value="symptoms" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-md rounded-lg py-3 font-semibold">
              <XCircle className="w-4 h-4 mr-2" />
              {t('symptomsTab')}
            </TabsTrigger>
            <TabsTrigger value="causes" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-md rounded-lg py-3 font-semibold">
              <Droplet className="w-4 h-4 mr-2" />
              {t('causesTab')}
            </TabsTrigger>
            <TabsTrigger value="treatment" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-md rounded-lg py-3 font-semibold">
              <Stethoscope className="w-4 h-4 mr-2" />
              {t('treatmentTab')}
            </TabsTrigger>
            <TabsTrigger value="prevention" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-md rounded-lg py-3 font-semibold">
              <Shield className="w-4 h-4 mr-2" />
              {t('preventionTab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  {t('symptomsTitle')}
                </h3>
                <ul className="space-y-3">
                  {disease.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="text-red-500 mt-0.5">●</span>
                      <span className="flex-1 leading-relaxed">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="causes" className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-500" />
                  {t('causesTitle')}
                </h3>
                <ul className="space-y-3">
                  {disease.causes.map((cause, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="text-blue-500 mt-0.5">●</span>
                      <span className="flex-1 leading-relaxed">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="treatment" className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-purple-500" />
                  {t('treatmentTitle')}
                </h3>
                {!isHealthy && (
                  <Alert className="mb-4 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                    <AlertDescription className="text-sm text-purple-900 dark:text-purple-100">
                      {t('followLabelsWarning')}
                    </AlertDescription>
                  </Alert>
                )}
                <ul className="space-y-3">
                  {disease.treatment.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="text-purple-500 mt-0.5">●</span>
                      <span className="flex-1 leading-relaxed">{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="prevention" className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  {t('preventionTitle')}
                </h3>
                <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                  <AlertDescription className="text-sm text-green-900 dark:text-green-100">
                    {t('preventionBetterWarning')}
                  </AlertDescription>
                </Alert>
                <ul className="space-y-3">
                  {disease.prevention.map((prevention, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 mt-0.5">●</span>
                      <span className="flex-1 leading-relaxed">{prevention}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  className?: string;
  gradient: string;
}

function InfoCard({ icon, title, content, className, gradient }: InfoCardProps) {
  return (
    <div className={`group relative border-2 rounded-xl p-6 space-y-3 overflow-hidden hover:shadow-lg transition-all duration-300 ${className || ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</span>
      </div>
      <p className="relative text-base leading-relaxed font-medium">{content}</p>
    </div>
  );
}

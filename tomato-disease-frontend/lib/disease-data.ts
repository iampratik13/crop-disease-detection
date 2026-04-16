export interface DiseaseInfo {
  id: string;
  name: string;
  scientificName: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  affectedParts: string[];
  spreadMethod: string;
  seasonalOccurrence: string;
  imageUrl?: string;
}

export const diseaseDatabase: Record<string, DiseaseInfo> = {
  "Bacterial_spot": {
    id: "bacterial_spot",
    name: "Bacterial Spot",
    scientificName: "Xanthomonas spp.",
    severity: "high",
    description: "Bacterial spot is one of the most devastating diseases of tomato and pepper in warm, moist climates. It can cause significant yield losses and fruit quality reduction.",
    symptoms: [
      "Small, dark brown to black spots on leaves with yellow halos",
      "Raised, dark brown lesions on fruits",
      "Leaves may turn yellow and drop prematurely",
      "Fruit spots are slightly raised with a white halo",
      "Severe defoliation in advanced stages"
    ],
    causes: [
      "Bacteria Xanthomonas campestris pv. vesicatoria",
      "Warm temperatures (75-86°F / 24-30°C)",
      "High humidity and moisture on leaves",
      "Contaminated seeds or transplants",
      "Splash from rain or overhead irrigation"
    ],
    treatment: [
      "Apply copper-based bactericides at first sign of disease",
      "Use antibiotic sprays containing streptomycin (where permitted)",
      "Remove and destroy infected plant parts immediately",
      "Improve air circulation by proper plant spacing",
      "Apply treatments every 7-10 days during wet conditions"
    ],
    prevention: [
      "Use disease-free certified seeds and transplants",
      "Rotate crops for at least 3 years with non-host plants",
      "Use drip irrigation instead of overhead watering",
      "Apply preventive copper sprays before disease appears",
      "Remove volunteer tomato plants and weeds",
      "Stake and prune plants for better air circulation",
      "Avoid working in fields when plants are wet"
    ],
    affectedParts: ["Leaves", "Stems", "Fruits"],
    spreadMethod: "Water splash, infected seeds, contaminated tools",
    seasonalOccurrence: "Common during warm, humid weather in summer"
  },
  
  "Early_blight": {
    id: "early_blight",
    name: "Early Blight",
    scientificName: "Alternaria solani",
    severity: "medium",
    description: "Early blight is a common fungal disease that affects tomato plants throughout the growing season. It primarily attacks older leaves and can significantly reduce yield if left untreated.",
    symptoms: [
      "Dark brown spots with concentric rings (bull's-eye pattern)",
      "Lesions typically start on older, lower leaves",
      "Yellowing of leaves around the spots",
      "Stem lesions appear as dark, sunken areas",
      "Premature leaf drop and defoliation",
      "Fruit lesions near the stem with concentric rings"
    ],
    causes: [
      "Fungus Alternaria solani",
      "Warm temperatures (75-85°F / 24-29°C)",
      "High humidity and wet conditions",
      "Poor nutrition and plant stress",
      "Dense plant canopy with poor air circulation"
    ],
    treatment: [
      "Apply fungicides containing chlorothalonil, mancozeb, or copper",
      "Remove infected leaves and plant debris",
      "Improve air circulation around plants",
      "Apply fungicides every 7-14 days during favorable conditions",
      "Use organic options like neem oil or Bacillus subtilis"
    ],
    prevention: [
      "Practice 3-4 year crop rotation",
      "Use resistant or tolerant varieties",
      "Mulch around plants to prevent soil splash",
      "Water at the base of plants, avoid wetting foliage",
      "Maintain proper plant nutrition, especially nitrogen",
      "Space plants adequately for air circulation",
      "Remove and destroy crop debris after harvest",
      "Apply preventive fungicide sprays early in season"
    ],
    affectedParts: ["Leaves", "Stems", "Fruits"],
    spreadMethod: "Wind-borne spores, water splash, contaminated soil",
    seasonalOccurrence: "Throughout growing season, especially mid to late summer"
  },

  "Late_blight": {
    id: "late_blight",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    severity: "high",
    description: "Late blight is the most destructive disease of tomato, famous for causing the Irish potato famine. It can destroy entire crops within days under favorable conditions.",
    symptoms: [
      "Large, irregular, water-soaked lesions on leaves",
      "Gray-white fuzzy growth on leaf undersides (in humid conditions)",
      "Brown-black lesions that spread rapidly",
      "Entire leaves turn brown and die quickly",
      "Firm, brown, greasy-looking lesions on fruits",
      "White mold may appear on infected areas",
      "Rapid plant collapse in severe cases"
    ],
    causes: [
      "Oomycete Phytophthora infestans",
      "Cool, wet weather (60-70°F / 15-21°C)",
      "High humidity (>90%) for extended periods",
      "Extended leaf wetness (10+ hours)",
      "Infected potato or tomato plants nearby"
    ],
    treatment: [
      "Apply systemic fungicides immediately (mefenoxam, cymoxanil)",
      "Use contact fungicides like chlorothalonil or mancozeb",
      "Remove and destroy all infected plants completely",
      "Apply fungicides every 5-7 days in wet weather",
      "Do not compost infected material - burn or bag it"
    ],
    prevention: [
      "Plant resistant varieties when available",
      "Use certified disease-free transplants",
      "Avoid planting near potato fields",
      "Provide excellent air circulation and drainage",
      "Use drip irrigation only",
      "Apply preventive fungicides before disease appears",
      "Monitor weather for blight-favorable conditions",
      "Remove volunteer tomato and potato plants",
      "Practice wide crop rotation (3+ years)"
    ],
    affectedParts: ["Leaves", "Stems", "Fruits", "Entire plant"],
    spreadMethod: "Airborne spores, water splash, infected plant material",
    seasonalOccurrence: "Cool, wet periods typically in late summer/early fall"
  },

  "Leaf_Mold": {
    id: "leaf_mold",
    name: "Leaf Mold",
    scientificName: "Passalora fulva (formerly Fulvia fulva)",
    severity: "medium",
    description: "Leaf mold is primarily a problem in greenhouse and high tunnel tomatoes where humidity is high. It rarely affects field-grown tomatoes except in very humid climates.",
    symptoms: [
      "Pale yellow spots on upper leaf surfaces",
      "Olive-green to grayish-purple velvety growth on leaf undersides",
      "Older leaves are affected first",
      "Leaves may curl, wither, and drop",
      "Rarely affects fruits directly",
      "Reduced plant vigor and yield"
    ],
    causes: [
      "Fungus Passalora fulva",
      "High humidity (>85%) for extended periods",
      "Poor air circulation in greenhouses",
      "Moderate temperatures (70-75°F / 21-24°C)",
      "Dense plant canopy"
    ],
    treatment: [
      "Reduce humidity levels below 85%",
      "Improve ventilation and air circulation",
      "Remove and destroy infected leaves",
      "Apply fungicides containing chlorothalonil or mancozeb",
      "Increase spacing between plants",
      "Use fans to improve air movement in greenhouses"
    ],
    prevention: [
      "Use resistant varieties (most modern varieties have resistance)",
      "Maintain greenhouse humidity below 85%",
      "Ensure proper ventilation and air circulation",
      "Space plants adequately",
      "Remove lower leaves to improve air flow",
      "Heat greenhouses to reduce humidity at night",
      "Avoid overhead watering",
      "Sanitize greenhouse structures between crops"
    ],
    affectedParts: ["Leaves (primarily lower leaves)"],
    spreadMethod: "Airborne spores, water splash, contaminated tools",
    seasonalOccurrence: "Year-round in greenhouses, late summer in humid field conditions"
  },

  "Septoria_leaf_spot": {
    id: "septoria_leaf_spot",
    name: "Septoria Leaf Spot",
    scientificName: "Septoria lycopersici",
    severity: "medium",
    description: "Septoria leaf spot is one of the most common tomato diseases, particularly in areas with frequent rainfall and warm temperatures. It can cause significant defoliation if not managed.",
    symptoms: [
      "Small, circular spots with dark borders and gray centers",
      "Tiny black dots (fruiting bodies) in the center of spots",
      "Spots first appear on lower, older leaves",
      "Yellowing around the spots",
      "Progressive defoliation from bottom to top of plant",
      "Usually doesn't affect fruits directly"
    ],
    causes: [
      "Fungus Septoria lycopersici",
      "Warm temperatures (68-77°F / 20-25°C)",
      "High humidity and frequent rain",
      "Overhead irrigation wetting foliage",
      "Infected plant debris in soil"
    ],
    treatment: [
      "Apply fungicides containing chlorothalonil, mancozeb, or copper",
      "Remove infected lower leaves immediately",
      "Improve air circulation around plants",
      "Apply treatments every 7-10 days during wet weather",
      "Mulch to prevent soil splash onto leaves"
    ],
    prevention: [
      "Use 3-year crop rotation with non-solanaceous crops",
      "Apply mulch to prevent spore splash from soil",
      "Water at plant base, avoid wetting leaves",
      "Space plants properly for air circulation",
      "Remove lower leaves as plants grow",
      "Stake or cage plants to keep foliage off ground",
      "Remove all crop debris at end of season",
      "Apply preventive fungicides in wet weather",
      "Use resistant varieties where available"
    ],
    affectedParts: ["Leaves (older leaves first)"],
    spreadMethod: "Water splash, rain, contaminated soil and debris",
    seasonalOccurrence: "Mid to late summer during warm, wet periods"
  },

  "Spider_mites Two-spotted_spider_mite": {
    id: "spider_mites",
    name: "Two-Spotted Spider Mite",
    scientificName: "Tetranychus urticae",
    severity: "medium",
    description: "Spider mites are tiny arachnids that suck plant juices, causing stippling and bronzing of leaves. They thrive in hot, dry conditions and can build up rapidly.",
    symptoms: [
      "Fine stippling or speckling on leaves (tiny yellow/white dots)",
      "Bronzing or silvery appearance of leaves",
      "Fine webbing on undersides of leaves and plant tips",
      "Leaves may turn yellow, brown, and drop",
      "Stunted plant growth in severe infestations",
      "Reduced fruit size and yield"
    ],
    causes: [
      "Two-spotted spider mite (Tetranychus urticae)",
      "Hot, dry weather conditions",
      "Dusty conditions",
      "Drought-stressed plants",
      "Overuse of broad-spectrum insecticides killing natural predators"
    ],
    treatment: [
      "Spray plants with strong water stream to dislodge mites",
      "Apply insecticidal soap or horticultural oil",
      "Use miticides specifically labeled for spider mites",
      "Release predatory mites (Phytoseiulus persimilis)",
      "Repeat treatments every 5-7 days to target new generations",
      "Focus spray on leaf undersides where mites congregate"
    ],
    prevention: [
      "Maintain adequate soil moisture to reduce plant stress",
      "Avoid excessive nitrogen fertilization",
      "Encourage beneficial insects (ladybugs, lacewings)",
      "Remove weeds that can harbor mites",
      "Use overhead irrigation occasionally to increase humidity",
      "Monitor plants regularly, especially in hot weather",
      "Avoid broad-spectrum insecticides",
      "Use reflective mulches to deter mites",
      "Plant resistant varieties if available"
    ],
    affectedParts: ["Leaves", "Stems", "Entire plant in severe cases"],
    spreadMethod: "Wind, contaminated tools, infested plants, clothing",
    seasonalOccurrence: "Hot, dry summer months (peak in mid-summer)"
  },

  "Target_Spot": {
    id: "target_spot",
    name: "Target Spot",
    scientificName: "Corynespora cassiicola",
    severity: "medium",
    description: "Target spot is an increasingly important disease of tomato, especially in warm, humid regions. It can affect leaves, stems, and fruits, causing significant yield losses.",
    symptoms: [
      "Brown lesions with concentric rings (target-like pattern)",
      "Lesions have tan to brown centers with dark margins",
      "Spots larger than early blight lesions (up to 1/2 inch)",
      "Leaves may develop yellow halos around spots",
      "Stem cankers in severe infections",
      "Fruit lesions are dark, sunken, and pitted"
    ],
    causes: [
      "Fungus Corynespora cassiicola",
      "Warm temperatures (75-90°F / 24-32°C)",
      "High humidity and frequent rainfall",
      "Extended periods of leaf wetness",
      "Poor air circulation"
    ],
    treatment: [
      "Apply fungicides containing azoxystrobin, chlorothalonil, or mancozeb",
      "Remove and destroy infected plant parts",
      "Improve air circulation and reduce humidity",
      "Apply treatments every 7-14 days during favorable conditions",
      "Use systemic fungicides for better protection"
    ],
    prevention: [
      "Practice crop rotation (minimum 2-3 years)",
      "Use drip irrigation instead of overhead watering",
      "Space plants adequately for air flow",
      "Mulch to prevent soil splash",
      "Remove crop debris promptly after harvest",
      "Avoid working with plants when wet",
      "Apply preventive fungicides early in season",
      "Use disease-free transplants"
    ],
    affectedParts: ["Leaves", "Stems", "Fruits"],
    spreadMethod: "Water splash, wind-blown rain, contaminated equipment",
    seasonalOccurrence: "Warm, humid periods especially late summer"
  },

  "Tomato_Yellow_Leaf_Curl_Virus": {
    id: "tylcv",
    name: "Tomato Yellow Leaf Curl Virus",
    scientificName: "Begomovirus (TYLCV)",
    severity: "high",
    description: "TYLCV is one of the most devastating tomato diseases worldwide. It's transmitted by whiteflies and can cause complete crop loss. Once infected, plants cannot be cured.",
    symptoms: [
      "Severe upward curling of leaf margins",
      "Bright yellow color between leaf veins",
      "Reduced leaf size (smaller, distorted leaves)",
      "Stunted plant growth and bushy appearance",
      "Flower drop and poor fruit set",
      "Severely reduced or no fruit production",
      "Plants remain green but fail to grow"
    ],
    causes: [
      "Tomato Yellow Leaf Curl Virus (TYLCV)",
      "Transmitted by silverleaf whitefly (Bemisia tabaci)",
      "Warm temperatures favoring whitefly populations",
      "Infected transplants or nearby infected plants",
      "High whitefly populations"
    ],
    treatment: [
      "No cure available - focus on prevention",
      "Remove and destroy infected plants immediately",
      "Control whitefly populations aggressively",
      "Use systemic insecticides for whitefly control",
      "Install yellow sticky traps to monitor whiteflies",
      "Apply insecticidal soaps or oils",
      "Isolate infected areas to prevent spread"
    ],
    prevention: [
      "Use TYLCV-resistant or tolerant varieties (highly recommended)",
      "Start with certified virus-free transplants",
      "Use insect-proof screens in greenhouses (50-mesh or finer)",
      "Apply reflective mulches to repel whiteflies",
      "Control whiteflies before planting with soil treatments",
      "Maintain rigorous whitefly control throughout season",
      "Remove infected plants and weeds immediately",
      "Avoid planting near infected crops",
      "Plant early to avoid peak whitefly populations",
      "Use companion planting to deter whiteflies"
    ],
    affectedParts: ["Leaves", "Entire plant growth"],
    spreadMethod: "Whitefly vector (Bemisia tabaci) only",
    seasonalOccurrence: "Year-round in warm climates, summer in temperate zones"
  },

  "Tomato_mosaic_virus": {
    id: "tomv",
    name: "Tomato Mosaic Virus",
    scientificName: "Tobamovirus (ToMV)",
    severity: "high",
    description: "Tomato mosaic virus is extremely contagious and can survive in soil and on surfaces for years. It spreads mechanically through contact and can devastate tomato crops.",
    symptoms: [
      "Mottled light and dark green mosaic pattern on leaves",
      "Distorted, fern-like leaves (narrow, elongated leaflets)",
      "Stunted plant growth",
      "Yellow streaking on stems and leaf veins",
      "Uneven fruit ripening with yellow blotches",
      "Brown necrotic spots on fruits",
      "Reduced fruit size and quality",
      "Internal browning of fruits"
    ],
    causes: [
      "Tomato Mosaic Virus (ToMV)",
      "Mechanical transmission through handling infected plants",
      "Contaminated tools, hands, and clothing",
      "Infected seeds (virus inside seed coat)",
      "Extremely stable virus surviving on surfaces",
      "Tobacco products can transmit related viruses"
    ],
    treatment: [
      "No cure - remove and destroy infected plants",
      "Disinfect tools with 10% bleach solution or alcohol",
      "Wash hands thoroughly with soap before handling plants",
      "Do not compost infected plants",
      "Sterilize greenhouse structures and equipment",
      "Avoid touching healthy plants after touching infected ones"
    ],
    prevention: [
      "Use resistant varieties (Tm-2 or Tm-22 genes)",
      "Purchase certified virus-free seeds and transplants",
      "Sanitize all tools, stakes, and equipment regularly",
      "Wash hands with soap and water before working with plants",
      "Avoid tobacco use around tomato plants",
      "Don't save seeds from infected plants",
      "Control aphids and other potential vectors",
      "Remove and destroy infected plants immediately",
      "Heat-treat seeds (122°F for 25 minutes) to kill virus",
      "Practice strict greenhouse sanitation",
      "Use new or sterilized growing media"
    ],
    affectedParts: ["Leaves", "Fruits", "Entire plant"],
    spreadMethod: "Mechanical contact, contaminated tools, infected seeds",
    seasonalOccurrence: "Can occur anytime during growing season"
  },

  "Healthy": {
    id: "healthy",
    name: "Healthy Tomato Plant",
    scientificName: "Solanum lycopersicum",
    severity: "low",
    description: "This is a healthy tomato plant showing no signs of disease or pest damage. Healthy plants have vibrant green leaves, strong stems, and good overall vigor.",
    symptoms: [
      "No symptoms - this is a healthy plant!"
    ],
    causes: [
      "Proper plant care and maintenance",
      "Good growing conditions",
      "Adequate nutrition and water",
      "Disease prevention practices"
    ],
    treatment: [
      "No treatment needed - maintain current care practices",
      "Continue regular monitoring for any changes",
      "Keep up with preventive measures"
    ],
    prevention: [
      "Continue regular watering and fertilization",
      "Monitor plants regularly for any changes",
      "Maintain good air circulation",
      "Practice crop rotation",
      "Use mulch to maintain soil moisture",
      "Remove any weeds competing for nutrients",
      "Stake or cage plants properly",
      "Apply preventive treatments if weather conditions favor disease"
    ],
    affectedParts: ["None"],
    spreadMethod: "Not applicable",
    seasonalOccurrence: "Maintain health throughout growing season"
  }
};

// Helper function to get disease info by name
export function getDiseaseInfo(diseaseName: string): DiseaseInfo | null {
  // Normalize the disease name to match our keys
  const normalizedName = diseaseName.trim();
  return diseaseDatabase[normalizedName] || null;
}

// Get all diseases
export function getAllDiseases(): DiseaseInfo[] {
  return Object.values(diseaseDatabase);
}

// Get severity color
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

// Get severity variant for badge
export function getSeverityVariant(severity: string): "default" | "destructive" | "outline" | "secondary" {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
}
import { diseaseTranslations } from './disease-data-translations';
import { LanguageCode } from './LanguageContext';

export function getDiseaseInfoTranslated(diseaseName: string, languageCode: LanguageCode): DiseaseInfo | null {
  const normalizedName = diseaseName.trim();
  const baseDisease = diseaseDatabase[normalizedName] || Object.values(diseaseDatabase).find(d => d.id === normalizedName);
  if (!baseDisease) return null;

  if (languageCode === 'en') return baseDisease;

  const langTranslations = diseaseTranslations[languageCode];
  const translated = langTranslations ? langTranslations[baseDisease.id] : null;

  if (translated) {
    return {
      ...baseDisease,
      ...translated,
    } as DiseaseInfo;
  }

  return baseDisease;
}

// Mock sensor data generator for demo mode
export interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  soilPH: number;
  lightIntensity: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: "warning" | "critical" | "info";
  message: string;
  timestamp: string;
  sensor: string;
}

export interface CropPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  market: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  region: string;
  link: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type: "irrigation" | "fertilizer" | "pest" | "harvest";
}

export function generateSensorData(): SensorData {
  return {
    soilMoisture: Math.round(45 + Math.random() * 30),
    temperature: Math.round((25 + Math.random() * 12) * 10) / 10,
    humidity: Math.round(55 + Math.random() * 25),
    soilPH: Math.round((6.0 + Math.random() * 1.5) * 10) / 10,
    lightIntensity: Math.round(400 + Math.random() * 600),
    timestamp: new Date().toISOString(),
  };
}

export function generateHistoricalData(hours: number = 24): SensorData[] {
  const data: SensorData[] = [];
  const now = Date.now();
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now - i * 3600000);
    data.push({
      soilMoisture: Math.round(40 + Math.sin(i / 4) * 10 + Math.random() * 5),
      temperature: Math.round((22 + Math.sin(i / 6) * 8 + Math.random() * 2) * 10) / 10,
      humidity: Math.round(50 + Math.cos(i / 5) * 15 + Math.random() * 5),
      soilPH: Math.round((6.2 + Math.sin(i / 8) * 0.5 + Math.random() * 0.2) * 10) / 10,
      lightIntensity: Math.round(Math.max(0, 500 + Math.sin((i - 6) / 3.8) * 450 + Math.random() * 50)),
      timestamp: t.toISOString(),
    });
  }
  return data;
}

export const mockAlerts: Alert[] = [
  { id: "1", type: "warning", message: "Soil moisture below threshold (35%)", timestamp: new Date(Date.now() - 300000).toISOString(), sensor: "Soil Moisture" },
  { id: "2", type: "critical", message: "Temperature exceeding 38°C", timestamp: new Date(Date.now() - 600000).toISOString(), sensor: "Temperature" },
  { id: "3", type: "info", message: "Light intensity optimal for growth", timestamp: new Date(Date.now() - 1200000).toISOString(), sensor: "Light" },
  { id: "4", type: "warning", message: "Humidity dropping rapidly", timestamp: new Date(Date.now() - 1800000).toISOString(), sensor: "Humidity" },
];

export const mockCropPrices: CropPrice[] = [
  { crop: "Wheat", price: 2275, unit: "₹/quintal", change: 2.3, market: "APMC Pune" },
  { crop: "Rice", price: 3150, unit: "₹/quintal", change: -1.1, market: "APMC Mumbai" },
  { crop: "Soybean", price: 4800, unit: "₹/quintal", change: 5.2, market: "APMC Nagpur" },
  { crop: "Cotton", price: 6200, unit: "₹/quintal", change: 0.8, market: "APMC Aurangabad" },
  { crop: "Sugarcane", price: 3100, unit: "₹/tonne", change: -0.5, market: "APMC Kolhapur" },
  { crop: "Onion", price: 1850, unit: "₹/quintal", change: 12.4, market: "APMC Nashik" },
];

export const mockSchemes: GovernmentScheme[] = [
  { id: "1", name: "PM-KISAN", description: "Income support of ₹6000/year to farmer families", eligibility: "All land-holding farmer families", region: "All India", link: "https://pmkisan.gov.in/" },
  { id: "2", name: "Pradhan Mantri Fasal Bima Yojana", description: "Crop insurance scheme at subsidized premium", eligibility: "All farmers growing notified crops", region: "All India", link: "https://pmfby.gov.in/" },
  { id: "3", name: "Soil Health Card Scheme", description: "Free soil testing and health card for nutrients info", eligibility: "All farmers", region: "All India", link: "https://soilhealth.dac.gov.in/" },
  { id: "4", name: "National Agriculture Market (e-NAM)", description: "Pan-India electronic trading portal to network APMC mandis", eligibility: "Farmers, Traders, FPOs", region: "All India", link: "https://enam.gov.in/web/" },
  { id: "5", name: "Kisan Credit Card (KCC)", description: "Short-term credit for crop production needs at concessional interest", eligibility: "All farmers, fishermen, animal husbandry", region: "All India", link: "https://www.myscheme.gov.in/schemes/kcc" },
  { id: "6", name: "Pradhan Mantri Krishi Sinchayee Yojana", description: "Subsidies on agriculture irrigation equipment (Micro irrigation)", eligibility: "All farmers", region: "All India", link: "https://pmksy.gov.in/" },
  { id: "7", name: "Agriculture Infrastructure Fund", description: "Medium-long term debt financing for post-harvest management infrastructure", eligibility: "FPOs, Agri-entrepreneurs", region: "All India", link: "https://agriinfra.dac.gov.in/" },
];

export const mockTasks: Task[] = [
  { id: "1", title: "Irrigate Field A - Zone 2", dueDate: "2026-03-02T08:00:00", completed: false, type: "irrigation" },
  { id: "2", title: "Apply NPK fertilizer", dueDate: "2026-03-03T06:00:00", completed: false, type: "fertilizer" },
  { id: "3", title: "Pest inspection - west block", dueDate: "2026-03-02T16:00:00", completed: true, type: "pest" },
  { id: "4", title: "Harvest tomatoes - greenhouse", dueDate: "2026-03-04T07:00:00", completed: false, type: "harvest" },
];

export const cropRecommendations = [
  { crop: "Wheat", confidence: 92, season: "Rabi", soil: "Loamy", water: "Moderate" },
  { crop: "Chickpea", confidence: 87, season: "Rabi", soil: "Loamy", water: "Low" },
  { crop: "Mustard", confidence: 81, season: "Rabi", soil: "Sandy Loam", water: "Low" },
  { crop: "Potato", confidence: 78, season: "Rabi", soil: "Loamy", water: "Moderate" },
  { crop: "Onion", confidence: 74, season: "Rabi", soil: "Sandy Loam", water: "Moderate" },
];

export const diseaseResults = [
  { name: "Tomato Late Blight", confidence: 94.2, treatment: "Apply copper-based fungicide. Remove affected leaves. Improve air circulation around plants." },
  { name: "Powdery Mildew", confidence: 88.7, treatment: "Apply neem oil spray. Ensure adequate spacing between plants. Avoid overhead watering." },
  { name: "Bacterial Leaf Spot", confidence: 72.1, treatment: "Use copper hydroxide spray. Remove infected plant debris. Rotate crops annually." },
];

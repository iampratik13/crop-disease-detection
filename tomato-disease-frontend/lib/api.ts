const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface PredictionResponse {
  prediction: string;
  confidence?: number;
}

export class DiseaseDetectionService {
  /**
   * Predict disease from uploaded image
   */
  static async predictDisease(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.statusText}`);
      }

      // The Flask backend returns plain text with the disease name
      const result = await response.text();
      return result.trim();
    } catch (error) {
      console.error('Error predicting disease:', error);
      throw new Error('Failed to predict disease. Please ensure the backend server is running.');
    }
  }

  /**
   * Check if the API server is available
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

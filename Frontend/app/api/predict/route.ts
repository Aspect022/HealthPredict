import { NextRequest, NextResponse } from 'next/server';

// Define types for request and response
interface PredictionRequest {
  age: number | string;
  blood_pressure: number | string;
  cholesterol: number | string;
  glucose: number | string;
}

interface PredictionResponse {
  disease: string;
  confidence: number;
}

interface ErrorResponse {
  error: string;
}

/**
 * API route to forward medical form data to FastAPI backend
 */
export async function POST(request: NextRequest): Promise<NextResponse<PredictionResponse | ErrorResponse>> {
  try {
    // Parse the request body
    const body: PredictionRequest = await request.json();
    const { age, blood_pressure, cholesterol, glucose } = body;
    
    // Validate required fields
    if (!age || !blood_pressure || !cholesterol || !glucose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Forward the request to the FastAPI backend
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: parseInt(age.toString()),
        blood_pressure: parseInt(blood_pressure.toString()),
        cholesterol: parseInt(cholesterol.toString()),
        glucose: parseInt(glucose.toString()),
      }),
    });

    // If the FastAPI response is not OK, throw an error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error from prediction service');
    }

    // Get the prediction result
    const predictionResult: PredictionResponse = await response.json();

    // Return the prediction result to the frontend
    return NextResponse.json(predictionResult);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get prediction' }, 
      { status: 500 }
    );
  }
}
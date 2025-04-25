import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { disease, parameters, prediction, probability } = await request.json()

    // Check if we have the API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Create a prompt based on the disease type and parameters
    let prompt = ""

    if (disease === "diabetes") {
      const gender = parameters.gender === 0 ? "male" : "female"
      const hypertension = parameters.hypertension === 1 ? "has" : "does not have"
      const heartDisease = parameters.heart_disease === 1 ? "has" : "does not have"
      let smokingStatus = "never smoked"

      if (parameters.smoking_history === 1) {
        smokingStatus = "is a current smoker"
      } else if (parameters.smoking_history === 2) {
        smokingStatus = "is a former smoker"
      } else if (parameters.smoking_history === 3) {
        smokingStatus = "has no information about smoking history"
      }

      prompt = `
You are a highly qualified medical AI assistant with expertise in clinical diagnosis, human biology, chemistry, and statistical modeling.

Based on the input parameters, our machine learning model predicts that this individual ${prediction === 1 ? "has" : "does not have"} a high risk of ${disease}, with a confidence score of ${(probability * 100).toFixed(2)}%.

Generate a structured medical summary (200 words) that includes:

1. A breakdown of each biological and chemical marker (e.g., glucose, BMI, blood pressure, cholesterol) and its clinical significance in relation to ${disease}.
2. How these parameters influence cellular, metabolic, or hormonal processes associated with ${disease}.
3. Statistical relevance of these factors (e.g., thresholds, ranges, percentiles, correlations).
4. A concise explanation of how the model likely made this prediction based on these variables.
5. Actionable, non-alarming insights on health management tailored to these factors.

The language should be medically accurate yet simplified for a non-medical audience. Avoid generic advice. Do not use disclaimers or repeat that this is not a medical diagnosis. Only focus on diagnosis insights and risk interpretation—precise, informative, and insightful.
`
      
    } else {
      // Default prompt for other diseases
      prompt = `
        You are a medical AI assistant providing a summary of health risk factors.
        
        Based on the provided parameters, our prediction model indicates this person ${prediction === 1 ? "has" : "does not have"} a high risk of ${disease}, with a confidence of ${(probability * 100).toFixed(2)}%.
        
        Please provide a concise, informative summary (about 150-200 words) explaining what this means, potential risk factors, and general advice.

        Make sure your tone is empathetic and informative, not alarming.
Always encourage users to consult licensed medical professionals for critical issues.
        
        Keep your tone professional but compassionate, and emphasize that this is not a medical diagnosis.
      `
    }

    // Make the call to the Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,  // Secure your key in environment variables
      },
    
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 60,
          topP: 0.95,
          maxOutputTokens: 400,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error("Failed to get response from Gemini API")
    }

    const data = await response.json()

    // Extract the response text from the Gemini API response
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a summary at this time."

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error in AI summary API:", error)
    return NextResponse.json({ error: "Failed to get summary from AI" }, { status: 500 })
  }
}
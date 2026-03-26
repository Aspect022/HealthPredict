from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import fitz
import google.generativeai as genai
from config.settings import settings

pdf_router = APIRouter()

# Configure Gemini AI
genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel(model_name=settings.gemini_model_name)

@pdf_router.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = "".join(page.get_text() for page in doc)

        prompt = (
            "You are a medical expert AI. Analyze the following medical document in depth. "
            "Extract diagnoses, medications, possible conditions, patient history, future risk factors, "
            "suggested tests, and anything useful from a doctor's perspective.\n\n"
            f"Medical Document:\n{text}"
        )
        response = model.generate_content(prompt)
        return {"analysis": response.text}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"PDF analysis failed: {str(e)}"})
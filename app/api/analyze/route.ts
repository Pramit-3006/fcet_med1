import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { imageData, fileName, fileType } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a medical AI assistant specialized in analyzing medical images. Please analyze this medical image and provide:

1. **Image Type**: Identify the type of medical scan (X-ray, CT, MRI, ultrasound, etc.)
2. **Anatomical Region**: What body part/region is shown
3. **Key Observations**: Notable findings, abnormalities, or normal structures
4. **Potential Concerns**: Any areas that may require attention (if any)
5. **Recommendations**: Suggested next steps or additional imaging if needed

Please be thorough but remember this is for educational/screening purposes only and should not replace professional medical diagnosis.

Image filename: ${fileName}
Image type: ${fileType}`,
            },
            {
              type: "image",
              image: imageData,
            },
          ],
        },
      ],
      maxTokens: 1000,
    })

    const analysisResult = {
      id: Math.random().toString(36).substr(2, 9),
      fileName,
      fileType,
      timestamp: new Date().toISOString(),
      analysis: text,
      confidence: Math.random() * 0.3 + 0.7, // Simulated confidence score
      status: "completed",
    }

    return NextResponse.json({ result: analysisResult })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze image. Please try again." }, { status: 500 })
  }
}

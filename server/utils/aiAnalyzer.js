import dotenv from "dotenv";
dotenv.config();

export const analyzeWithGemini = async (resumeText, jobDescription) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set in environment variables");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt(resumeText, jobDescription),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Gemini API request failed");
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("No text content in Gemini response");
    }

    // Clean + parse JSON safely
    try {
      const cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (parseError) {
      console.warn(
        "Failed to parse Gemini response as JSON, returning raw text.",
        parseError
      );

      return {
        success: false,
        raw_model_output: rawText,
      };
    }
  } catch (error) {
    console.error("Unexpected error in analyzeWithGemini:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

const buildPrompt = (resumeText, jobDescription) => `
You are an ATS resume analyzer.

Return STRICT JSON only.
Do not wrap in markdown.
Do not include backticks.
Do not include explanations.

Use this exact schema:

{
  "success": true,
  "analysis": {
    "resume_skills": [],
    "job_description_skills": [],
    "missing_skills": {
      "from_resume_for_job_description": [],
      "from_job_description_for_resume": []
    },
    "ats_optimized_bullet_point_improvements": [
      { "original_summary": "",
        "suggested_bullets": [],
        "reasoning": ""
      }
    ],
    "ats_optimization_tips": [],
    "compatibility_score": 0,
    "overall_assessment": ""
  }
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;
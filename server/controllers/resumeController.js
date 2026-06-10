import { parseResume } from "../utils/resumeParser.js";
import {extractKeywords} from "../utils/keywordExtractor.js";
import { calculateATSScore } from "../utils/atsScore.js";
import { analyzeWithGemini } from "../utils/aiAnalyzer.js";

export const uploadResume = async (req,res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: "No file uploaded" });
        }
        const uint8Array = new Uint8Array(req.file.buffer);
        const extractedText = await parseResume(uint8Array);
        if(!extractedText || extractedText.trim().length === 0){
            return res.status(400).json({ message: "Failed to extract text from resume" });
        }
        res.json({ 
            success: true,
            preview: extractedText.substring(0, 500),
            text: extractedText
         });
    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing resumeText or jobDescription" });
    }

    // Keyword extraction
    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);

    // ATS Score
    const score = calculateATSScore(jdKeywords, resumeKeywords);

    console.log("ATS Score:", score);

    // Gemini AI analysis
    const suggestions = await analyzeWithGemini(resumeText, jobDescription);

    res.json({
      success: true,
      score,
      suggestions});

  } catch (err) {
    console.error("Analyze Resume Error:", err);
    res.status(500).json({ error: err.message });
  }
};
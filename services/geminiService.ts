
import { GoogleGenAI, Type } from "@google/genai";
import { CivicIssueAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeIssue = async (
  imageBase64: string | null,
  videoBase64: string | null,
  audioBase64: string | null,
  description: string,
  history: CivicIssueAnalysis[] = [],
  location?: { lat: number; lng: number }
): Promise<CivicIssueAnalysis> => {
  // Using 'gemini-3-pro-preview' for high capability analysis
  const modelId = "gemini-3-pro-preview"; 

  // Summarize history for context
  const historyContext = history.length > 0
    ? history.map((h, i) => `Issue ${i + 1}: ${h.issueType} (Severity: ${h.severityScore}/10)`).join("; ")
    : "No previous issues analyzed in this session.";

  const promptText = `
    You are AI CitySense, an expert civic infrastructure analyst. Analyze the provided media and/or text to identify urban issues.
    
    Context:
    ${location ? `Location coordinates: ${location.lat}, ${location.lng}` : "Location not provided."}
    User Description: ${description || "No description provided."}
    Session History: ${historyContext}

    Your analysis must include:

    1. DETECTION:
    - Issue Category (pothole, garbage, waterlogging, broken signal, damaged infrastructure, unsafe area, overcrowding, accident zone, or other)
    - Severity (1-10)
    - Evidence (what you observed that led to this conclusion)

    2. DEEP ANALYSIS:
    - Safety Impact
    - Environmental Impact  
    - Population Affected
    - Root Cause Theory
    - Risk Level (Low/Medium/High/Critical)

    3. RECOMMENDATIONS:
    - Citizen Actions (safe immediate steps)
    - Authority Actions (technical fixes needed)

    4. COMPLAINT LETTER:
    Generate a formal complaint letter ready for submission to municipal authorities.

    5. METADATA & INSIGHTS:
    - Likely Responsible City Department
    - Priority Estimation
    - Session Insights: A brief natural language summary comparing this issue to the Session History. Identify trends.

    Format all outputs clearly with markdown headers.
    If uncertain about any aspect, state your confidence level.
  `;

  const parts: any[] = [{ text: promptText }];

  if (imageBase64) {
    // Extract base64 data if it includes the prefix
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming JPEG for simplicity
        data: base64Data,
      },
    });
  }

  if (videoBase64) {
    // Parse mime type from base64 string if possible, default to mp4
    let mimeType = "video/mp4";
    const mimeMatch = videoBase64.match(/^data:(video\/[a-zA-Z0-9]+);base64,/);
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1];
    }
    
    const base64Data = videoBase64.split(',')[1] || videoBase64;
    parts.push({
        inlineData: {
            mimeType: mimeType,
            data: base64Data
        }
    });
  }

  if (audioBase64) {
    // Parse mime type from base64 string if possible
    let mimeType = "audio/mp3";
    const mimeMatch = audioBase64.match(/^data:(audio\/[a-zA-Z0-9]+);base64,/);
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1];
    }
    
    const base64Data = audioBase64.split(',')[1] || audioBase64;
    parts.push({
        inlineData: {
            mimeType: mimeType,
            data: base64Data
        }
    });
  }

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: parts
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          issueType: { type: Type.STRING, description: "The Issue Category identified in Detection" },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"], description: "The Risk Level identified in Deep Analysis" },
          severityScore: { type: Type.INTEGER, description: "The Severity (1-10) identified in Detection" },
          description: { type: Type.STRING, description: "Professional technical description" },
          evidenceSummary: { type: Type.STRING, description: "Evidence observed in Detection" },
          deepAnalysis: { type: Type.STRING, description: "Full text of the Deep Analysis section (Safety, Env, Pop, Root Cause) in Markdown" },
          citizenActions: { type: Type.STRING, description: "Citizen Actions from Recommendations" },
          authorityActions: { type: Type.STRING, description: "Authority Actions from Recommendations" },
          complaintLetter: { type: Type.STRING, description: "The Generated Complaint Letter" },
          sessionInsights: { type: Type.STRING, description: "Session Insights comparing with history" },
          recommendedAction: { type: Type.STRING, description: "Short summary of authority action" }, 
          department: { type: Type.STRING, description: "Responsible City Department" },
          estimatedPriority: { type: Type.STRING, description: "Priority Estimation" },
        },
        required: ["issueType", "severity", "severityScore", "description", "evidenceSummary", "deepAnalysis", "citizenActions", "authorityActions", "complaintLetter", "sessionInsights", "recommendedAction", "department", "estimatedPriority"],
      },
    },
  });

  const jsonText = response.text || "{}";
  try {
    return JSON.parse(jsonText) as CivicIssueAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Analysis failed to produce valid data.");
  }
};

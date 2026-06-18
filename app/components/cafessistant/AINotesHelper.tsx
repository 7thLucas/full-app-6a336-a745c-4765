import { useState } from "react";
import { Sparkles } from "lucide-react";
import { invokeLLM } from "@qb/agentic";

interface AINotesHelperProps {
  shopName: string;
  rating: number;
  onSuggestion: (notes: string) => void;
  accentColor: string;
  textSecondaryColor: string;
}

export function AINotesHelper({ shopName, rating, onSuggestion, accentColor, textSecondaryColor }: AINotesHelperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSuggestion = async () => {
    if (!shopName.trim() || !rating) return;
    setLoading(true);
    setError("");

    try {
      const result = await invokeLLM({
        message: `I just visited "${shopName}" and rated it ${rating}/5 stars. Generate a brief, authentic-sounding coffee tasting note (2-3 sentences) I might write in my coffee journal. Be specific about flavours, atmosphere, and what made it memorable. Keep it personal and genuine.`,
        schema: {
          type: "object",
          properties: {
            notes: { type: "string", description: "The tasting notes suggestion" },
          },
          required: ["notes"],
        },
        systemPrompt: "You are helping a coffee enthusiast write journal notes about their coffee shop visits. Be concise, warm, and specific. Focus on sensory details and the overall experience.",
      });

      if (result.response?.notes) {
        onSuggestion(String(result.response.notes));
      }
    } catch {
      setError("Could not generate suggestion");
    } finally {
      setLoading(false);
    }
  };

  if (!shopName.trim() || !rating) return null;

  return (
    <div>
      <button
        type="button"
        onClick={getSuggestion}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-medium transition-opacity disabled:opacity-50"
        style={{ color: accentColor }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {loading ? "Generating..." : "Suggest notes with AI"}
      </button>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function getFatSecretToken(): Promise<string> {
  const key = Deno.env.get("FATSECRET_CONSUMER_KEY")!;
  const secret = Deno.env.get("FATSECRET_CONSUMER_SECRET")!;
  const res = await fetch("https://oauth.fatsecret.com/connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${key}:${secret}`)}`,
    },
    body: "grant_type=client_credentials&scope=basic",
  });
  if (!res.ok) throw new Error(`FatSecret auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function searchFatSecret(token: string, query: string) {
  const url = `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(query)}&format=json&max_results=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const food = data?.foods?.food;
  if (!food) return null;
  const item = Array.isArray(food) ? food[0] : food;
  // Parse the description string for nutrition
  const desc = item.food_description || "";
  const calsMatch = desc.match(/Calories:\s*([\d.]+)/i);
  const fatMatch = desc.match(/Fat:\s*([\d.]+)/i);
  const carbsMatch = desc.match(/Carbs:\s*([\d.]+)/i);
  const proteinMatch = desc.match(/Protein:\s*([\d.]+)/i);
  return {
    name: item.food_name,
    calories: calsMatch ? parseFloat(calsMatch[1]) : 0,
    fat: fatMatch ? parseFloat(fatMatch[1]) : 0,
    carbs: carbsMatch ? parseFloat(carbsMatch[1]) : 0,
    protein: proteinMatch ? parseFloat(proteinMatch[1]) : 0,
    description: desc,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Step 1: Use Gemini Vision to identify the food
    const visionRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Identify this food item. Return ONLY a JSON object with these fields:
{
  "foodName": "name of the food",
  "estimatedCalories": number,
  "estimatedSugar": number (grams),
  "estimatedFat": number (grams),
  "servingSize": "description"
}
No markdown, no code blocks, just the JSON.`,
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
      }),
    });

    if (!visionRes.ok) {
      if (visionRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (visionRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await visionRes.text();
      console.error("Vision error:", visionRes.status, t);
      throw new Error("Food identification failed");
    }

    const visionData = await visionRes.json();
    const visionText = visionData.choices?.[0]?.message?.content || "";
    
    // Parse the vision response
    let foodInfo;
    try {
      const jsonMatch = visionText.match(/\{[\s\S]*\}/);
      foodInfo = JSON.parse(jsonMatch ? jsonMatch[0] : visionText);
    } catch {
      foodInfo = { foodName: "Unknown Food", estimatedCalories: 200, estimatedSugar: 10, estimatedFat: 8, servingSize: "1 serving" };
    }

    // Step 2: Get accurate nutrition from FatSecret
    let fatSecretData = null;
    try {
      const token = await getFatSecretToken();
      fatSecretData = await searchFatSecret(token, foodInfo.foodName);
    } catch (e) {
      console.error("FatSecret error:", e);
    }

    // Merge data - prefer FatSecret for calories, use Gemini estimates as fallback
    const nutrition = {
      name: foodInfo.foodName,
      calories: fatSecretData?.calories || foodInfo.estimatedCalories,
      sugar: foodInfo.estimatedSugar || 0,
      fat: fatSecretData?.fat || foodInfo.estimatedFat || 0,
      carbs: fatSecretData?.carbs || 0,
      protein: fatSecretData?.protein || 0,
      servingSize: foodInfo.servingSize || "1 serving",
      fatSecretDescription: fatSecretData?.description || null,
    };

    // Determine sugar level
    const sugarLevel = nutrition.sugar > 20 ? "high" : nutrition.sugar > 8 ? "moderate" : "safe";

    // Step 3: Get AI health advice based on user profile
    const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2);
    const adviceRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a teen-friendly health advisor for a diabetes prevention app called GlucoGuard. Be encouraging, use emojis, keep language simple. Never diagnose. Focus on actionable advice.`,
          },
          {
            role: "user",
            content: `A teen (age ${userProfile.age}, BMI ${bmi.toFixed(1)}, family diabetes history: ${userProfile.familyDiabetes ? "yes" : "no"}, daily sugar intake: ${userProfile.dailySugar}) just scanned: ${nutrition.name} (${nutrition.calories} cal, ${nutrition.sugar}g sugar, ${nutrition.fat}g fat).

Return ONLY a JSON object:
{
  "isGoodChoice": boolean,
  "explanation": "2-3 sentences why this is good or bad for them right now",
  "healthierSwap": "specific alternative food suggestion",
  "swapReason": "1 sentence why the swap is better",
  "tip": "one actionable health tip"
}
No markdown, no code blocks.`,
          },
        ],
      }),
    });

    let advice = { isGoodChoice: true, explanation: "This food is okay in moderation!", healthierSwap: "", swapReason: "", tip: "Stay hydrated!" };
    if (adviceRes.ok) {
      const adviceData = await adviceRes.json();
      const adviceText = adviceData.choices?.[0]?.message?.content || "";
      try {
        const jsonMatch = adviceText.match(/\{[\s\S]*\}/);
        advice = JSON.parse(jsonMatch ? jsonMatch[0] : adviceText);
      } catch { /* use default */ }
    }

    return new Response(JSON.stringify({
      nutrition,
      sugarLevel,
      advice,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-food error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

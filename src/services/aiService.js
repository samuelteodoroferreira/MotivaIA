const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

/**
 * Gera uma mensagem motivacional personalizada com base na descrição
 * do estado emocional do usuário, utilizando a API Gemini do Google.
 */
export async function getMotivationalMessage({
  moodDescription,
  category,
  intensity,
  goal
}) {
  if (!GEMINI_API_KEY) {
    throw new Error("Chave de API não configurada.");
  }

  const categoryText = category
    ? `\nCategoria de motivação: ${category}.`
    : "";
  const intensityText = intensity
    ? `\nNível de intensidade desejado: ${intensity}.`
    : "";
  const goalText = goal ? `\nMeta do usuário: ${goal}.` : "";

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Você é um assistente motivacional em português, breve, empático e positivo. " +
              "Responda em até 4 parágrafos curtos.\n\n" +
              `Estado emocional do usuário: "${moodDescription}".` +
              categoryText +
              intensityText +
              goalText +
              "\nGere uma mensagem de incentivo personalizada, prática e encorajadora."
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.9
    }
  };

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GEMINI_API_KEY
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error("Falha na chamada da API de IA.");
  }

  const data = await response.json();
  const candidates = data.candidates ?? [];
  const first = candidates[0];
  const text =
    first?.content?.parts?.[0]?.text ??
    "Não consegui gerar uma mensagem agora, mas acredite: você é capaz de superar esse momento.";

  return text.trim();
}


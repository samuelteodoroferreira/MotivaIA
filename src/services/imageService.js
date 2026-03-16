const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";

/**
 * Busca uma imagem motivacional no Unsplash baseada em categoria,
 * intensidade e humor do usuário.
 */
export async function getMotivationalImageUrl({
  category,
  intensity,
  moodDescription
}) {
  if (!UNSPLASH_ACCESS_KEY) {
    return null;
  }

  const queriesByCategory = {
    geral: "calm sky soft light minimal abstract",
    estudos: "study desk cozy notebook coffee focus",
    trabalho: "workspace office productivity calm light",
    autoestima: "self care sunrise nature flowers peaceful",
    saúde: "wellness nature forest breathing yoga calm"
  };

  const baseQuery = queriesByCategory[category] ?? queriesByCategory.geral;

  const extra =
    intensity === "intensa"
      ? "strong colors sunrise energy"
      : intensity === "suave"
      ? "soft pastel calm minimal"
      : "balanced light soft";

  const query = `${baseQuery} ${extra}`;

  const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(
    query
  )}&orientation=landscape&content_filter=high`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const imageUrl =
      data.urls?.regular ??
      data.urls?.small ??
      data.urls?.thumb ??
      null;

    return imageUrl;
  } catch {
    return null;
  }
}


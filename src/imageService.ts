
/**
 * Service to fetch images from various stock photo APIs.
 * Supports Pexels, Unsplash, and Pixabay.
 */

export async function fetchStockImage(query: string): Promise<string | null> {
  // Try Pexels first
  const pexelsKey = process.env.PEXELS_API_KEY || (import.meta as any).env?.VITE_PEXELS_API_KEY;
  if (pexelsKey) {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
        headers: {
          Authorization: pexelsKey,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          return data.photos[0].src.large;
        }
      }
    } catch (error) {
      console.error('Pexels API error:', error);
    }
  }

  // Try Unsplash
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY || (import.meta as any).env?.VITE_UNSPLASH_ACCESS_KEY;
  if (unsplashKey) {
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`, {
        headers: {
          Authorization: `Client-ID ${unsplashKey}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].urls.regular;
        }
      }
    } catch (error) {
      console.error('Unsplash API error:', error);
    }
  }

  // Try Pixabay
  const pixabayKey = process.env.PIXABAY_API_KEY || (import.meta as any).env?.VITE_PIXABAY_API_KEY;
  if (pixabayKey) {
    try {
      const response = await fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`);
      if (response.ok) {
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
          return data.hits[0].largeImageURL;
        }
      }
    } catch (error) {
      console.error('Pixabay API error:', error);
    }
  }

  return null;
}

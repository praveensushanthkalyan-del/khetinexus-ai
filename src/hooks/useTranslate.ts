import { useState, useEffect, useCallback } from 'react';

const translationCache: Record<string, string> = {};

export function useTranslate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (!text || text.trim() === '') return text;
    
    const cacheKey = `${text}:${targetLang}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang }),
      });

      if (!response.ok) throw new Error('Translation failed');
      
      const { translation } = await response.json();
      translationCache[cacheKey] = translation;
      return translation;
    } catch (err) {
      setError('Translation failed');
      return text;
    } finally {
      setLoading(false);
    }
  }, []);

  return { translateText, loading, error };
}

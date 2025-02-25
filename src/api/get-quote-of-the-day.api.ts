import { api } from 'api';

export async function getQuoteOfTheDay(): Promise<string> {
  try {
    const response = await api.get('/quotes/qod');
    return `${response.data.quote} - ${response.data.author}`;
  } catch (error) {
    return 'No quote available - Unknown';
  }
}

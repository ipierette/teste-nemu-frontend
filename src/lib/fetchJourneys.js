/**
 * Fetches journey data from the backend API
 * 
 * @param {string} baseUrl - Base URL of the API (default: http://localhost:3001)
 * @returns {Promise<Object>} Journey data response
 * @throws {Error} If fetch fails or response is not ok
 */
export async function fetchJourneys(baseUrl = 'http://localhost:3001') {
  try {
    const response = await fetch(`${baseUrl}/api/journeys`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Erro HTTP! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Falha ao carregar jornadas: ${error.message}`);
    }
    throw new Error('Falha ao carregar jornadas: Erro desconhecido');
  }
}

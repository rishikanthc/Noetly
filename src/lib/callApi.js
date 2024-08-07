async function callApi(endpoint='', args = {}) {
  const baseUrl = 'http://localhost:8000';
  const url = new URL(endpoint, baseUrl);

  Object.keys(args).forEach(key => url.searchParams.append(key, args[key]));

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers you might need, such as authorization
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export default callApi;

async function get(url) {
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader()
    }
  });
  return await result.json();
}

async function post(url, data) {
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader()
    },
    body: JSON.stringify(data)
  });

  return await result.json();
}

function getAuthHeader() {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : null;
}

export default { get, post };

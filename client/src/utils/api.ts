import { navigate } from '@reach/router';

async function get(url: string) {
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader()
    }
  });

  if (result.status === 401) {
    return navigate('/login');
  }
  return await result.json();
}

async function post(url: string, data: any) {
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
  return token ? `Bearer ${token}` : '';
}

export default { get, post };

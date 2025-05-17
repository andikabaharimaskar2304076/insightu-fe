const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login gagal');
  }

  return response.json();
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  role: string;
  birth_date?: string;
}) {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registrasi gagal');
  }

  return response.json();
}
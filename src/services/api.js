const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: ambil token dari localStorage
const getToken = () => localStorage.getItem('auth_token');

// Helper: request utama
const request = async (method, endpoint, data = null, auth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const json = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...json };
  }

  return json;
};

// ─── AUTH SERVICES ────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Login user
   * POST /api/auth/login
   */
  login: (email, password, remember = false) =>
    request('POST', '/auth/login', { email, password, remember }),

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout: () => request('POST', '/auth/logout', null, true),

  /**
   * Kirim link reset password ke email
   * POST /api/auth/forgot-password
   */
  forgotPassword: (email) =>
    request('POST', '/auth/forgot-password', { email }),

  /**
   * Reset password dengan token
   * POST /api/auth/reset-password
   */
  resetPassword: (token, email, password, password_confirmation) =>
    request('POST', '/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation,
    }),

  /**
   * Ambil data user yang sedang login
   * GET /api/auth/me
   */
  me: () => request('GET', '/auth/me', null, true),
};



import axios from 'axios';
import * as ApiTypes from '../types/api';

const API_TOKEN_KEY = 'ecopraia:token';
const API_ROLE_KEY = 'ecopraia:role';
const API_USER_ID_KEY = 'ecopraia:userId';
const API_EMAIL_KEY = 'ecopraia:email';
const apiUrl = '/api';

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 500000,
});

const storedToken = localStorage.getItem(API_TOKEN_KEY);
if (storedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}












function extractUserIdFromToken(token: string): string | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    let normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4 !== 0) {
      normalized += '=';
    }

    const decoded = JSON.parse(decodeURIComponent(escape(atob(normalized))));

    
    
    console.log('[extractUserIdFromToken] claims decodificadas:', decoded);

    const sub = decoded?.sub?.toString();
    const subIsNumeric = typeof sub === 'string' && /^[0-9]+$/.test(sub);

    return (
      decoded?.id?.toString() ??
      decoded?.userId?.toString() ??
      decoded?.idUsuario?.toString() ??
      (subIsNumeric ? sub : null)
    );
  } catch (err) {
    console.error('[extractUserIdFromToken] falha ao decodificar token:', err);
    return null;
  }
}










function extractRoleString(raw: any): string | null {
  if (!raw) return null;

  if (typeof raw === 'string') return raw;

  if (Array.isArray(raw)) {
    const names = raw
      .map((item: any) => {
        if (typeof item === 'string') return item;
        return item?.authority ?? item?.role ?? item?.name ?? null;
      })
      .filter((name: string | null): name is string => Boolean(name));

    if (names.length === 0) return null;

    return names.find((name) => name.toUpperCase().includes('ADMIN')) ?? names[0];
  }

  return null;
}

function parseCurrentUserResponse(data: any) {
  const userObject =
    data?.usuario && typeof data.usuario === 'object'
      ? data.usuario
      : data;

  const idValue =
    userObject?.id ??
    userObject?.userId ??
    userObject?.idUsuario ??
    null;

  const emailValue =
    userObject?.email ??
    (typeof data?.usuario === 'string' ? data.usuario : null);

  const rawRole =
    data?.role ??
    data?.roles ??
    data?.authorities ??
    userObject?.role ??
    userObject?.roles ??
    userObject?.authorities ??
    null;

  return {
    id: idValue != null ? String(idValue) : null,
    email: typeof emailValue === 'string' ? emailValue.trim() : null,
    role: extractRoleString(rawRole),
  };
}

async function fetchCurrentUserInfo(): Promise<{
  id: string | null;
  email: string | null;
  role: string | null;
} | null> {
  try {
    const response = await getCurrentUser();
    const parsed = parseCurrentUserResponse(response.data);

    if (parsed.email) {
      localStorage.setItem(API_EMAIL_KEY, parsed.email);
    }
    if (parsed.id) {
      localStorage.setItem(API_USER_ID_KEY, String(parsed.id));
    }
    if (parsed.role) {
      localStorage.setItem(API_ROLE_KEY, parsed.role.trim().toUpperCase());
    }

    return parsed;
  } catch (error) {
    console.error('[fetchCurrentUserInfo] erro ao buscar usuário atual:', error);
    return null;
  }
}

export function saveToken(
  token: string,
  role?: any,
  userId?: string | number | null,
  email?: string | null
) {
  localStorage.setItem(API_TOKEN_KEY, token);

  const normalizedRole = extractRoleString(role);
  if (normalizedRole) {
    localStorage.setItem(API_ROLE_KEY, normalizedRole.trim().toUpperCase());
  } else {
    localStorage.removeItem(API_ROLE_KEY);
  }

  if (email) {
    localStorage.setItem(API_EMAIL_KEY, email.trim());
  } else {
    localStorage.removeItem(API_EMAIL_KEY);
  }

  const resolvedUserId = userId ?? extractUserIdFromToken(token);
  if (resolvedUserId) {
    localStorage.setItem(API_USER_ID_KEY, String(resolvedUserId));
  } else {
    localStorage.removeItem(API_USER_ID_KEY);
    console.warn(
      '[saveToken] Não foi possível resolver o id do usuário nem pelo ' +
        'parâmetro userId, nem pelo token JWT. O sidebar e a troca de ' +
        'senha vão falhar até isso ser corrigido.'
    );
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearToken() {
  localStorage.removeItem(API_TOKEN_KEY);
  localStorage.removeItem(API_ROLE_KEY);
  localStorage.removeItem(API_USER_ID_KEY);
  localStorage.removeItem(API_EMAIL_KEY);
  delete api.defaults.headers.common.Authorization;
}

export function clearAuth() {
  clearToken();
}

export function getToken(): string | null {
  return localStorage.getItem(API_TOKEN_KEY);
}

export function getRole(): string | null {
  return localStorage.getItem(API_ROLE_KEY);
}

export function getUserEmail(): string | null {
  return localStorage.getItem(API_EMAIL_KEY);
}

export function getUserId(): string | null {
  return localStorage.getItem(API_USER_ID_KEY);
}

function normalizeRole(role: string | null | undefined): string | null {
  return role?.trim().toUpperCase() ?? null;
}

const ADMIN_ROLE_VALUES = new Set([
  'ADMIN',
  'ROLE_ADMIN',
  'ADMINISTRADOR',
  'ROLE_ADMINISTRADOR',
]);

export function isAdmin(): boolean {
  const role = normalizeRole(getRole());
  if (!role) return false;
  if (ADMIN_ROLE_VALUES.has(role)) return true;
  
  
  return role.includes('ADMIN');
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}


async function getLixeiras(params: ApiTypes.lixeiraGet) {
  return await api.get(`/lixeiras/${params.id}`);
}

async function postLixeiras(data: ApiTypes.lixeiraPost) {
  return await api.post('/lixeiras', data);
}

async function putLixeiras(id: string, data: ApiTypes.lixeiraPut) {
  return await api.put(`/lixeiras/${id}`, data);
}

async function deleteLixeiras(params: ApiTypes.lixeiraDelete) {
  return await api.delete(`/lixeiras/${params.id}`);
}

async function getLixeirasAll() {
  return await api.get('/lixeiras/todos');
}


async function getUsuario(params: ApiTypes.Usuarioget) {
  return await api.get(`/usuarios/${params.id}`);
}

async function postUsuario(data: ApiTypes.UsuarioPost) {
  try {
    const response = await api.post('/usuarios', data);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data || error?.message || 'Erro ao criar usuário.';
    throw new Error(message);
  }
}

async function register(data: ApiTypes.UsuarioPost) {
  return await postUsuario(data);
}

async function putUsuario(id: string, data: ApiTypes.UsuarioPut) {
  return await api.put(`/usuarios/${id}`, data);
}

async function deleteUsuario(params: ApiTypes.UsuarioDelete) {
  return await api.delete(`/usuarios/${params.id}`);
}

async function patchUsuarioSenha(id: string, data: ApiTypes.AtualizarSenhaUsuarioDTO) {
  return await api.patch(`/usuarios/${id}/senha`, data);
}


async function getInformativos(params: ApiTypes.informativosGet) {
  return await api.get(`/informativos/${params.id}`);
}

async function postInformativos(data: ApiTypes.informativosPost) {
  return await api.post('/informativos', data);
}

async function putInformativos(id: string, data: ApiTypes.informativosPut) {
  return await api.put(`/informativos/${id}`, data);
}

async function deleteInformativos(params: ApiTypes.informativosDelete) {
  return await api.delete(`/informativos/${params.id}`);
}

async function getInformativosAll() {
  return await api.get('/informativos/todos');
}


async function getAdministrador(params: { id: string }) {
  return await api.get(`/administradores/${params.id}`);
}

async function postAdministrador(data: ApiTypes.admistradoresPost) {
  return await api.post('/administradores', data);
}

async function putAdministrador(id: string, data: ApiTypes.admistradoresPut) {
  return await api.put(`/administradores/${id}`, data);
}

async function deleteAdministrador(params: ApiTypes.admistradoresDelete) {
  return await api.delete(`/administradores/${params.id}`);
}

async function patchAdministradorSenha(id: string, data: ApiTypes.AtualizarSenhaAdministradorDTO) {
  return await api.patch(`/administradores/${id}/senha`, data);
}


async function postHistorico(data: ApiTypes.historicoPost) {
  return await api.post('/historicos', {}, { params: data });
}

async function getHistorico(params: { id: string }) {
  return await api.get(`/historicos/${params.id}`);
}

async function deleteHistorico(params: { id: string }) {
  return await api.delete(`/historicos/${params.id}`);
}

async function getHistoricoAll() {
  return await api.get('/historicos/todos');
}


async function login(data: ApiTypes.loginPost) {
  const response = await api.post('/auth/login', data);
  return response.data as ApiTypes.LoginResponse;
}

async function getCurrentUser() {
  return await api.get<ApiTypes.CurrentUserResponse>('/usuarios/me');
}

export async function fetchCurrentUserRole(): Promise<string | null> {
  try {
    const parsed = await fetchCurrentUserInfo();
    const role = parsed?.role ?? null;

    if (!role) {
      console.warn(
        '[fetchCurrentUserRole] Não foi possível extrair uma role reconhecível ' +
          'da resposta de GET /usuarios/me:',
        parsed
      );
    }

    return role;
  } catch (error) {
    console.error('[fetchCurrentUserRole] erro ao buscar role:', error);
    return null;
  }
}


async function getLixeiraDistancia(id: number, lat: number, lng: number) {
  return await api.get(`/lixeiras/${id}/distancia`, { params: { lat, lng } });
}

async function getLixeirasProximas(lat: number, lng: number) {
  return await api.get('/lixeiras/proximas', { params: { lat, lng } });
}

async function getLixeiraRota(id: number, lat: number, lng: number, modo: 'A_PE' | 'BICICLETA' | 'CARRO' = 'A_PE') {
  return await api.get(`/lixeiras/${id}/rota`, { params: { lat, lng, modo } });
}

export {
  
  getLixeiras,
  postLixeiras,
  putLixeiras,
  deleteLixeiras,
  getLixeirasAll,
  getLixeiraDistancia,
  getLixeirasProximas,
  getLixeiraRota,
  
  getUsuario,
  postUsuario,
  register,
  putUsuario,
  deleteUsuario,
  patchUsuarioSenha,
  
  getInformativos,
  postInformativos,
  putInformativos,
  deleteInformativos,
  getInformativosAll,
  
  getAdministrador,
  postAdministrador,
  putAdministrador,
  deleteAdministrador,
  patchAdministradorSenha,
  
  postHistorico,
  getHistorico,
  deleteHistorico,
  getHistoricoAll,
  
  login,
  fetchCurrentUserInfo,
};
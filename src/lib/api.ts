import axios from 'axios';
import * as ApiTypes from '../types/api';

const API_TOKEN_KEY = 'ecopraia:token';
const API_ROLE_KEY = 'ecopraia:role';
const API_USER_ID_KEY = 'ecopraia:userId';
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
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return decoded?.id?.toString() ?? decoded?.userId?.toString() ?? null;
  } catch {
    return null;
  }
}

export function saveToken(token: string, role?: string, userId?: string | number | null) {
  localStorage.setItem(API_TOKEN_KEY, token);
  if (role) {
    localStorage.setItem(API_ROLE_KEY, role);
  } else {
    localStorage.removeItem(API_ROLE_KEY);
  }

  const resolvedUserId = userId ?? extractUserIdFromToken(token);
  if (resolvedUserId) {
    localStorage.setItem(API_USER_ID_KEY, String(resolvedUserId));
  } else {
    localStorage.removeItem(API_USER_ID_KEY);
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearToken() {
  localStorage.removeItem(API_TOKEN_KEY);
  localStorage.removeItem(API_ROLE_KEY);
  localStorage.removeItem(API_USER_ID_KEY);
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

export function getUserId(): string | null {
  return localStorage.getItem(API_USER_ID_KEY);
}

function normalizeRole(role: string | null | undefined): string | null {
  return role?.trim().toUpperCase() ?? null;
}

export function isAdmin(): boolean {
  const role = normalizeRole(getRole());
  return role === 'ROLE_ADMIN' || role === 'ADMIN';
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// Lixeiras
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

// Usuários
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

// Informativos
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

// Administradores
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

// Histórico
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

// Auth
async function login(data: ApiTypes.loginPost) {
  const response = await api.post('/auth/login', data);
  return response.data as ApiTypes.LoginResponse;
}

async function getCurrentUser() {
  return await api.get<ApiTypes.CurrentUserResponse>('/usuarios/me');
}

export async function fetchCurrentUserRole(): Promise<string | null> {
  try {
    const response = await getCurrentUser();
    const role = response.data?.role;
    if (!role || typeof role !== 'string') {
      return null;
    }

    const normalized = role.trim().toUpperCase();
    localStorage.setItem(API_ROLE_KEY, normalized);
    return normalized;
  } catch {
    return null;
  }
}

// Geolocalização e rotas
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
  // Lixeiras
  getLixeiras,
  postLixeiras,
  putLixeiras,
  deleteLixeiras,
  getLixeirasAll,
  getLixeiraDistancia,
  getLixeirasProximas,
  getLixeiraRota,
  // Usuários
  getUsuario,
  postUsuario,
  register,
  putUsuario,
  deleteUsuario,
  patchUsuarioSenha,
  // Informativos
  getInformativos,
  postInformativos,
  putInformativos,
  deleteInformativos,
  getInformativosAll,
  // Administradores
  getAdministrador,
  postAdministrador,
  putAdministrador,
  deleteAdministrador,
  patchAdministradorSenha,
  // Histórico
  postHistorico,
  getHistorico,
  deleteHistorico,
  getHistoricoAll,
  // Auth
  login,
};


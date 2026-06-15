import axios from 'axios';
import * as ApiTypes from '../types/api';

const API_TOKEN_KEY = 'ecopraia:token';
const apiUrl = import.meta.env.VITE_API_URL ?? '';

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 500000,
});

const storedToken = localStorage.getItem(API_TOKEN_KEY);
if (storedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}

export function saveToken(token: string) {
  localStorage.setItem(API_TOKEN_KEY, token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearToken() {
  localStorage.removeItem(API_TOKEN_KEY);
  delete api.defaults.headers.common.Authorization;
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
  const response = await api.post('/usuarios', data);
  return response.data;
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

export {
  // Lixeiras
  getLixeiras,
  postLixeiras,
  putLixeiras,
  deleteLixeiras,
  getLixeirasAll,
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


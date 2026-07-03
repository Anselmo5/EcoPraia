

export interface Usuarioget {
  id: string;
}

export interface UsuarioPut {
  id?: string;
  nome: string;
  email: string;
}

export interface UsuarioDelete {
  id: string;
}

export interface UsuarioPost {
  nome: string;
  email: string;
  senha: string;
}

export interface CurrentUserResponse {
  id: number;
  nome: string;
  email: string;
  role: string;
}



export interface lixeiraGet {
  id: string;
}

export interface lixeiraPut {
  id?: string;
  latitude: number;
  longitude: number;
  informativosTiposIds: number[];
}

export interface lixeiraDelete {
  id: string;
}

export interface lixeiraPost {
  latitude: number;
  longitude: number;
  informativosTiposIds: number[];
}



export interface informativosGet {
  id: string;
}

export interface informativosPut {
  id?: string;
  nomeTipo: string;
  informativo: string;
  cor: string;
}

export interface informativosDelete {
  id: string;
}

export interface informativosPost {
  nomeTipo: string;
  informativo: string;
  cor: string;
}



export interface admistradoresGet {
  id: string;
}

export interface admistradoresPut {
  id?: string;
  nome: string;
  email: string;
  instituicao: string;
  cargo: string;
}

export interface admistradoresDelete {
  id: string;
}

export interface admistradoresPost {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  instituicao: string;
  cargo: string;
}



export interface historicoGet {
  id: string;
}

export interface historicoDelete {
  id: string;
}

export interface historicoPost {
  usuarioId: number;
  lixeiraId: number;
  tipoEvento: "CRIACAO" | "EXCLUSAO" | "EDICAO" | "DESCARTE";
}

export interface AtualizarSenhaUsuarioDTO {
  senha: string;
}

export interface AtualizarSenhaAdministradorDTO {
  senha: string;
}

export interface loginPost {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  role?: string;
  id?: number;
}

export interface UserData {
  id: number;
  nome: string;
  email: string;
  role: string;
}
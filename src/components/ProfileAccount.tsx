// ProfileAccount.tsx

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { getUsuario, putUsuario, patchUsuarioSenha } from "@/lib/api";
import './ProfileAccount.css';

function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

export default function ProfileAccount() {
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ecopraia:token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.sub) {
        const id = decoded.id;
        if (id) {
          setUserId(String(id));
          getUsuario({ id })
            .then((data: any) => {
              setFirstName(data.nome || '');
              setLastName('');
              // A senha nunca é (e não deve ser) retornada pelo back-end por
              // segurança — o campo "Senha Atual" fica vazio de propósito,
              // o próprio usuário deve digitá-la para confirmar identidade
              // antes de trocar a senha.
              setEmail(data.email || '');
            })
            .catch((error) => {
              console.error('Erro ao buscar usuário:', error);
              setEmail(decoded.sub || '');
            });
        } else {
          setEmail(decoded.sub || '');
        }
      }
    }
  }, []);

  const handleSave = async () => {
    if (!userId) {
      Swal.fire({
        title: "Erro",
        text: "Não foi possível identificar o usuário logado.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    if (!firstName.trim() || firstName.trim().length < 3) {
      Swal.fire({
        title: "Erro",
        text: "O nome deve ter entre 3 e 255 caracteres.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    setIsSaving(true);

    try {
      await putUsuario(userId, {
        nome: firstName.trim(),
        email: email.trim(),
      });

      Swal.fire({
        title: "Sucesso!",
        text: "Perfil atualizado com sucesso!",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      Swal.fire({
        title: "Erro",
        text:
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Não foi possível atualizar o perfil.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userId) {
      Swal.fire({
        title: "Erro",
        text: "Não foi possível identificar o usuário logado.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        title: "Erro",
        text: "A nova senha deve ter no mínimo 6 caracteres.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Erro",
        text: "As senhas não conferem",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      // OBS: o back-end (AtualizarSenhaUsuarioDTO) só recebe a nova senha,
      // não valida a senha atual — por isso currentPassword não é enviada.
      await patchUsuarioSenha(userId, { senha: newPassword });

      Swal.fire({
        title: "Sucesso!",
        text: "Senha alterada com sucesso!",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Erro ao alterar senha:", err);
      Swal.fire({
        title: "Erro",
        text:
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Não foi possível alterar a senha.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="profile-account">
      <div className="profile-header">
        <h2>Perfil do Usuário</h2>
        <p> Gerencie suas informações pessoais</p>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <h3>Informações Pessoais</h3>

          <button
            className="profile-btn profile-btn-primary"
            onClick={() =>
              isEditing ? handleSave() : setIsEditing(true)
            }
            disabled={isSaving}
          >
            {isSaving
              ? "Salvando..."
              : isEditing
              ? "Salvar Alterações"
              : "Edição"}
          </button>
        </div>

        <div className="profile-form">
          <div className="profile-field">
            <label>Nome</label>

            <input
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              disabled={!isEditing}
              className="profile-input"
            />
          </div>

          <div className="profile-field">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={!isEditing}
              className="profile-input"
            />
          </div>
        </div>
      </div>

 
      <div className="profile-card">
        <div className="profile-card-header">
          <h3>Alterar Senha</h3>
        </div>

        <div className="profile-form">
     
          <div className="profile-field">
            <label>Senha Atual</label>

            <div className="password-wrapper">
              <input
                type={
                  showPasswords.current
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Digite sua senha atual"
                className="profile-input"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current:
                      !showPasswords.current,
                  })
                }
              >
                {showPasswords.current ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label>Nova Senha</label>

            <div className="password-wrapper">
              <input
                type={
                  showPasswords.new
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="profile-input"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
              >
                {showPasswords.new ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="profile-field">
            <label>Confirmar Senha</label>

            <div className="password-wrapper">
              <input
                type={
                  showPasswords.confirm
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="profile-input"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm:
                      !showPasswords.confirm,
                  })
                }
              >
                {showPasswords.confirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            className="profile-btn profile-btn-primary"
            onClick={handleChangePassword}
            disabled={
              isChangingPassword ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
          >
            {isChangingPassword
              ? "Atualizando..."
              : "Atualizar Senha"}
          </button>
        </div>
      </div>
    </div>
  );
}
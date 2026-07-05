import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import {
  getUsuario,
  putUsuario,
  patchUsuarioSenha,
  getAdministrador,
  putAdministrador,
  patchAdministradorSenha,
  getUserEmail,
  getUserId,
  isAdmin,
  fetchCurrentUserInfo,
} from "@/lib/api";
import './ProfileAccount.css';

export default function ProfileAccount() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdminAccount, setIsAdminAccount] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");


  const [instituicao, setInstituicao] = useState("");
  const [cargo, setCargo] = useState("");

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
    const id = getUserId();
    const admin = isAdmin();
    const storedEmail = getUserEmail();
    const storedRole = admin ? 'ADMIN' : null;
    setUserId(id);
    setIsAdminAccount(admin);
    setEmail(storedEmail || '');

    if (!id || !storedRole) {
      void fetchCurrentUserInfo().then((userInfo) => {
        if (userInfo?.id) {
          setUserId(String(userInfo.id));
        }

        setIsAdminAccount(userInfo?.role ? userInfo.role.toUpperCase().includes('ADMIN') : admin);

        const resolvedEmail = userInfo?.email || storedEmail || '';
        if (resolvedEmail) {
          setEmail(resolvedEmail);
        }

        if (resolvedEmail) {
          const fallbackName = resolvedEmail
            .split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
          setFirstName(fallbackName);
        }
      });

      if (storedEmail) {
        const fallbackName = storedEmail
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
        setFirstName(fallbackName);
      }
      setLastName('');
      if (!storedEmail) {
        console.warn(
          "[ProfileAccount] getUserId() não retornou um id e não há email armazenado. O perfil não pôde ser carregado completamente."
        );
      }
      return;
    }

    if (admin) {
      getAdministrador({ id })
        .then((res: any) => {
          const data = res?.data ?? {};
          setFirstName(data.nome || '');
          setLastName('');
          setEmail(data.email || storedEmail || '');
          setInstituicao(data.instituicao || '');
          setCargo(data.cargo || '');
        })
        .catch((error) => {
          console.error('Erro ao buscar administrador:', error);
        });
    } else {
      getUsuario({ id })
        .then((res: any) => {
          const data = res?.data ?? {};
          setFirstName(data.nome || '');
          setLastName('');
          setEmail(data.email || storedEmail || '');
        })
        .catch((error) => {
          console.error('Erro ao buscar usuário:', error);
        });
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
      if (isAdminAccount) {
        await putAdministrador(userId, {
          nome: firstName.trim(),
          email: email.trim(),
          instituicao,
          cargo,
        });
      } else {
        await putUsuario(userId, {
          nome: firstName.trim(),
          email: email.trim(),
        });
      }

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
    if (isAdminAccount && !userId) {
      Swal.fire({
        title: "Erro",
        text: "Não foi possível identificar o administrador logado.",
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

      if (isAdminAccount) {
        await patchAdministradorSenha(userId as string, { senha: newPassword });
      } else {
        await patchUsuarioSenha({ senha: newPassword });
      }

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
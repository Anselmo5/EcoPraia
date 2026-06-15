// ProfileAccount.tsx

import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import './ProfileAccount.css';

export default function ProfileAccount() {
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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      console.log("Saving profile...");
      Swal.fire({
        title: "Sucesso!",
        text: "Perfil atualizado com sucesso!",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Erro",
        text: "As senhas não conferem",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    setIsSaving(true);

    try {
      console.log("Changing password...");
      Swal.fire({
        title: "Sucesso!",
        text: "Senha alterada com sucesso!",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
      });
    } finally {
      setIsSaving(false);
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
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Edição"}
          </button>
        </div>

        <div className="profile-form">
          <div className="profile-grid">
        
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
              <label>Sobrenome</label>

              <input
                type="text"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                disabled={!isEditing}
                className="profile-input"
              />
            </div>
          </div>

          {/* EMAIL */}
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
          {/* CURRENT PASSWORD */}
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

          {/* NEW PASSWORD */}
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
              isSaving ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
          >
            {isSaving
              ? "Updating..."
              : "Atualizar Senha"}
          </button>
        </div>
      </div>
    </div>
  );
}
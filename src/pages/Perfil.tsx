import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileAccount from "@/components/ProfileAccount";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, clearAuth, getUserId, deleteUsuario } from "@/lib/api";
import { MapPin, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import './Perfil.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [isAdmin_, setIsAdmin] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    // Se não está logado, redireciona para login
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    setIsAdmin(isAdmin());
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  const handleGoToMap = () => {
    navigate("/maps");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const handleDeleteAccount = async () => {
    const userId = getUserId();
    if (!userId) {
      Swal.fire({ title: "Erro", text: "Não foi possível identificar sua conta.", icon: "error" });
      return;
    }

    const result = await Swal.fire({
      title: "Excluir conta",
      text: "Essa ação é irreversível. Deseja realmente excluir sua conta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setIsDeletingAccount(true);
    try {
      await deleteUsuario({ id: userId });
      clearAuth();
      await Swal.fire({
        title: "Conta excluída",
        text: "Sua conta foi removida com sucesso.",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
      navigate("/login", { replace: true });
    } catch (error: any) {
      Swal.fire({
        title: "Erro",
        text: error?.message || "Não foi possível excluir a conta no momento.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
  <div className="profile-layout" >
      {/* SIDEBAR */}
      <ProfileSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* CONTENT */}
      <main className="profile-content">
        <div className="profile-content-wrapper">
          {/* Header com botões de ação */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
            <Button 
              onClick={handleGoToMap}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MapPin size={20} />
              Ir para Mapa
            </Button>

            {isAdmin_ && (
              <div style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                Admin
              </div>
            )}

            <Button 
              onClick={handleLogout}
              variant="outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}
            >
              <LogOut size={20} />
              Sair
            </Button>
          </div>

          {activeTab === "account" && (
            <ProfileAccount />
          )}

          {activeTab === "delete-account" && (
            <div className="profile-card" style={{ marginTop: "1rem" }}>
              <div className="profile-card-header">
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Trash2 size={20} />
                  Excluir conta
                </h3>
              </div>
              <div className="profile-form">
                <p style={{ marginBottom: "1rem", color: "#475569" }}>
                  Ao excluir sua conta, você perderá o acesso ao aplicativo e todos os dados associados serão removidos.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Excluindo..." : "Excluir minha conta"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
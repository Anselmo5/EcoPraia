import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { LogOut } from "lucide-react";
import { Leaf } from "lucide-react";
import beachHero from "@/assets/beach-hero.jpeg";
import { login, saveToken, isAuthenticated, fetchCurrentUserRole } from "@/lib/api";
import "./Login.css";

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se já está logado, redireciona para perfil
  if (isAuthenticated()) {
    navigate("/perfil", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      schema.parse({ email, password });
      const response = await login({ nome: "", email, senha: password });
      saveToken(response.token);
      await fetchCurrentUserRole();
      navigate("/perfil");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.message || "Error");
      } else if (err instanceof Error) {
        setError(err.message || "Falha ao fazer login");
      } else {
        setError("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="main-container"
      style={{ backgroundImage: `url(${beachHero})` }}
    >
      <div className="main-overlay" />
      <div className="login-card">
        <LogOut
          size={20}
          color="#000"
          className="logout-icon"
          onClick={() => navigate("/")}
        />
        <div className="card-header">
          <div className="logo-badge">
            <Leaf className="logo-icon" />
            <span>Ecopraia</span>
          </div>

          <h1 className="title">Consciência na Orla</h1>

          <p className="subtitle">Entre para descartar com consciência</p>
        </div>

        {error && (
          <div
            className="error-message"
            style={{
              color: "#ef4444",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="forgot-password-container">
            <Link to="/recuperar-senha" className="forgot-password-link">
              Esqueci minha senha
            </Link>
          </div>

          <div className="tab-content-container">
            <div className="tab-content">
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>

            <div className="tab-content">
              <button
                onClick={() => navigate("/cadastro")}
                className="submit-button secondary"
                disabled={loading}
              >
                Criar conta
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

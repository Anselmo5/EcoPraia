import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Leaf, Mail, Lock, Send, LogOut } from "lucide-react";
import beachHero from "@/assets/beach-hero.jpeg";

import "./RestPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleContinueEmail = () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Informe um e-mail válido");
      return;
    }

    setStep(2);
  };

  const handleContinuePassword = () => {
    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setStep(3);
  };

  const handleSendPassword = async () => {
    setLoading(true);

    try {
      
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setCompleted(true);
      toast.success("Senha atualizada com sucesso!");
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao enviar a solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="reset-password-page"
      style={{ backgroundImage: `url(${beachHero})` }}
    >
      <div className="reset-password-overlay" />

  
      <Card className="reset-password-card">
                <LogOut
          size={20}
          color="#000"
          className="logout-icon"
          onClick={() => navigate("/")}
        />

        <div className="reset-password-header">
          <div className="reset-password-logo">
            <Leaf className="reset-password-logo-icon" />
            <span className="reset-password-logo-text">Ecopraia</span>
          </div>

          <h1 className="reset-password-title">Recuperar senha</h1>

          <p className="reset-password-subtitle">
            Preencha os dados abaixo para redefinir a sua senha.
          </p>

          <div className="reset-password-steps">
            {[
              { label: "E-mail", number: 1, icon: Mail },
              { label: "Nova senha", number: 2, icon: Lock },
              { label: "Envio", number: 3, icon: Send },
            ].map(item => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.number}
                  className={`reset-password-step ${
                    step === item.number
                      ? "active"
                      : step > item.number
                        ? "completed"
                        : ""
                  }`}
                >
                  <span className="reset-password-step-circle">
                    <StepIcon size={18} />
                  </span>
                  <span className="reset-password-step-label">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="reset-password-form">
          {completed ? (
            <div className="reset-password-success">
              <p className="reset-password-success-text">
                Sua senha foi atualizada com sucesso.
              </p>
              <p className="reset-password-success-description">
                Agora você pode usar a nova senha para fazer login.
              </p>

              <Button
                className="reset-password-button"
                onClick={() => navigate("/login", { replace: true })}
              >
                Ir para o login
              </Button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <>
                  <div className="reset-password-field">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="voce@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  <p className="reset-password-footer">
                    <Link to="/login" className="reset-password-link">
                      Voltar para o login
                    </Link>
                  </p>

                  <Button
                    className="reset-password-button"
                    onClick={handleContinueEmail}
                    disabled={loading}
                  >
                    Continuar
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="reset-password-field">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="reset-password-field">
                    <Label htmlFor="confirm-password">Confirmar senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                         <p className="reset-password-footer">
                    <Link to="/login" className="reset-password-link">
                      Voltar para o login
                    </Link>
                  </p>

                  <Button
                    className="reset-password-button"
                    onClick={handleContinuePassword}
                    disabled={loading}
                  >
                    Continuar
                  </Button>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="reset-password-success">
                    <p className="reset-password-success-text">
                      Confirme o envio da nova senha para o e-mail:
                    </p>
                    <p className="reset-password-success-description">
                      <strong>{email}</strong>
                    </p>

                    <Button
                      className="reset-password-button"
                      onClick={handleSendPassword}
                      disabled={loading}
                    >
                      {loading ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </main>
  );
};

export default ResetPassword;

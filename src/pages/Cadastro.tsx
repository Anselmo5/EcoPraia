import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Leaf } from "lucide-react";
import beachHero from "@/assets/beach-hero.jpeg";
import "./Cadastro.css";

const schema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome").max(80),
    email: z.string().trim().email("E-mail inválido").max(255),
    password: z.string().min(6, "Mínimo 6 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);




  return (
  <main
  className="register-page"
  style={{ backgroundImage: `url(${beachHero})` }}
>
  <div className="register-overlay" />

  <Card className="register-card">
    <div className="register-header">
      <div className="register-badge">
        <Leaf className="register-badge-icon" />

        <span>Ecopraia</span>
      </div>

      <h1 className="register-title">
        Criar conta
      </h1>

      <p className="register-subtitle">
        Junte-se à orla consciente
      </p>
    </div>

    <form className="register-form">
      <div className="form-field">
        <Label htmlFor="name">Nome</Label>

        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="form-field">
        <Label htmlFor="email">E-mail</Label>

        <Input
          id="email"
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="form-field">
        <Label htmlFor="password">Senha</Label>

        <Input
          id="password"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div className="form-field">
        <Label htmlFor="confirm">Confirmar senha</Label>

        <Input
          id="confirm"
          type="password"
          placeholder="••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        className="register-button"
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar conta"}
      </Button>
    </form>

    <p className="register-footer">
      Já tem conta?{" "}

      <Link
        to="/login"
        className="register-link"
      >
        Entrar
      </Link>
    </p>
  </Card>
</main>
  );
};

export default Signup;

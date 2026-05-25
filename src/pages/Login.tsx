import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Leaf } from "lucide-react";
import beachHero from "@/assets/beach-hero.jpeg";
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


  return (
    <main
  className="main-container"
  style={{ backgroundImage: `url(${beachHero})` }}
>
  <div className="main-overlay" />

  <div className="login-card">
    <div className="card-header">
      <div className="logo-badge">
        <Leaf className="logo-icon" />
        <span>Ecopraia</span>
      </div>

      <h1 className="title">Consciência na Orla</h1>

      <p className="subtitle">
        Entre para descartar com consciência
      </p>
    </div>

 

    <div className="form-group">
      <label htmlFor="email">E-mail</label>

      <input
        id="email"
        type="email"
        placeholder="voce@email.com"
      />
    </div>

    <div className="form-group">
      <label htmlFor="password">Senha</label>

      <input
        id="password"
        type="password"
        placeholder="••••••"
      />
    </div>

    <div className="tab-content">
      <button className="submit-button">
        Entrar
      </button>
    </div>

    <div className="tab-content">
      <button onClick={() => window.location.href= "/cadastro"} className="submit-button secondary">
        Criar conta
      </button>
    </div>
  </div>
</main>
  );
}

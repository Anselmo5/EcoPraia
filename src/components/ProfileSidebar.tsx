import { User, LogOut, Menu, X, Trash2 } from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUsuario, getAdministrador, getUserEmail, getUserId, isAdmin, fetchCurrentUserInfo } from "@/lib/api";
import "./ProfileSidebar.css";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function getEmailInitials(email: string): string {
  const clean = (email || "").trim();
  if (clean.length === 0) return "";
  return clean.slice(0, 2).toUpperCase();
}

export default function ProfileSidebar({
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [translate, setTranslate] = useState<number | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const startTranslateRef = useRef(0);
  const widthRef = useRef(260);
  const peekRef = useRef(10);
  const translateRef = useRef<number | null>(null);

  const setTranslateState = (v: number | null) => {
    translateRef.current = v;
    setTranslate(v);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const updateWidth = () => {
      widthRef.current =
        sidebarRef.current?.offsetWidth ?? Math.round(window.innerWidth * 0.85);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const userId = getUserId();
    const storedEmail = getUserEmail();
    setEmail(storedEmail || '');

    if (!userId) {
      void fetchCurrentUserInfo().then((userInfo) => {
        if (!userInfo?.id) return;

        const fallbackName = (userInfo.email || '')
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        setFirstName(fallbackName);
        setLastName('');
        setEmail(userInfo.email || storedEmail || '');
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
          "[ProfileSidebar] getUserId() não retornou um id e não há email armazenado. O perfil não pôde ser carregado completamente."
        );
      }
      return;
    }

    // Admin e usuário comum são entidades separadas no backend
    // (/administradores/{id} vs /usuarios/{id}) — usa a rota certa.
    if (isAdmin()) {
      getAdministrador({ id: userId })
        .then((res: any) => {
          const data = res?.data ?? {};
          setFirstName(data.nome || '');
          setLastName('');
          setEmail(data.email || storedEmail || '');
        })
        .catch((error) => {
          console.error('Erro ao buscar administrador:', error);
        });
    } else {
      getUsuario({ id: userId })
        .then((res: any) => {
          const data = res?.data ?? {};
          setFirstName(data.nome || '');
          setLastName(data.sobrenome || '');
          setEmail(data.email || storedEmail || '');
        })
        .catch((error) => {
          console.error('Erro ao buscar usuário:', error);
        });
    }
  }, []);


  useEffect(() => {
    let onTouchMove: (e: TouchEvent) => void;
    let onTouchEnd: () => void;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const x = t.clientX;
      const nearEdge = x <= 24;
      if (!isOpen && !nearEdge) return; // only start from edge when closed

      startXRef.current = x;
      const closedTranslate = -widthRef.current + peekRef.current;
      startTranslateRef.current = isOpen ? 0 : closedTranslate;
      setDragging(true);
      setTranslateState(startTranslateRef.current);

      onTouchMove = (ev: TouchEvent) => {
        if (!ev.touches[0]) return;
        const delta = ev.touches[0].clientX - startXRef.current;
        const closedTranslate = -widthRef.current + peekRef.current;
        const next = Math.min(
          0,
          Math.max(closedTranslate, startTranslateRef.current + delta)
        );
        setTranslateState(next);
        if (Math.abs(delta) > 10) ev.preventDefault();
      };

      onTouchEnd = () => {
        setDragging(false);
        const final = translateRef.current ?? startTranslateRef.current;
        const closedTranslate = -widthRef.current + peekRef.current;
        const shouldOpen = final > closedTranslate / 2;
        setIsOpen(shouldOpen);
        setTranslateState(null);
        window.removeEventListener("touchmove", onTouchMove as EventListener);
        window.removeEventListener("touchend", onTouchEnd as EventListener);
      };

      window.addEventListener("touchmove", onTouchMove as EventListener, {
        passive: false,
      });
      window.addEventListener("touchend", onTouchEnd as EventListener);
    };

    window.addEventListener("touchstart", onTouchStart as EventListener, {
      passive: false,
    });
    return () => {
      window.removeEventListener("touchstart", onTouchStart as EventListener);
      if (onTouchMove)
        window.removeEventListener("touchmove", onTouchMove as EventListener);
      if (onTouchEnd)
        window.removeEventListener("touchend", onTouchEnd as EventListener);
    };
  }, [isOpen]);

  const closedPeek = -widthRef.current + peekRef.current;

  return (
    <>
      {(isOpen || (translate !== null && translate > closedPeek + 1)) && (
        <div
          className="sidebar-overlay"
          onClick={() => {
            setIsOpen(false);
            setTranslateState(null);
          }}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`profile-sidebar ${isOpen ? "open" : ""} ${dragging ? "dragging" : ""}`}
        style={
          dragging && translate !== null
            ? { transform: `translateX(${translate}px)` }
            : undefined
        }
      >
    
        <div className="sidebar-user">
          <div className="sidebar-user-content">
            <div className="sidebar-avatar">{getEmailInitials(email)}</div>

            <div className="sidebar-user-details">
              <p className="sidebar-user-name">{firstName} {lastName}</p>
              <p className="sidebar-user-email" style={{fontSize:'1rem'}}>{email}</p>
            </div>
          </div>
        </div>

    
        <nav className="sidebar-nav">
          <button
            onClick={() => {
              onTabChange("account");
              setIsOpen(false);
            }}
            className={`sidebar-link ${
              activeTab === "account" ? "active" : ""
            }`}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Perfil</span>
          </button>

          <button
            onClick={() => {
              onTabChange("delete-account");
              setIsOpen(false);
            }}
            className={`sidebar-link ${
              activeTab === "delete-account" ? "active" : ""
            }`}
          >
            <Trash2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Excluir Conta</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
import { User, LogOut, Menu, X, Trash2 } from "lucide-react";

import { useState, useEffect, useRef, use } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUsuario } from "@/lib/api";
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

  useEffect(() => {
    const token = localStorage.getItem('ecopraia:token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.sub) {
        const userId = decoded.id;
        if (userId) {
          getUsuario({ id: userId })
            .then((data: any) => {
              setFirstName(data.nome || '');
              setLastName(data.sobrenome || '');
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
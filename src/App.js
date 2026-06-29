/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
// eslint-disable-next-line no-unused-vars
import { Home, ClipboardList, BarChart2, Users, UserCheck, Search, Menu, MessageCircle, Eye, EyeOff } from "lucide-react";
import { Copy, XCircle, RefreshCw, Check, Pencil, UserX, Download, CheckCircle, Banknote } from "lucide-react";
import * as XLSX from 'xlsx'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;
const ENVIO_DEPTO = 3.39;
const COMISION = 0.10;
const LOGO_URL = "/Logo-banner.png";  
const LOGO_WHITE = "Logo-White.png";

const CHART_COLORS = ["#007AFF", "#34C759", "#FF9500", "#FF2D55", "#5856D6"];

function parseMonto(str) {
  if (!str) return 0;
  const num = parseFloat(str.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}
function formatMoney(num) { return "$" + num.toFixed(2); }
function fechaHoy() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// ══ Login ═════════════════════════════════════════════════
function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputStyle = {
  width: "100%",
  background: "#f5f5f7",
  border: "none",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  color: "#1d1d1f",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};

  async function handleLogin() {
  const res = await fetch(SUPABASE_URL + "/rest/v1/usuarios?usuario=eq." + usuario + "&password=eq." + password + "&activo=eq.true", {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
    },
  });
  const data = await res.json();
  if (data.length > 0) {
    onLogin(data[0]);
  } else {
    setError("Usuario o contraseña incorrectos");
  }
}

  return (
    <div style={{
  minHeight: "100vh",
  background: "#f5f5f7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Inter', sans-serif",
  padding: "1rem",
  overflow: "hidden",
  position: "fixed",
  width: "100%",
  boxSizing: "border-box",
}}>
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center", padding: "0 1rem", boxSizing: "border-box" }}>
        <img src={LOGO_URL} alt="Tecno Gadget" style={{ width: 280, borderRadius: "6px", marginBottom: "1.5rem", display: "block", margin: "0 auto 1.5rem" }} />
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 0.25rem" }}>¡Hey! ¿Qué hay de nuevo?</h1>
        <p style={{ color: "#6e6e73", fontSize: "0.9rem", margin: "0 0 2rem" }}>slash3 systems</p>

        <div style={{ background: "#fff", borderRadius: "18px", padding: "1.75rem" }}>
          {error && (
            <div style={{ background: "#fff2f2", borderRadius: "10px", padding: "0.7rem 1rem", color: "#ff3b30", fontSize: "0.85rem", marginBottom: "1.25rem", textAlign: "left" }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", marginBottom: "0.4rem" }}>USUARIO</label>
            <input value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="Usuario" autoComplete="off"
              style={{ width: "100%", background: "#f5f5f7", border: "none", borderRadius: "10px", padding: "0.75rem 1rem", color: "#1d1d1f", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", marginBottom: "0.4rem" }}>CONTRASEÑA</label>
  <div style={{ position: "relative" }}>  {/* ← nuevo div solo para input+botón */}
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={e => setPassword(e.target.value)}
      placeholder="Contraseña"
      onKeyDown={e => e.key === "Enter" && handleLogin()}
      style={{ ...inputStyle, paddingRight: "2.5rem" }}
    />
    <button onClick={() => setShowPassword(!showPassword)} style={{
      position: "absolute", right: "0.75rem", top: "50%",
      transform: "translateY(-50%)",
      background: "transparent", border: "none", cursor: "pointer",
      color: "#6e6e73", display: "flex", alignItems: "center", padding: 0,
    }}>
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
</div>
          <button onClick={handleLogin} style={{
            width: "100%", padding: "0.85rem",
            background: "#007AFF", color: "#fff",
            border: "none", borderRadius: "12px",
            fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
            letterSpacing: "-0.01em",
          }}>
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}

// ══ Navbar ════════════════════════════════════════════════
function Navbar({ user, onLogout, activeTab, setActiveTab, busqueda, setBusqueda, darkMode }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef({});

function handleTabHover(id, e) {
  const el = tabsRef.current[id];
  if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
}

function handleNavLeave() {
  const el = tabsRef.current[activeTab];
  if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
}

useEffect(() => {
  const el = tabsRef.current[activeTab];
  if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
}, [activeTab]);



  useEffect(() => {
    function handleResize() { setIsMobile(window.innerWidth < 768); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = user.rol === "admin"
    ? [{ id: "dashboard", icon: <Home size={15} />, label: "Inicio" }, { id: "ordenes", icon: <ClipboardList size={15} />, label: "Órdenes" }, { id: "estadisticas", icon: <BarChart2 size={15} />, label: "Estadísticas" }, { id: "vendedores", icon: <UserCheck size={15} />, label: "Vendedores" }, { id: "equipo", icon: <Users size={15} />, label: "Equipo" }]
    : [];

  function handleTabClick(id) {
    setActiveTab(id);
    setShowMenu(false);
  }

  const textColor = darkMode ? "rgba(255,255,255,0.7)" : "#6e6e73";
  const textActive = darkMode ? "#34C759" : "#007AFF";
  const borderColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  const menuBg = darkMode ? "#1c1c1e" : "#fff";
  const menuText = darkMode ? "#fff" : "#1d1d1f";
  const inputBg = darkMode ? "rgba(255,255,255,0.1)" : "#f5f5f7";
  const inputBorder = darkMode ? "rgba(255,255,255,0.15)" : "#e5e5ea";

  return (
    <>
      <div style={{
        background: darkMode ? "transparent" : "rgba(255,255,255,0.85)",
        backdropFilter: darkMode ? "none" : "blur(20px)",
        WebkitBackdropFilter: darkMode ? "none" : "blur(20px)",
        borderBottom: "1px solid " + borderColor,
        position: "sticky", top: 0, zIndex: 100,
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", height: 52, gap: "1rem" }}>

          {/* Logo */}
          <img
            src={darkMode ? LOGO_WHITE : LOGO_URL}
            alt="Tecno Gadget"
            style={{ height: 36, borderRadius: "6px", flexShrink: 0 }}
          />

          {/* Pestañas — solo desktop y solo admin */}
          {!isMobile && user.rol === "admin" && (
            <div style={{ display: "flex", flex: 1, position: "relative" }} onMouseLeave={handleNavLeave}>
  {tabs.map(tab => (
    <button
      key={tab.id}
      ref={el => tabsRef.current[tab.id] = el}
      onClick={() => handleTabClick(tab.id)}
      onMouseEnter={e => handleTabHover(tab.id, e)}
      style={{
        padding: "0.4rem 0.85rem",
        background: "transparent",
        color: activeTab === tab.id ? textActive : textColor,
        border: "none",
        borderBottom: "2px solid transparent",
        borderRadius: 0,
        fontWeight: activeTab === tab.id ? 600 : 400,
        fontSize: "0.88rem",
        cursor: "pointer",
        display: "flex", alignItems: "center", gap: "0.35rem",
        paddingBottom: "0.5rem",
        fontFamily: "'Inter', sans-serif",
        transition: "color 0.15s",
      }}>
      {tab.icon}{tab.label}
    </button>
  ))}
  {/* Línea deslizante */}
  <div style={{
    position: "absolute",
    bottom: 0,
    left: indicatorStyle.left,
    width: indicatorStyle.width,
    height: 2,
    background: textActive,
    borderRadius: "2px 2px 0 0",
    transition: "left 0.2s ease, width 0.2s ease",
  }} />
</div>
          )}

          <div style={{ flex: 1 }} />

          {/* Búsqueda */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowSearch(!showSearch)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: "0.4rem", borderRadius: "8px", display: "flex", alignItems: "center",
              color: textColor,
            }}>
              <Search size={18} />
            </button>
            {showSearch && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: menuBg, borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                padding: "0.5rem", zIndex: 200, width: 260,
              }}>
                <input
                  autoFocus
                  placeholder="Buscar ficha o cliente..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem",
                    border: "1px solid " + inputBorder,
                    borderRadius: "8px", fontSize: "0.85rem",
                    outline: "none", background: inputBg,
                    color: menuText,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>

          {/* Usuario */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "transparent", border: "none", cursor: "pointer",
              padding: "0.3rem 0.5rem", borderRadius: "8px",
            }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.78rem", fontWeight: 700, flexShrink: 0 }}>
                {user.nombre.charAt(0)}
              </div>
              {!isMobile && <span style={{ fontSize: "0.85rem", color: menuText, fontWeight: 500 }}>{user.nombre.split(" ")[0]}</span>}
            </button>

            {showUserMenu && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: menuBg, borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                padding: "0.5rem", minWidth: 180, zIndex: 200,
                border: "1px solid " + inputBorder,
              }}>
                <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid " + inputBorder, marginBottom: "0.25rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: menuText }}>{user.nombre}</div>
                  <div style={{ fontSize: "0.72rem", color: textColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>{user.rol}</div>
                </div>
                <button onClick={onLogout} style={{
                  width: "100%", textAlign: "left", padding: "0.6rem 0.75rem",
                  background: "transparent", border: "none", borderRadius: "8px",
                  color: "#ff3b30", fontSize: "0.85rem", cursor: "pointer", fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}>Cerrar sesión</button>
              </div>
            )}
          </div>

          {/* Hamburguesa — solo admin en móvil */}
          {isMobile && user.rol === "admin" && (
            <button onClick={() => setShowMenu(!showMenu)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: "0.4rem", borderRadius: "8px", color: textColor,
              display: "flex", alignItems: "center",
            }}>
              <Menu size={22} />
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil — solo admin */}
      {isMobile && showMenu && user.rol === "admin" && (
        <div style={{
          background: darkMode ? "rgba(28,28,30,0.97)" : "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid " + borderColor,
          padding: "0.5rem 1rem",
          fontFamily: "'Inter', sans-serif",
          zIndex: 99,
          position: "sticky", top: 52,
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{
              width: "100%", textAlign: "left",
              padding: "0.75rem 0.85rem",
              background: activeTab === tab.id ? (darkMode ? "rgba(52,199,89,0.1)" : "rgba(0,122,255,0.08)") : "transparent",
              color: activeTab === tab.id ? textActive : menuText,
              border: "none", borderRadius: "10px",
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: "0.92rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.6rem",
              marginBottom: "0.15rem",
              fontFamily: "'Inter', sans-serif",
            }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}


// ══ StatCard ══════════════════════════════════════════════
function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: accent || "#1d1d1f", letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.78rem", color: "#6e6e73", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  );
}

// ══ Modal Editar Orden ════════════════════════════════════
function ModalEditar({ orden, tipo, onClose, onSave }) {
  const [form, setForm] = useState({ ...orden });
  const [saving, setSaving] = useState(false);

  const MUNICIPIOS_LOCAL = ["SAN SALVADOR", "SANTA ANA", "SAN MIGUEL", "APOPA", "SOYAPANGO", "MEJICANOS", "SANTA TECLA", "CIUDAD DELGADO", "CUSCATANCINGO", "ILOPANGO", "TONACATEPEQUE", "ANTIGUO CUSCATLAN", "AYUTUXTEPEQUE", "Otro"];
  const DEPARTAMENTOS = ["SANTA ANA", "SAN MIGUEL", "AHUACHAPAN", "CABAÑAS", "CHALATENANGO", "CUSCATLAN", "LA LIBERTAD", "LA UNION", "LA PAZ", "MORAZAN", "SONSONATE", "SAN SALVADOR", "SAN VICENTE", "USULUTAN"];
  const FORMAS_PAGO = ["Efectivo", "Transferencia", "Tarjeta", "PayPal", "Contraentrega", "Otro"];
  const TIPOS_COMPROBANTE = ["Ticket", "Factura", "Factura Consumidor Final", "Sin comprobante"];
  const PERFILES = ["Instagram", "Facebook", "TikTok", "WhatsApp Principal", "WhatsApp Secundario", "Inbox Pagina FB", "Referido", "Otro"];
  const QUIEN_INGRESA = ["Tecno Gadget - Fer", "Tecno Gadget - Jefferson", "Tecno Gadget - Wendy", "Tecno Gadget - Liss", "Tecno Gadget - Isa", "Tecno Gadget - Josue"];
  const TIPOS_ENTREGA = ["Lugar de residencia / trabajo", "Punto de encuentro (Gasolinera, parque, centro comercial etc)", "En agencia de mensajeria (Cliente pasará a recoger)"];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
    await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + orden.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + SUPABASE_KEY,
      },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSave();
    onClose();
  }

  const inputStyle = {
    width: "100%", padding: "0.6rem 0.85rem",
    border: "1px solid #e5e5ea", borderRadius: "8px",
    fontSize: "0.88rem", outline: "none",
    background: "#f5f5f7", color: "#1d1d1f",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "0.72rem", fontWeight: 600,
    color: "#6e6e73", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: "0.35rem",
  };

  const fieldStyle = { marginBottom: "1rem" };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", fontFamily: "'Inter', sans-serif",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        padding: "1.5rem", width: "100%", maxWidth: 560,
        maxHeight: "85vh",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        display: "flex", flexDirection: "column",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1d1d1f", margin: 0 }}>Editar Orden</h2>
            <p style={{ color: "#6e6e73", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>Ficha {orden.numero_ficha} — {tipo === "local" ? "Local" : "Departamental"}</p>
          </div>
          <button onClick={onClose} style={{ background: "#f5f5f7", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#6e6e73" }}>✕</button>
        </div>

        {/* Contenido scrolleable */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.25rem" }}>

          {/* Estado */}
          <div style={{ padding: "0.75rem 1rem", background: form.estado === "cancelada" ? "#fff2f2" : "#f0fff4", borderRadius: "10px", marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: form.estado === "cancelada" ? "#ff3b30" : "#34C759" }}>
              {form.estado === "cancelada" ? "❌ Cancelada" : "✅ Completada"}
            </span>
            <button onClick={() => setForm(p => ({ ...p, estado: p.estado === "cancelada" ? "completada" : "cancelada" }))}
              style={{
                padding: "0.4rem 0.85rem", borderRadius: "8px", border: "none", cursor: "pointer",
                background: form.estado === "cancelada" ? "#34C759" : "#ff3b30",
                color: "#fff", fontSize: "0.8rem", fontWeight: 600,
              }}>
              {form.estado === "cancelada" ? "Marcar completada" : "Marcar cancelada"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Fecha</label>
              <input type="date" name="fecha_orden" value={form.fecha_orden || ""} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Total a pagar</label>
              <input name="total_pagar" value={form.total_pagar || ""} onChange={handleChange} style={inputStyle} placeholder="$0.00" />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Artículos</label>
            <textarea name="articulos" value={form.articulos || ""} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre del cliente</label>
              <input name="nombre_cliente" value={form.nombre_cliente || ""} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Número de contacto</label>
              <input name="numero_contacto" value={form.numero_contacto || ""} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {tipo === "local" ? (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Municipio</label>
                <select name="municipio" value={form.municipio || ""} onChange={handleChange} style={inputStyle}>
                  {MUNICIPIOS_LOCAL.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Relación con lugar de entrega</label>
                <select name="relacion_entrega" value={form.relacion_entrega || ""} onChange={handleChange} style={inputStyle}>
                  {["Lugar de residencia del cliente", "Lugar de trabajo del cliente", "Lugar de estudio del cliente", "Cliente visitará el lugar durante unas horas", "Cliente llegará al lugar para recibir la orden"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Tipo de entrega</label>
                  <select name="tipo_entrega" value={form.tipo_entrega || ""} onChange={handleChange} style={inputStyle}>
                    {TIPOS_ENTREGA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Departamento</label>
                  <select name="departamento" value={form.departamento || ""} onChange={handleChange} style={inputStyle}>
                    {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Municipio</label>
                <input name="municipio" value={form.municipio || ""} onChange={handleChange} style={inputStyle} />
              </div>
            </>
          )}

          <div style={fieldStyle}>
            <label style={labelStyle}>Dirección de entrega</label>
            <textarea name="direccion_entrega" value={form.direccion_entrega || ""} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Forma de pago</label>
              <select name="forma_pago" value={form.forma_pago || ""} onChange={handleChange} style={inputStyle}>
                {FORMAS_PAGO.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo de comprobante</label>
              <select name="tipo_comprobante" value={form.tipo_comprobante || ""} onChange={handleChange} style={inputStyle}>
                {TIPOS_COMPROBANTE.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Perfil</label>
              <select name={tipo === "local" ? "perfil_salio_1" : "perfil_salio"} value={form.perfil_salio_1 || form.perfil_salio || ""} onChange={handleChange} style={inputStyle}>
                {PERFILES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Quién ingresa</label>
              <select name="quien_ingresa" value={form.quien_ingresa || ""} onChange={handleChange} style={inputStyle}>
                {QUIEN_INGRESA.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Comentario libre</label>
            <textarea name="comentario_libre" value={form.comentario_libre || ""} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} />
          </div>

        </div>
        {/* Fin contenido scrolleable */}

        {/* Botones fijos */}
        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #f5f5f7", marginTop: "0.5rem", flexShrink: 0 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "0.75rem", background: "#f5f5f7", color: "#6e6e73",
            border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: "0.75rem",
            background: saving ? "#e5e5ea" : "#007AFF",
            color: saving ? "#6e6e73" : "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem",
            cursor: saving ? "default" : "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </div>
    </div>
  );
}



// ══ TablaOrdenes ══════════════════════════════════════════
function TablaOrdenes({ ordenes, tipo, onUpdateEnvio, esAdmin, onSave }) {
  const [ordenEditar, setOrdenEditar] = useState(null);
  const [tipoEditar, setTipoEditar] = useState(null);
  const [copiado, setCopiado] = useState(null);
  const [envios, setEnvios] = useState(() => {
    const obj = {};
    ordenes.forEach(o => { obj[o.id] = o.costo_envio || 0; });
    return obj;
  
  });

  function handleEnvioChange(id, valor) {
    setEnvios(prev => ({ ...prev, [id]: parseFloat(valor) || 0 }));
  }

  function handleEnvioBlur(id, valor, tipo) {
    onUpdateEnvio && onUpdateEnvio(id, valor, tipo);
  }
  
  async function cancelarOrden(id, tipo) {
  const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
  await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
    body: JSON.stringify({ estado: "cancelada" }),
  });
  onSave && onSave();
}

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #f5f5f7" }}>
            {["Ficha", "Fecha", "Cliente", "Artículos", tipo === "departamental" ? "Depto" : "Municipio", "Total", "Envío", "Neto", "Perfil", "Vendedor", "Acciones"].map(h => (
              <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#6e6e73", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordenes.length === 0 && (
            <tr><td colSpan={10} style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>No hay órdenes</td></tr>
          )}
          {ordenes.map((o, i) => {
            const total = parseMonto(o.total_pagar);
            const envio = tipo === "departamental" ? ENVIO_DEPTO : (envios[o.id] || 0);
            const neto = total - envio;
            return (
              <tr key={o.id} onClick={() => { setOrdenEditar(o); setTipoEditar(tipo); }}    style={{ borderBottom: "1px solid #f5f5f7", cursor: "pointer" }}>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#007AFF" }}>#{o.numero_ficha || "-"}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>{o.fecha_orden}</td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>{o.nombre_cliente || "Sin nombre"}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#6e6e73", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.articulos}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{tipo === "departamental" ? o.departamento : o.municipio}</td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{o.total_pagar}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  {tipo === "departamental" ? (
                    <span style={{ color: "#ff3b30", fontSize: "0.82rem" }}>-${ENVIO_DEPTO}</span>
                  ) : esAdmin ? (
                    <input
  type="text"
  inputMode="decimal"
  defaultValue={envios[o.id] || 0}
  onClick={e => e.stopPropagation()}
  onFocus={e => { 
    e.stopPropagation();
    e.target.style.border = "1.5px solid #007AFF";}}
  onBlur={e => {
    e.target.style.border = "1.5px solid #e5e5ea";
    handleEnvioChange(o.id, e.target.value);
    handleEnvioBlur(o.id, e.target.value, "local");
  }}
  style={{
    width: 70,
    padding: "0.35rem 0.6rem",
    border: "1.5px solid #e5e5ea",
    borderRadius: "8px",
    fontSize: "0.82rem",
    outline: "none",
    background: "#f5f5f7",
    color: "#1d1d1f",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    textAlign: "center",
  }}
/>
                  ) : (
                    <span style={{ color: "#ff3b30", fontSize: "0.82rem" }}>-${(envios[o.id] || 0).toFixed(2)}</span>
                  )}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#34C759" }}>{formatMoney(neto)}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>{o.perfil_salio_1 || o.perfil_salio || "-"}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>{o.quien_ingresa}</td>

      <td style={{ padding: "0.75rem 1rem" }} onClick={e => e.stopPropagation()}>
  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
    
    {o.estado === "cancelada" && (
      <span style={{ background: "#fff2f2", color: "#ff3b30", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem" }}>Cancelada</span>
    )}

    <button onClick={() => cancelarOrden(o.id, tipo, o.estado === "cancelada" ? "completada" : "cancelada")} 
      title={o.estado === "cancelada" ? "Reactivar" : "Cancelar"}
      style={{
        padding: "0.3rem", background: o.estado === "cancelada" ? "#f0fff4" : "#fff2f2",
        border: "none", borderRadius: "6px", fontSize: "0.78rem",
        cursor: "pointer", color: o.estado === "cancelada" ? "#34C759" : "#ff3b30",
        display: "flex", alignItems: "center",
      }}>
      {o.estado === "cancelada" ? <RefreshCw size={14} /> : <XCircle size={14} />}
    </button>

   <button onClick={() => {
  const texto = "Orden " + o.numero_ficha +
    "\n📅 " + o.fecha_orden +
    "\n📦 " + o.articulos +
    "\n👤 " + (o.nombre_cliente || "Sin nombre") +
    "\n📱 " + (o.numero_contacto || "-") +
    "\n📍 " + (o.municipio || o.departamento || "-") +
    "\n🏠 " + (o.direccion_entrega || "-") +
    "\n🕐 " + (o.hora_limite || "-") +
    "\n💰 " + o.total_pagar +
    "\n💳 " + o.forma_pago + " | " + o.tipo_comprobante +
    "\n📲 " + (o.perfil_salio_1 || o.perfil_salio || "-") +
    "\n👥 " + o.quien_ingresa +
    "\n📝 " + (o.comentario_libre || "Sin notas");
  navigator.clipboard.writeText(texto);
  setCopiado(o.id);
  setTimeout(() => setCopiado(null), 2000);
}} title={copiado === o.id ? "¡Copiado!" : "Copiar orden"}
  style={{
    padding: "0.3rem", 
    background: copiado === o.id ? "rgba(52,199,89,0.1)" : "#f5f5f7",
    border: "none", borderRadius: "6px",
    cursor: "pointer", 
    color: copiado === o.id ? "#34C759" : "#6e6e73",
    display: "flex", alignItems: "center",
  }}>
  {copiado === o.id ? <Check size={14} /> : <Copy size={14} />}
</button>
  </div>

</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {ordenEditar && (
  <ModalEditar
    orden={ordenEditar}
    tipo={tipoEditar}
    onClose={() => setOrdenEditar(null)}
    onSave={() => {setOrdenEditar(null); onSave && onSave(); }}
  />
)}
    </div>
  );
}


// ══ Componente de gráficas comparativas para Dashboard ══

function GraficasComparativas() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semanaActual, setSemanaActual] = useState(0);
  const [semanaAnterior, setSemanaAnterior] = useState(0);
  const [mesActual, setMesActual] = useState(0);
  const [mesAnterior, setMesAnterior] = useState(0);

  useEffect(() => { cargarComparativas(); }, []);

  async function cargarComparativas() {
    setLoading(true);
    const hoy = new Date();

    // Rangos
    const inicioSemana = new Date(hoy); inicioSemana.setDate(hoy.getDate() - 6);
    const inicioSemanaAnt = new Date(hoy); inicioSemanaAnt.setDate(hoy.getDate() - 13);
    const finSemanaAnt = new Date(hoy); finSemanaAnt.setDate(hoy.getDate() - 7);
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioMesAnt = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const finMesAnt = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    const fmt = d => d.toISOString().split("T")[0];

    const [resL, resD] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + fmt(inicioSemanaAnt) + "&order=fecha_orden.asc", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + fmt(inicioSemanaAnt) + "&order=fecha_orden.asc", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
    ]);

    const locales = await resL.json();
    const deptos = await resD.json();
    const todas = [
      ...locales.filter(o => o.estado !== "cancelada").map(o => ({ ...o, neto: parseMonto(o.total_pagar) - (o.costo_envio || 0) })),
      ...deptos.filter(o => o.estado !== "cancelada").map(o => ({ ...o, neto: parseMonto(o.total_pagar) - ENVIO_DEPTO })),
    ];

    // Ventas por día últimas 2 semanas
    const ventasPorDia = {};
    todas.forEach(o => {
      if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = 0;
      ventasPorDia[o.fecha_orden] += o.neto;
    });

    // Generar últimos 14 días
    const chartData = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      const key = fmt(d);
      chartData.push({ 
        fecha: key.slice(5), // MM-DD
        valor: ventasPorDia[key] || 0,
        semana: i >= 7 ? "anterior" : "actual"
      });
    }
    setDatos(chartData);

    // Totales comparativos
    const swActual = todas.filter(o => o.fecha_orden >= fmt(inicioSemana)).reduce((s, o) => s + o.neto, 0);
    const swAnterior = todas.filter(o => o.fecha_orden >= fmt(inicioSemanaAnt) && o.fecha_orden <= fmt(finSemanaAnt)).reduce((s, o) => s + o.neto, 0);
    const smActual = todas.filter(o => o.fecha_orden >= fmt(inicioMes)).reduce((s, o) => s + o.neto, 0);
    const smAnterior = todas.filter(o => o.fecha_orden >= fmt(inicioMesAnt) && o.fecha_orden <= fmt(finMesAnt)).reduce((s, o) => s + o.neto, 0);

    setSemanaActual(swActual);
    setSemanaAnterior(swAnterior);
    setMesActual(smActual);
    setMesAnterior(smAnterior);
    setLoading(false);
  }

  function Tendencia({ actual, anterior, label }) {
    const diff = anterior === 0 ? 100 : ((actual - anterior) / anterior) * 100;
    const sube = diff >= 0;
    return (
      <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{label}</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{formatMoney(actual)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.35rem" }}>
          <span style={{ 
            background: sube ? "rgba(52,199,89,0.1)" : "rgba(255,59,48,0.1)",
            color: sube ? "#34C759" : "#ff3b30",
            borderRadius: "6px", padding: "0.15rem 0.4rem",
            fontSize: "0.75rem", fontWeight: 700,
          }}>
            {sube ? "↑" : "↓"} {Math.abs(diff).toFixed(1)}%
          </span>
          <span style={{ color: "#6e6e73", fontSize: "0.75rem" }}>vs período anterior</span>
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6e6e73", marginTop: "0.2rem" }}>Anterior: {formatMoney(anterior)}</div>
      </div>
    );
  }

  // Separar datos semana actual vs anterior para gráfica
  const dataSemanaActual = datos.filter(d => d.semana === "actual");
  const dataSemanaAnterior = datos.filter(d => d.semana === "anterior");
  const chartMerged = dataSemanaActual.map((d, i) => ({
    dia: d.fecha,
    actual: d.valor,
    anterior: dataSemanaAnterior[i]?.valor || 0,
  }));

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Cards comparativas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
        {loading ? (
          [1, 2].map(i => <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", height: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }} />)
        ) : (
          <>
            <Tendencia actual={semanaActual} anterior={semanaAnterior} label="Esta semana" />
            <Tendencia actual={mesActual} anterior={mesAnterior} label="Este mes" />
          </>
        )}
      </div>

      {/* Gráfica de línea tipo bolsa */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Esta semana vs semana anterior
          </div>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#6e6e73" }}>
              <div style={{ width: 12, height: 2, background: "#007AFF", borderRadius: 2 }} /> Esta semana
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#6e6e73" }}>
              <div style={{ width: 12, height: 2, background: "#e5e5ea", borderRadius: 2, borderStyle: "dashed" }} /> Semana anterior
            </span>
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Cargando...</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartMerged}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: "#6e6e73" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6e6e73" }} tickFormatter={v => "$" + v.toFixed(0)} />
              <Tooltip formatter={v => formatMoney(v)} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="actual" name="Esta semana" stroke="#007AFF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="anterior" name="Semana anterior" stroke="#e5e5ea" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}


// == Dashboard ═══════════════════════════════════════════════
function Dashboard({ user }) {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const ultimaOrdenRef = useRef(null);
  const ordenesRef = useRef([]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  function reproducirSonido() {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio bloqueado:", e));
  }

  function cargarDatos() {
    const hoy = fechaHoy();
    Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + hoy + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + hoy + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]).then(async ([resL, resD]) => {
      const localesData = await resL.json();
      const deptosData = await resD.json();

      const todasNuevas = [...localesData, ...deptosData];
      const ultima = todasNuevas.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))[0];

      // Detectar orden nueva
      if (ultimaOrdenRef.current && ultima && ultima.id !== ultimaOrdenRef.current) {
        reproducirSonido();
        if (Notification.permission === "granted") {
          new Notification("🛒 Nueva orden!", {
            body: ultima.numero_ficha + " — " + (ultima.nombre_cliente || "Sin nombre") + " — " + ultima.total_pagar,
            icon: "/logo.png",
          });
        }
      }
      ultimaOrdenRef.current = ultima?.id;

      // Detectar órdenes editadas
      todasNuevas.forEach(orden => {
        const anterior = ordenesRef.current.find(o => o.id === orden.id);
        if (anterior && JSON.stringify(anterior) !== JSON.stringify(orden)) {
          if (Notification.permission === "granted") {
            new Notification("✏️ Orden editada", {
              body: orden.numero_ficha + " — " + (orden.nombre_cliente || "Sin nombre") + " fue modificada",
              icon: "/logo.png",
            });
          }
        }
      });
      ordenesRef.current = todasNuevas;

      setLocales(localesData);
      setDeptos(deptosData);
      setLoading(false);
    });
  }

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalL = locales.reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = deptos.reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);
  const totalGeneral = totalL + totalD;
  const ultimaOrden = [...locales, ...deptos].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))[0];

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "¡Buenos días" : hora < 18 ? "¡Buenas tardes" : "¡Buenas noches";
  const frase = hora < 9 ? "☕ ¿Un café antes de empezar?"
    : hora < 12 ? "💪 ¡A darle con todo esta mañana!"
    : hora === 12 ? "🍽️ Es hora de almorzar, ¿Ya almorzaste?"
    : hora === 13 ? "😴 ¿Se te cayeron los ojos después del almuerzo?"
    : hora < 16 ? "🚀 ¡La tarde está despegando!"
    : hora < 18 ? "🌅 ¡Ya casi terminamos el día!"
    : hora < 20 ? "🌙 ¡Qué tarde tan productiva!"
    : "⭐ ¡Trabajando hasta tarde, así se logran las metas!";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", position: "relative" }}>

      {/* Bolitas de fondo */}
      <div style={{ position: "fixed", top: 80, left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: 200, right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,199,89,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 100, left: "30%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Saludo */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 0.35rem", letterSpacing: "-0.03em" }}>
            {saludo}, {user.nombre.split(" ")[0]}! 👋
          </h1>
          <p style={{ color: "#6e6e73", fontSize: "1rem", margin: "0 0 0.25rem" }}>
            ¿Cuántas ventas hicimos hoy?
          </p>
          <p style={{ color: "#007AFF", fontSize: "0.9rem", fontWeight: 500, margin: 0 }}>
            {frase}
          </p>
        </div>

        <GraficasComparativas />

        {/* Cards principales */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Total órdenes hoy", value: (locales.length + deptos.length).toString(), sub: locales.length + " locales · " + deptos.length + " deptos", accent: "#007AFF" },
                { label: "Total vendido hoy", value: formatMoney(totalGeneral), sub: "Neto sin envíos", accent: "#1d1d1f" },
                { label: "Locales", value: formatMoney(totalL), sub: locales.length + " órdenes" },
                { label: "Departamentales", value: formatMoney(totalD), sub: deptos.length + " órdenes · -$" + ENVIO_DEPTO + " c/u" },
              ].map((card, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{card.label}</div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, color: card.accent || "#1d1d1f", letterSpacing: "-0.02em" }}>{card.value}</div>
                  <div style={{ fontSize: "0.78rem", color: "#6e6e73", marginTop: "0.25rem" }}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Última orden */}
            {ultimaOrden && (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Última orden recibida</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <span style={{ background: "#007AFF", color: "#fff", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.75rem", fontWeight: 700 }}>Orden {ultimaOrden.numero_ficha}</span>
                      <span style={{ color: "#1d1d1f", fontWeight: 600 }}>{ultimaOrden.nombre_cliente || "Sin nombre"}</span>
                    </div>
                    <div style={{ color: "#6e6e73", fontSize: "0.82rem" }}>{ultimaOrden.articulos?.slice(0, 60)}{ultimaOrden.articulos?.length > 60 ? "…" : ""}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{ultimaOrden.total_pagar}</div>
                    <div style={{ color: "#6e6e73", fontSize: "0.78rem" }}>{ultimaOrden.quien_ingresa}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Resumen por vendedor hoy */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Ventas por vendedor hoy</div>
              {(() => {
                const porV = {};
                locales.forEach(o => {
                  const v = o.quien_ingresa || "Sin asignar";
                  if (!porV[v]) porV[v] = { total: 0, ordenes: 0 };
                  porV[v].total += parseMonto(o.total_pagar) - (o.costo_envio || 0);
                  porV[v].ordenes++;
                });
                deptos.forEach(o => {
                  const v = o.quien_ingresa || "Sin asignar";
                  if (!porV[v]) porV[v] = { total: 0, ordenes: 0 };
                  porV[v].total += parseMonto(o.total_pagar) - ENVIO_DEPTO;
                  porV[v].ordenes++;
                });
                const vendedores = Object.entries(porV);
                if (vendedores.length === 0) return <div style={{ color: "#6e6e73", fontSize: "0.85rem" }}>No hay órdenes hoy</div>;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {vendedores.map(([nombre, data], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: i < vendedores.length - 1 ? "1px solid #f5f5f7" : "none" }}>
                        <div>
                          <span style={{ fontWeight: 500, color: "#1d1d1f", fontSize: "0.88rem" }}>{nombre}</span>
                          <span style={{ color: "#6e6e73", fontSize: "0.78rem", marginLeft: "0.5rem" }}>{data.ordenes} orden{data.ordenes !== 1 ? "es" : ""}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: 700, color: "#007AFF", fontSize: "0.95rem" }}>{formatMoney(data.total)}</span>
                          <span style={{ color: "#34C759", fontSize: "0.78rem", marginLeft: "0.5rem" }}>+{formatMoney(data.total * COMISION)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ══ AdminOrdenes ══════════════════════════════════════════
function AdminOrdenes() {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [filtroVendedor, setFiltroVendedor] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("");
  const [tab, setTab] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [rangoFecha, setRangoFecha] = useState("dia");

  const vendedores = [
    "Tecno Gadget - Fer", "Tecno Gadget - Jefferson", "Tecno Gadget - Wendy",
    "Tecno Gadget - Liss", "Tecno Gadget - Isa", "Tecno Gadget - Josue",
    "Maressa (Vend)", "Yanci (Vend)", "Sara Eunice (Vend)",
    "Kevin (Vend)", "Marisol (Vend)", "Herbert (Vend)",
  ];

  const perfiles = [
    "Instagram", "Facebook", "TikTok", "WhatsApp Principal",
    "WhatsApp Secundario", "Inbox Pagina FB", "Referido", "Otro",
  ];

  useEffect(() => { cargarOrdenes(); }, [filtroFecha, rangoFecha]);

  async function cargarOrdenes() {
    setLoading(true);
    try {
      const urlFiltro = rangoFecha === "dia"
        ? "fecha_orden=eq." + filtroFecha
        : "fecha_orden=lte." + filtroFecha;

      const [resL, resD] = await Promise.all([
        fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?" + urlFiltro + "&order=creado_en.desc", {
          headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
        }),
        fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?" + urlFiltro + "&order=creado_en.desc", {
          headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
        }),
      ]);
      setLocales(await resL.json());
      setDeptos(await resD.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function actualizarEnvio(id, valor, tipo) {
    const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
    await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ costo_envio: parseFloat(valor) }),
    });
  }

  function exportarExcel() {
  const datos = todosF.map(o => ({
    "Ficha": o.numero_ficha,
    "Fecha": o.fecha_orden,
    "Cliente": o.nombre_cliente,
    "Artículos": o.articulos,
    "Municipio/Depto": o.municipio || o.departamento,
    "Dirección": o.direccion_entrega,
    "Total": o.total_pagar,
    "Envío": o.costo_envio || ENVIO_DEPTO,
    "Neto": parseMonto(o.total_pagar) - (o.departamento ? ENVIO_DEPTO : (o.costo_envio || 0)),
    "Forma de pago": o.forma_pago,
    "Perfil": o.perfil_salio_1 || o.perfil_salio,
    "Vendedor": o.quien_ingresa,
    "Estado": o.estado,
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Órdenes");
  XLSX.writeFile(wb, "ordenes-" + filtroFecha + ".xlsx");
}


  function filtrar(lista) {
    return lista.filter(o => {
      if (filtroVendedor && o.quien_ingresa !== filtroVendedor) return false;
      if (filtroPerfil && (o.perfil_salio_1 || o.perfil_salio) !== filtroPerfil) return false;
      if (busqueda) {
        const b = busqueda.toLowerCase();
        return (
          (o.numero_ficha && o.numero_ficha.toLowerCase().includes(b)) ||
          (o.nombre_cliente && o.nombre_cliente.toLowerCase().includes(b)) ||
          (o.articulos && o.articulos.toLowerCase().includes(b))
        );
      }
      return true;
    });
  }

  const lF = filtrar(locales);
  const dF = filtrar(deptos);
  const todosF = [...lF, ...dF].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));

  const totalL = lF.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = dF.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);

  const selectStyle = {
    padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px",
    fontSize: "0.85rem", background: "#fff", color: "#1d1d1f", outline: "none",
    fontFamily: "'Inter', sans-serif",
  };

  const tabStyle = (active) => ({
    padding: "0.45rem 1rem", borderRadius: "8px", border: "none",
    background: active ? "#007AFF" : "transparent",
    color: active ? "#fff" : "#6e6e73",
    fontWeight: active ? 600 : 400, fontSize: "0.85rem", cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Órdenes</h2>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          type="date"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
          style={selectStyle}
        />
        <button onClick={() => setRangoFecha(rangoFecha === "dia" ? "todo" : "dia")} style={{
          padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px",
          fontSize: "0.85rem", background: rangoFecha === "todo" ? "#007AFF" : "#fff",
          color: rangoFecha === "todo" ? "#fff" : "#1d1d1f", cursor: "pointer",
          fontFamily: "'Inter', sans-serif", fontWeight: rangoFecha === "todo" ? 600 : 400,
        }}>
          {rangoFecha === "todo" ? "Hasta hoy" : "Solo hoy"}
        </button> 
       <button onClick={exportarExcel} style={{
  padding: "0.5rem 0.85rem", background: "#34C759", color: "#fff",
  border: "none", borderRadius: "10px", fontWeight: 600,
  fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Inter', sans-serif",
  display: "flex", alignItems: "center", gap: "0.35rem",
}}>
  <Download size={15} /> Exportar Excel
</button>

        <select value={filtroVendedor} onChange={e => setFiltroVendedor(e.target.value)} style={selectStyle}>
          <option value="">Todos los vendedores</option>
          {vendedores.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={filtroPerfil} onChange={e => setFiltroPerfil(e.target.value)} style={selectStyle}>
          <option value="">Todos los perfiles</option>
          {perfiles.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input
          placeholder="Buscar ficha, cliente o artículo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ ...selectStyle, minWidth: 220 }}

        


        />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Locales (neto)" value={formatMoney(totalL)} sub={lF.length + " órdenes"} />
        <StatCard label="Deptos (neto)" value={formatMoney(totalD)} sub={dF.length + " órdenes"} />
        <StatCard label="Total General" value={formatMoney(totalL + totalD)} sub={todosF.length + " órdenes"} accent="#007AFF" />
      </div>

      {/* Tabs y tabla */}
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "0.25rem", padding: "0.75rem 1rem", borderBottom: "1px solid #f5f5f7" }}>
          <button onClick={() => setTab("todos")} style={tabStyle(tab === "todos")}>Todos ({todosF.length})</button>
          <button onClick={() => setTab("locales")} style={tabStyle(tab === "locales")}>Locales ({lF.length})</button>
          <button onClick={() => setTab("departamentales")} style={tabStyle(tab === "departamentales")}>Departamentales ({dF.length})</button>
        </div>
        {loading
          ? <div style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>Cargando...</div>
          : tab === "todos"
          ? <TablaOrdenes ordenes={todosF} tipo="local" onUpdateEnvio={actualizarEnvio} esAdmin={true} onSave={cargarOrdenes} />
          : tab === "locales"
          ? <TablaOrdenes ordenes={lF} tipo="local" onUpdateEnvio={actualizarEnvio} esAdmin={true} onSave={cargarOrdenes} />
          : <TablaOrdenes ordenes={dF} tipo="departamental" esAdmin={true} onSave={cargarOrdenes} />
        }
      </div> 
    </div>
  );
}

// ══ AdminEstadisticas ═════════════════════════════════════
function AdminEstadisticas() {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState("semana");

  useEffect(() => { cargarTodo(); }, [rango]);

  async function cargarTodo() {
    setLoading(true);
    const dias = rango === "semana" ? 7 : rango === "mes" ? 30 : 90;
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);
    const desdeStr = desde.toISOString().split("T")[0];
    const [resL, resD] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + desdeStr + "&order=fecha_orden.asc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + desdeStr + "&order=fecha_orden.asc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]);
    setLocales(await resL.json());
    setDeptos(await resD.json());
    setLoading(false);
  }

  const todas = [...locales, ...deptos].filter(o => o.estado !== "cancelada");

  // Ventas por día
  const ventasPorDia = {};
  locales.filter(o => o.estado !== "cancelada").forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = { fecha: o.fecha_orden, locales: 0, deptos: 0 };
    ventasPorDia[o.fecha_orden].locales += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptos.filter(o => o.estado !== "cancelada").forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = { fecha: o.fecha_orden, locales: 0, deptos: 0 };
    ventasPorDia[o.fecha_orden].deptos += parseMonto(o.total_pagar) - ENVIO_DEPTO;
  });
  const chartData = Object.values(ventasPorDia).sort((a, b) => a.fecha.localeCompare(b.fecha));

  // Por perfil
  const porPerfil = {};
  todas.forEach(o => {
    const p = o.perfil_salio_1 || o.perfil_salio || "Sin perfil";
    porPerfil[p] = (porPerfil[p] || 0) + 1;
  });
  const pieData = Object.entries(porPerfil).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Por forma de pago
  const porPago = {};
  todas.forEach(o => {
    const p = o.forma_pago || "Sin forma";
    porPago[p] = (porPago[p] || 0) + 1;
  });
  const pieDataPago = Object.entries(porPago).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Por vendedor
  const porVendedor = {};
  todas.forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, total: 0, ordenes: 0 };
    const envio = o.departamento ? ENVIO_DEPTO : (o.costo_envio || 0);
    porVendedor[v].total += parseMonto(o.total_pagar) - envio;
    porVendedor[v].ordenes++;
  });
  const vendedoresData = Object.values(porVendedor).sort((a, b) => b.total - a.total).slice(0, 6);

  // Top municipios/departamentos
  const porUbicacion = {};
  todas.forEach(o => {
    const ub = o.departamento || o.municipio || "Sin ubicación";
    porUbicacion[ub] = (porUbicacion[ub] || 0) + 1;
  });
  const ubicacionData = Object.entries(porUbicacion).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const totalL = locales.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = deptos.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);
  const canceladas = [...locales, ...deptos].filter(o => o.estado === "cancelada").length;

  const btnStyle = (active) => ({
    padding: "0.4rem 0.85rem", borderRadius: "8px",
    background: active ? "#007AFF" : "#f5f5f7",
    color: active ? "#fff" : "#6e6e73",
    border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: active ? 600 : 400,
    fontFamily: "'Inter', sans-serif",
  });

  const cardChart = (children, title) => (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1.25rem" }}>{title}</div>
      {loading ? <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Cargando...</div> : children}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Estadísticas</h2>
        <div style={{ display: "flex", gap: "0.35rem", background: "#f5f5f7", borderRadius: "10px", padding: "0.25rem" }}>
          {["semana", "mes", "trimestre"].map(r => <button key={r} onClick={() => setRango(r)} style={btnStyle(rango === r)}>{r}</button>)}
        </div>
      </div>

      {/* Cards resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Locales" value={formatMoney(totalL)} />
        <StatCard label="Total Deptos" value={formatMoney(totalD)} />
        <StatCard label="Gran Total" value={formatMoney(totalL + totalD)} accent="#007AFF" />
        <StatCard label="Órdenes" value={(locales.length + deptos.length - canceladas).toString()} />
        <StatCard label="Canceladas" value={canceladas.toString()} accent="#ff3b30" />
      </div>

      {/* Fila 1: Ventas por día + Por perfil */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        {cardChart(
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
              <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: "#6e6e73" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6e6e73" }} />
              <Tooltip formatter={v => formatMoney(v)} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="locales" name="Locales" fill="#007AFF" radius={[6, 6, 0, 0]} />
              <Bar dataKey="deptos" name="Deptos" fill="#34C759" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>,
          "Ventas por día"
        )}

        {cardChart(
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "0.75rem" }}>
              {pieData.map((entry, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem", fontSize: "0.78rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span style={{ color: "#1d1d1f" }}>{entry.name}</span>
                  </div>
                  <span style={{ color: "#6e6e73", fontWeight: 600 }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </>,
          "Por perfil"
        )}
      </div>

      {/* Fila 2: Por vendedor + Forma de pago */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        {cardChart(
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vendedoresData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#6e6e73" }} tickFormatter={v => "$" + v.toFixed(0)} />
              <YAxis type="category" dataKey="vendedor" tick={{ fontSize: 10, fill: "#6e6e73" }} width={120} />
              <Tooltip formatter={v => formatMoney(v)} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="total" name="Ventas" fill="#5856D6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>,
          "Ventas por vendedor"
        )}

        {cardChart(
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieDataPago} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value">
                  {pieDataPago.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "0.75rem" }}>
              {pieDataPago.map((entry, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem", fontSize: "0.78rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span style={{ color: "#1d1d1f" }}>{entry.name}</span>
                  </div>
                  <span style={{ color: "#6e6e73", fontWeight: 600 }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </>,
          "Forma de pago"
        )}
      </div>

      {/* Fila 3: Top ubicaciones */}
      {cardChart(
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {ubicacionData.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1d1d1f", width: 160, flexShrink: 0 }}>{u.name}</div>
              <div style={{ flex: 1, background: "#f5f5f7", borderRadius: "6px", overflow: "hidden", height: 8 }}>
                <div style={{ width: (u.value / ubicacionData[0].value * 100) + "%", height: "100%", background: "#007AFF", borderRadius: "6px" }} />
              </div>
              <div style={{ fontSize: "0.78rem", color: "#6e6e73", fontWeight: 600, width: 30, textAlign: "right" }}>{u.value}</div>
            </div>
          ))}
        </div>,
        "Top municipios / departamentos"
      )}
    </div>
  );
}


// == PerfilVendedor =========================================
function PerfilVendedor({ vendedor, onClose }) {
  const [ordenes, setOrdenes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState("mes");
  const [tab, setTab] = useState("ordenes");
  const [pagando, setPagando] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [comisionPagada, setComisionPagada] = useState(false);

  useEffect(() => { cargarDatos(); }, [rango]);

  async function cargarDatos() {
    setLoading(true);
    const hoy = new Date();
    let desde;
    if (rango === "semana") {
      desde = new Date(hoy); desde.setDate(hoy.getDate() - 7);
    } else if (rango === "mes") {
      desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    } else {
      desde = new Date(hoy.getFullYear(), 0, 1);
    }

    const desdeStr = desde.toISOString().split("T")[0];
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0];
    const nombre = encodeURIComponent(vendedor);

    const [resL, resD, resLTodo, resDTodo, resPago] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + desdeStr + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + desdeStr + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/pagos_comisiones?vendedor=eq." + nombre + "&fecha_pago=gte." + inicioMes, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]);

    const l = await resL.json();
    const d = await resD.json();
    const lTodo = await resLTodo.json();
    const dTodo = await resDTodo.json();
    const pagos = await resPago.json();

    setOrdenes([...l, ...d].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en)));
    setTodos([...lTodo, ...dTodo]);
    if (pagos.length > 0) setComisionPagada(true);
    setLoading(false);
  }

  async function registrarPago() {
    setPagando(true);
    await fetch(SUPABASE_URL + "/rest/v1/pagos_comisiones", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ vendedor: vendedor, monto: comision }),
    });
    setPagando(false);
    setPagado(true);
    setComisionPagada(true);
    setShowConfirm(false);
    setTimeout(() => setPagado(false), 3000);
  }

  const ordenesActivas = ordenes.filter(o => o.estado !== "cancelada");
  const totalVendido = ordenesActivas.reduce((s, o) => {
    const envio = o.departamento ? ENVIO_DEPTO : (o.costo_envio || 0);
    return s + parseMonto(o.total_pagar) - envio;
  }, 0);
  const comision = comisionPagada ? 0 : totalVendido * COMISION;
  const totalHistorico = todos.filter(o => o.estado !== "cancelada").reduce((s, o) => {
    const envio = o.departamento ? ENVIO_DEPTO : (o.costo_envio || 0);
    return s + parseMonto(o.total_pagar) - envio;
  }, 0);

  const ventasPorDia = {};
  ordenesActivas.forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = 0;
    const envio = o.departamento ? ENVIO_DEPTO : (o.costo_envio || 0);
    ventasPorDia[o.fecha_orden] += parseMonto(o.total_pagar) - envio;
  });
  const chartData = Object.entries(ventasPorDia).map(([fecha, total]) => ({ fecha, total })).sort((a, b) => a.fecha.localeCompare(b.fecha));

  const btnStyle = (active) => ({
    padding: "0.4rem 0.85rem", borderRadius: "8px",
    background: active ? "#007AFF" : "#f5f5f7",
    color: active ? "#fff" : "#6e6e73",
    border: "none", cursor: "pointer", fontSize: "0.82rem",
    fontWeight: active ? 600 : 400, fontFamily: "'Inter', sans-serif",
  });

  const tabStyle = (active) => ({
    padding: "0.45rem 1rem", borderRadius: "8px", border: "none",
    background: active ? "#007AFF" : "transparent",
    color: active ? "#fff" : "#6e6e73",
    fontWeight: active ? 600 : 400, fontSize: "0.85rem", cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", fontFamily: "'Inter', sans-serif",
    }} onClick={onClose}>
      <div style={{
        background: "#f5f5f7", borderRadius: "20px",
        width: "100%", maxWidth: 680,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }} onClick={e => e.stopPropagation()}>

        {/* Header oscuro */}
        <div style={{ background: "#1c1c1e", padding: "1.5rem", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>
              {vendedor.charAt(0)}
            </div>
            <div>
              <h2 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>{vendedor}</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>Vendedor · {todos.length} órdenes históricas</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            {[
              { label: "Vendido", value: formatMoney(totalVendido) },
              { label: "Comisión", value: formatMoney(comision), green: true },
              { label: "Histórico", value: formatMoney(totalHistorico) },
            ].map((card, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "0.85rem 1rem" }}>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>{card.label}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: card.green ? "#34C759" : "#fff" }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Botón pago */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={comisionPagada || comision === 0}
            style={{
              width: "100%", padding: "0.75rem",
              background: comisionPagada ? "rgba(52,199,89,0.15)" : comision === 0 ? "rgba(255,255,255,0.05)" : "#34C759",
              color: comisionPagada ? "#34C759" : comision === 0 ? "rgba(255,255,255,0.3)" : "#fff",
              border: "none", borderRadius: "12px",
              fontWeight: 600, fontSize: "0.9rem",
              cursor: comisionPagada || comision === 0 ? "default" : "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}>
            {comisionPagada
              ? <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle size={16} /> Comisión pagada este mes</span>
              : <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Banknote size={16} /> Marcar comisión como pagada — {formatMoney(comision)}</span>
            }
          </button>
        </div>

        {/* Controles */}
        <div style={{ background: "#fff", padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f5f5f7" }}>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <button onClick={() => setTab("ordenes")} style={tabStyle(tab === "ordenes")}>Órdenes</button>
            <button onClick={() => setTab("grafica")} style={tabStyle(tab === "grafica")}>Gráfica</button>
          </div>
          <div style={{ display: "flex", gap: "0.35rem", background: "#f5f5f7", borderRadius: "10px", padding: "0.25rem" }}>
            {["semana", "mes", "año"].map(r => <button key={r} onClick={() => setRango(r)} style={btnStyle(rango === r)}>{r}</button>)}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div>
          ) : tab === "grafica" ? (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>Ventas por día</div>
              {chartData.length === 0 ? (
                <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Sin datos</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: "#6e6e73" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#6e6e73" }} />
                    <Tooltip formatter={v => formatMoney(v)} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="total" name="Ventas" fill="#007AFF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {ordenes.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73" }}>No hay órdenes en este período</div>
              ) : ordenes.map((o, i) => {
                const esDep = !!o.departamento;
                const envio = esDep ? ENVIO_DEPTO : (o.costo_envio || 0);
                const neto = parseMonto(o.total_pagar) - envio;
                const cancelada = o.estado === "cancelada";
                return (
                  <div key={o.id} style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", opacity: cancelada ? 0.5 : 1, borderLeft: cancelada ? "3px solid #ff3b30" : "3px solid transparent" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                          <span style={{ background: esDep ? "rgba(88,86,214,0.1)" : "rgba(0,122,255,0.1)", color: esDep ? "#5856D6" : "#007AFF", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 700 }}>{o.numero_ficha}</span>
                          {cancelada && <span style={{ background: "#fff2f2", color: "#ff3b30", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 600 }}>Cancelada</span>}
                        </div>
                        <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.88rem" }}>{o.nombre_cliente || "Sin nombre"}</div>
                        <div style={{ color: "#6e6e73", fontSize: "0.75rem", marginTop: "0.1rem" }}>{o.fecha_orden} · {esDep ? o.departamento : o.municipio}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: "#1d1d1f", fontSize: "1rem" }}>{o.total_pagar}</div>
                        <div style={{ color: "#34C759", fontSize: "0.75rem", fontWeight: 600 }}>+{formatMoney(neto * COMISION)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmación pago */}
      {showConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "2rem",
            maxWidth: 360, width: "100%", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💰</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 0.5rem" }}>Confirmar pago</h3>
            <p style={{ color: "#6e6e73", fontSize: "0.88rem", margin: "0 0 1.5rem" }}>
              ¿Confirmas el pago de <strong style={{ color: "#34C759" }}>{formatMoney(comision)}</strong> a {vendedor.replace("(Vend)", "").trim()}?
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: "0.75rem", background: "#f5f5f7",
                border: "none", borderRadius: "10px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Inter', sans-serif", color: "#6e6e73",
              }}>Cancelar</button>
              <button onClick={registrarPago} disabled={pagando} style={{
                flex: 2, padding: "0.75rem", background: "#34C759",
                border: "none", borderRadius: "10px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Inter', sans-serif", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}>
                {pagando ? "Procesando..." : <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle size={16} /> Confirmar pago</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ══ AdminVendedores ═══════════════════════════════════════
function AdminVendedores() {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [localesMes, setLocalesMes] = useState([]);
  const [deptosMes, setDeptosMes] = useState([]);
  const [todosVendedores, setTodosVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [busqueda, setBusqueda] = useState("");
  const [perfilVendedor, setPerfilVendedor] = useState(null);

  const VENDEDORES_EXTERNOS = [
    "Maressa (Vend)",
    "Yanci (Vend)",
    "Sara Eunice (Vend)",
    "Kevin (Vend)",
    "Marisol (Vend)",
    "Herbert (Vend)",
    "Pedido de Pagina Web"
  ];

  useEffect(() => { cargarTodo(); }, [filtroFecha]);

  async function cargarTodo() {
    setLoading(true);
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0];

    const [resL, resD, resLMes, resDMes, resVendedores] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + inicioMes, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + inicioMes, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/usuarios?rol=eq.vendedor&activo=eq.true", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
    ]);
    setLocales(await resL.json());
    setDeptos(await resD.json());
    setLocalesMes(await resLMes.json());
    setDeptosMes(await resDMes.json());
    setTodosVendedores(await resVendedores.json());
    setLoading(false);
  }

  // Ventas del día
  const porVendedor = {};
  locales.forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    if (!VENDEDORES_EXTERNOS.includes(v)) return;
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, ordenes: 0, total: 0 };
    porVendedor[v].ordenes++;
    porVendedor[v].total += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptos.forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    if (!VENDEDORES_EXTERNOS.includes(v)) return;
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, ordenes: 0, total: 0 };
    porVendedor[v].ordenes++;
    porVendedor[v].total += parseMonto(o.total_pagar) - ENVIO_DEPTO;
  });

  // Ventas del mes para ranking
  const porVendedorMes = {};
  localesMes.filter(o => o.estado !== "cancelada").forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    if (!VENDEDORES_EXTERNOS.includes(v)) return;
    if (!porVendedorMes[v]) porVendedorMes[v] = { vendedor: v, total: 0 };
    porVendedorMes[v].total += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptosMes.filter(o => o.estado !== "cancelada").forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    if (!VENDEDORES_EXTERNOS.includes(v)) return;
    if (!porVendedorMes[v]) porVendedorMes[v] = { vendedor: v, total: 0 };
    porVendedorMes[v].total += parseMonto(o.total_pagar) - ENVIO_DEPTO;
  });

  const rankingMes = Object.values(porVendedorMes)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const medallas = ["🥇", "🥈", "🥉"];
  const coloresPodio = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const altosPodio = [80, 60, 45];

  const vendedoresFiltrados = todosVendedores
    .filter(u => VENDEDORES_EXTERNOS.includes(u.nombre))
    .filter(u => u.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Vendedores</h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            placeholder="Buscar vendedor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.85rem", background: "#fff", outline: "none", fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            style={{ padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.85rem", background: "#fff", outline: "none" }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div>
      ) : (
        <>
          {/* Podio del mes */}
          {rankingMes.length > 0 && (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1.5rem", textAlign: "center" }}>
                🏆 Ranking del mes
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem" }}>
                {/* Reordenar para que el 1ro esté en el centro */}
                {[rankingMes[1], rankingMes[0], rankingMes[2]].map((v, i) => {
                  if (!v) return <div key={i} style={{ width: 120 }} />;
                  const posReal = i === 0 ? 1 : i === 1 ? 0 : 2;
                  return (
                    <div key={i} onClick={() => setPerfilVendedor(v.vendedor)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: 120 }}>
                      <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{medallas[posReal]}</div>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: coloresPodio[posReal], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                        {v.vendedor.charAt(0)}
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1d1d1f", textAlign: "center", marginBottom: "0.25rem" }}>
                        {v.vendedor.replace("(Vend)", "").trim()}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: coloresPodio[posReal] }}>{formatMoney(v.total)}</div>
                      <div style={{
                        width: "100%", marginTop: "0.75rem",
                        height: altosPodio[posReal],
                        background: coloresPodio[posReal] + "22",
                        borderRadius: "8px 8px 0 0",
                        border: "2px solid " + coloresPodio[posReal] + "44",
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cards vendedores */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {vendedoresFiltrados.map((u, i) => {
              const datos = porVendedor[u.nombre] || { ordenes: 0, total: 0 };
              return (
                <div key={i} onClick={() => setPerfilVendedor(u.nombre)} style={{
                  background: "#fff", borderRadius: "16px",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  transition: "transform 0.15s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.95rem" }}>{u.nombre}</div>
                      <div style={{ color: "#6e6e73", fontSize: "0.78rem", marginTop: "0.2rem" }}>{datos.ordenes} orden{datos.ordenes !== 1 ? "es" : ""} hoy</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>
                      {u.nombre.charAt(0)}
                    </div>
                  </div>
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f5f5f7", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total vendido</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{formatMoney(datos.total)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Comisión 10%</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34C759", letterSpacing: "-0.02em" }}>{formatMoney(datos.total * COMISION)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {vendedoresFiltrados.length === 0 && (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem", textAlign: "center", color: "#6e6e73", gridColumn: "1/-1" }}>
                No hay vendedores
              </div>
            )}
          </div>
        </>
      )}

      {perfilVendedor && (
        <PerfilVendedor
          vendedor={perfilVendedor}
          onClose={() => setPerfilVendedor(null)}
        />
      )}
    </div>
  );
}



// ══ VendedorPanel ═════════════════════════════════════════

function VendedorPanel({ user }) {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [localesMes, setLocalesMes] = useState([]);
  const [deptosMes, setDeptosMes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("dia");
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [ordenEditar, setOrdenEditar] = useState(null);
  const [tipoEditar, setTipoEditar] = useState(null);

  useEffect(() => { cargarMisOrdenes(); }, [filtroFecha]);

  function getRangoFechas() {
  const hoy = new Date();
  if (filtroTipo === "dia") return { gte: filtroFecha, lte: filtroFecha };
  if (filtroTipo === "semana") {
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - 7);
    return { gte: inicio.toISOString().split("T")[0], lte: fechaHoy() };
  }
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  return { gte: inicio.toISOString().split("T")[0], lte: fechaHoy() };
}

  async function cargarMisOrdenes() {
    setLoading(true);
    const nombre = encodeURIComponent(user.nombre);

    // Mes anterior para comparativa
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0];
    // eslint-disable-next-line no-unused-vars
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1).toISOString().split("T")[0];
     // eslint-disable-next-line no-unused-vars
    const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).toISOString().split("T")[0];

    const [resL, resD, resLMes, resDMes] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + getRangoFechas().gte + "&fecha_orden=lte." + getRangoFechas().lte + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + getRangoFechas().gte + "&fecha_orden=lte." + getRangoFechas().lte + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + getRangoFechas().gte + "&fecha_orden=lte." + getRangoFechas().lte + "&quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + getRangoFechas().gte + "&fecha_orden=lte." + getRangoFechas().lte + "&quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]);

    setLocales(await resL.json());
    setDeptos(await resD.json());
    setLocalesMes(await resLMes.json());
    setDeptosMes(await resDMes.json());
    setLoading(false);
  }

  const totalL = locales.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = deptos.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);
  const totalDia = totalL + totalD;
  const comisionDia = totalDia * COMISION;

  const totalMes = [
    ...localesMes.filter(o => o.estado !== "cancelada").map(o => parseMonto(o.total_pagar) - (o.costo_envio || 0)),
    ...deptosMes.filter(o => o.estado !== "cancelada").map(o => parseMonto(o.total_pagar) - ENVIO_DEPTO),
  ].reduce((s, v) => s + v, 0);
  const comisionMes = totalMes * COMISION;

  const todasHoy = [...locales, ...deptos].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";
  const nombreCorto = (user.nombre || "").split(" ")[0].replace("(Vend)", "").trim();
  
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "'Inter', sans-serif" }}>

      {/* Hero section */}
      <div style={{
        background: "linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)",
        padding: "2rem 1.5rem 3rem",
        marginTop: "-52px",
        paddingTop: "calc(2rem + 52px)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Bolitas decorativas */}
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)", top: -100, right: -50, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,199,89,0.1) 0%, transparent 70%)", bottom: -50, left: -30, pointerEvents: "none" }} />

        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: "0 0 0.25rem" }}>{saludo} 👋</p>
          <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 700, margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>{nombreCorto}</h1>

          {/* Tarjeta comisión del mes */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "1.5rem",
            marginBottom: "1rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.35rem" }}>Comisión del mes</p>
                <div style={{ color: "#34C759", fontSize: "2.2rem", fontWeight: 700, letterSpacing: "-0.03em" }}>{formatMoney(comisionMes)}</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "0.25rem 0 0" }}>de {formatMoney(totalMes)} vendidos</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.35rem" }}>Hoy</p>
                <div style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{formatMoney(comisionDia)}</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "0.25rem 0 0" }}>{todasHoy.filter(o => o.estado !== "cancelada").length} órdenes</p>
              </div>
            </div>
          </div>
        </div>
        <a href={"https://wa.me/50376399341?text=" + encodeURIComponent(
  "Hola! Soy " + user.nombre.replace("(Vend)", "").trim() + 
  " y quisiera cobrar mi comisión de " + formatMoney(comisionMes) + 
  " correspondiente a " + formatMoney(totalMes) + " en ventas este mes. 🙏"
)} target="_blank" rel="noreferrer" style={{
  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
  background: "#25D366", color: "#fff",
  borderRadius: "12px", padding: "0.75rem 1rem",
  fontSize: "0.88rem", fontWeight: 600,
  textDecoration: "none", marginTop: "1rem",
  fontFamily: "'Inter', sans-serif",
}}>
  <MessageCircle size={16} />
  Solicitar pago de comisión
</a>
      </div>

      {/* Contenido principal */}
      <div style={{ maxWidth: 560, margin: "-1.5rem auto 0", padding: "0 1.5rem 3rem", position: "relative" }}>

        {/* Cards resumen */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Locales", value: formatMoney(totalL), sub: locales.filter(o => o.estado !== "cancelada").length + " órdenes" },
            { label: "Deptos", value: formatMoney(totalD), sub: deptos.filter(o => o.estado !== "cancelada").length + " órdenes" },
          ].map((card, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "1rem 1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>{card.label}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{card.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#6e6e73", marginTop: "0.15rem" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Filtro fecha */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1d1d1f", margin: 0 }}>Mis órdenes</h2>
          <select
  value={filtroTipo}
  onChange={e => setFiltroTipo(e.target.value)}
  style={{
    padding: "0.4rem 0.85rem",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.85rem",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    WebkitAppearance: "none",
    appearance: "none",
  }}
>
  <option value="dia" style={{ background: "#1c1c1e" }}>Hoy</option>
  <option value="semana" style={{ background: "#1c1c1e" }}>Esta semana</option>
  <option value="mes" style={{ background: "#1c1c1e" }}>Este mes</option>
</select>

            
        </div>

        {/* Lista de órdenes */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Cargando...</div>
        ) : todasHoy.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            No hay órdenes para esta fecha
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {todasHoy.map((o, i) => {
              const esDep = !!o.departamento;
              const envio = esDep ? ENVIO_DEPTO : (o.costo_envio || 0);
              const neto = parseMonto(o.total_pagar) - envio;
              const cancelada = o.estado === "cancelada";
              return (
                <div key={o.id} onClick={() => { 
  setOrdenEditar(o); 
  setTipoEditar(o.departamento ? "departamental" : "local"); 
}} style={{
  background: "#fff", borderRadius: "16px",
  padding: "1rem 1.25rem",
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  opacity: cancelada ? 0.5 : 1,
  borderLeft: cancelada ? "3px solid #ff3b30" : "3px solid transparent",
  cursor: "pointer", 
}}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ background: esDep ? "rgba(88,86,214,0.1)" : "rgba(0,122,255,0.1)", color: esDep ? "#5856D6" : "#007AFF", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 700 }}>
                          {o.numero_ficha}
                        </span>
                        {cancelada && <span style={{ background: "#fff2f2", color: "#ff3b30", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 600 }}>Cancelada</span>}
                      </div>
                      <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.88rem" }}>{o.nombre_cliente || "Sin nombre"}</div>
                      <div style={{ color: "#6e6e73", fontSize: "0.78rem", marginTop: "0.15rem" }}>{o.articulos?.slice(0, 45)}{o.articulos?.length > 45 ? "…" : ""}</div>
                      <div style={{ color: "#6e6e73", fontSize: "0.75rem", marginTop: "0.15rem" }}>{esDep ? o.departamento : o.municipio}</div>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "1rem" }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: cancelada ? "#6e6e73" : "#1d1d1f", letterSpacing: "-0.02em" }}>{o.total_pagar}</div>
                      <div style={{ fontSize: "0.75rem", color: "#34C759", fontWeight: 600, marginTop: "0.15rem" }}>+{formatMoney(neto * COMISION)}</div>
                      <div style={{ fontSize: "0.72rem", color: "#6e6e73", marginTop: "0.1rem" }}>{o.forma_pago}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {ordenEditar && (
  <ModalEditar
    orden={ordenEditar}
    tipo={tipoEditar}
    onClose={() => setOrdenEditar(null)}
    onSave={() => { setOrdenEditar(null); cargarMisOrdenes(); }}
  />
)}
    </div>
  );
}


// == Equipo ==============================================

function AdminEquipo() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const initialForm = { usuario: "", password: "", rol: "vendedor", nombre: "", activo: true };
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { cargarUsuarios(); }, []);

  async function cargarUsuarios() {
    setLoading(true);
    const res = await fetch(SUPABASE_URL + "/rest/v1/usuarios?order=creado_en.asc", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
    });
    setUsuarios(await res.json());
    setLoading(false);
  }

  async function guardarUsuario() {
    setSaving(true);
    if (editando) {
      await fetch(SUPABASE_URL + "/rest/v1/usuarios?id=eq." + editando.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(SUPABASE_URL + "/rest/v1/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setShowModal(false);
    setEditando(null);
    setForm(initialForm);
    cargarUsuarios();
  }

  async function toggleActivo(u) {
    await fetch(SUPABASE_URL + "/rest/v1/usuarios?id=eq." + u.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ activo: !u.activo }),
    });
    cargarUsuarios();
  }

  function handleEditar(u) {
    setEditando(u);
    setForm({ usuario: u.usuario, password: u.password, rol: u.rol, nombre: u.nombre, activo: u.activo });
    setShowModal(true);
  }

  const inputStyle = {
    width: "100%", padding: "0.6rem 0.85rem",
    border: "1px solid #e5e5ea", borderRadius: "8px",
    fontSize: "0.88rem", outline: "none",
    background: "#f5f5f7", color: "#1d1d1f",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "0.72rem", fontWeight: 600,
    color: "#6e6e73", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: "0.35rem",
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.usuario.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Equipo</h2>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.85rem", background: "#fff", outline: "none", fontFamily: "'Inter', sans-serif" }}
          />
          <button onClick={() => { setEditando(null); setForm(initialForm); setShowModal(true); }} style={{
            padding: "0.5rem 1rem", background: "#007AFF", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "0.85rem",
            cursor: "pointer", fontFamily: "'Inter', sans-serif",
            display: "flex", alignItems: "center", gap: "0.35rem",
          }}>
            + Nuevo usuario
          </button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div> : (
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f5f5f7" }}>
                {["Usuario", "Nombre", "Rol", "Contraseña", "Estado", "Acciones"].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#6e6e73", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f5f5f7", opacity: u.activo ? 1 : 0.5 }}>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#1d1d1f" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.rol === "admin" ? "#007AFF" : "#34C759", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.78rem", fontWeight: 700, flexShrink: 0 }}>
                        {u.nombre.charAt(0)}
                      </div>
                      {u.usuario}
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#1d1d1f" }}>{u.nombre}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ background: u.rol === "admin" ? "rgba(0,122,255,0.1)" : "rgba(52,199,89,0.1)", color: u.rol === "admin" ? "#007AFF" : "#34C759", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase" }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                   <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
      {u.showPassword ? u.password : "••••••••"}
    </span>
    <button onClick={() => {
      setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, showPassword: !x.showPassword } : x));
    }} style={{
      background: "transparent", border: "none", cursor: "pointer",
      color: "#6e6e73", display: "flex", alignItems: "center", padding: 0,
    }}>
      {u.showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  </div>
</td>
                  
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ background: u.activo ? "rgba(52,199,89,0.1)" : "rgba(255,59,48,0.1)", color: u.activo ? "#34C759" : "#ff3b30", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.72rem", fontWeight: 600 }}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => handleEditar(u)} title="Editar" style={{
  padding: "0.3rem", background: "#f5f5f7",
  border: "none", borderRadius: "6px",
  cursor: "pointer", color: "#007AFF",
  display: "flex", alignItems: "center",
}}>
  <Pencil size={14} />
</button>

<button onClick={() => toggleActivo(u)} title={u.activo ? "Desactivar" : "Activar"} style={{
  padding: "0.3rem", 
  background: u.activo ? "#fff2f2" : "#f0fff4",
  border: "none", borderRadius: "6px",
  cursor: "pointer", 
  color: u.activo ? "#ff3b30" : "#34C759",
  display: "flex", alignItems: "center",
}}>
  {u.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear/editar usuario */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem", fontFamily: "'Inter', sans-serif",
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "1.5rem",
            width: "100%", maxWidth: 440,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1d1d1f", margin: 0 }}>
                {editando ? "Editar usuario" : "Nuevo usuario"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "#f5f5f7", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#6e6e73", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Usuario</label>
              <input value={form.usuario} onChange={e => setForm(p => ({ ...p, usuario: e.target.value }))} style={inputStyle} placeholder="ej: maria.lopez" autoComplete="off" />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Contraseña</label>
              <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={inputStyle} placeholder="contraseña" autoComplete="off" />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Nombre completo</label>
              <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} style={inputStyle} placeholder="ej: María López (Vend)" autoComplete="off" />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Rol</label>
              <select value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))} style={inputStyle}>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "0.75rem", background: "#f5f5f7", color: "#6e6e73", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Cancelar</button>
              <button onClick={guardarUsuario} disabled={saving} style={{ flex: 2, padding: "0.75rem", background: saving ? "#e5e5ea" : "#007AFF", color: saving ? "#6e6e73" : "#fff", border: "none", borderRadius: "10px", fontWeight: 600, cursor: saving ? "default" : "pointer", fontFamily: "'Inter', sans-serif" }}>
                {saving ? "Guardando..." : editando ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// ══ App ═════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("panel_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState("");
  const [busquedaGlobal, setBusquedaGlobal] = useState("");

  function handleLogin(u) {
    setUser(u);
    localStorage.setItem("panel_user", JSON.stringify(u));
    setActiveTab(u.rol === "admin" ? "dashboard" : "mis-ordenes");
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("panel_user");
  }

  useEffect(() => {
    if (user) setActiveTab(user.rol === "admin" ? "dashboard" : "mis-ordenes");
  }, []);

  if (!user) return <Login onLogin={handleLogin} />;

  function renderContent() {
    if (user.rol === "admin") {
      if(activeTab === "dashboard") return <Dashboard user={user} />;
      if (activeTab === "ordenes") return <AdminOrdenes />;
      if (activeTab === "estadisticas") return <AdminEstadisticas />;
      if (activeTab === "vendedores") return <AdminVendedores />;
      if (activeTab === "equipo") return <AdminEquipo />;
    } else {
      return <VendedorPanel user={user} />;
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} busqueda={busquedaGlobal} setBusqueda={setBusquedaGlobal} darkMode={user.rol === "vendedor"} />
      {renderContent()}
    </div>
  );
}
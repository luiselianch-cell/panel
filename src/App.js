/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
// eslint-disable-next-line no-unused-vars
import { Home, ClipboardList, BarChart2, Users, UserCheck, Search, Menu, MessageCircle, Eye, EyeOff, Clock, Package, Medal, Trophy } from "lucide-react";
import { Copy, XCircle, RefreshCw, Check, Pencil, UserX, Download, CheckCircle, Banknote, ShoppingBag, Truck, Sun, Phone, MapPin, DollarSign } from "lucide-react";
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
function Navbar({ user, onLogout, activeTab, setActiveTab, darkMode }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef({});

  function handleTabHover(id) {
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
  ? [
      { id: "dashboard", icon: <Home size={15} />, label: "Inicio" },
      { id: "ordenes", icon: <ClipboardList size={15} />, label: "Órdenes" },
      { id: "estadisticas", icon: <BarChart2 size={15} />, label: "Estadísticas" },
      { id: "vendedores", icon: <UserCheck size={15} />, label: "Vendedores" },
      { id: "tienda", icon: <ShoppingBag size={15} />, label: "Tienda" },
      { id: "equipo", icon: <Users size={15} />, label: "Equipo" },
      { id: "repartidores", icon: <Truck size={15} />, label: "Repartidores" },
    ]
  : user.rol === "operaciones"
  ? [
      { id: "ordenes", icon: <ClipboardList size={15} />, label: "Órdenes" },
      { id: "tienda", icon: <ShoppingBag size={15} />, label: "Tienda" },
      { id: "cobros", icon: <Banknote size={15} />, label: "Cobros" },
      { id: "repartidores", icon: <Truck size={15} />, label: "Repartidores" },
    ]
  : user.rol === "repartidor"
  ? [{ id: "mis-entregas", icon: <Truck size={15} />, label: "Mis Entregas" }]
  : [];


  function handleTabClick(id) {
    setActiveTab(id);
    setShowMenu(false);
  }

  const textColor = darkMode ? "rgba(255,255,255,0.7)" : "#6e6e73";
  const textActive = darkMode ? "#34C759" : "#007AFF";
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const menuBg = darkMode ? "#1c1c1e" : "#fff";
  const menuText = darkMode ? "#fff" : "#1d1d1f";
  const inputBorder = darkMode ? "rgba(255,255,255,0.15)" : "#e5e5ea";

  return (
    <>
      <div style={{
        background: darkMode ? "rgba(10,10,10,0.4)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
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
          {!isMobile && (user.rol === "admin" || user.rol === "operaciones") && (
            <div style={{ display: "flex", flex: 1, position: "relative" }} onMouseLeave={handleNavLeave}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  ref={el => tabsRef.current[tab.id] = el}
                  onClick={() => handleTabClick(tab.id)}
                  onMouseEnter={() => handleTabHover(tab.id)}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(0,122,255,0.08)"; e.currentTarget.style.backdropFilter = "blur(8px)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.backdropFilter = "none"; }}
                  style={{
                    padding: "0.4rem 0.85rem",
                    background: "transparent",
                    color: activeTab === tab.id ? textActive : textColor,
                    border: "none",
                    borderBottom: "2px solid transparent",
                    borderRadius: "8px 8px 0 0",
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    paddingBottom: "0.5rem",
                    fontFamily: "'Inter', sans-serif",
                    transition: "color 0.15s, background 0.15s",
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
          {isMobile && (user.rol === "admin" || user.rol === "operaciones") && (
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
      {isMobile && showMenu && (user.rol === "admin" || user.rol === "operaciones") && (
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
function ModalEditar({ orden, tipo, onClose, onSave, rolUsuario }) {
  const [form, setForm] = useState({ ...orden });
  const [saving, setSaving] = useState(false);

  // Campos bloqueados para el rol "logística" — protegen comisiones y montos de venta
  const bloqueado = rolUsuario === "logística";

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

  const inputBloqueadoStyle = {
    ...inputStyle,
    opacity: 0.55,
    cursor: "not-allowed",
    background: "#ececec",
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

        {/* Aviso de campos bloqueados para logística */}
        {bloqueado && (
          <div style={{ background: "#fff7e6", borderRadius: "10px", padding: "0.6rem 0.85rem", marginBottom: "1rem", fontSize: "0.78rem", color: "#a87000", flexShrink: 0 }}>
            🔒 El total y el vendedor asignado no se pueden modificar desde esta cuenta.
          </div>
        )}

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
              <input name="total_pagar" value={form.total_pagar || ""} onChange={handleChange} disabled={bloqueado} style={bloqueado ? inputBloqueadoStyle : inputStyle} placeholder="$0.00" />
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
              <select name="quien_ingresa" value={form.quien_ingresa || ""} onChange={handleChange} disabled={bloqueado} style={bloqueado ? inputBloqueadoStyle : inputStyle}>
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
function TablaOrdenes({ ordenes, tipo, onUpdateEnvio, esAdmin, rolUsuario, onSave, onAprobar }) {
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

  async function cancelarOrden(id, tipo, nuevoEstado = "cancelada") {
    const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
    await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ estado: nuevoEstado }),
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
            <tr><td colSpan={11} style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>No hay órdenes</td></tr>
          )}
          {ordenes.map((o, i) => {
            const total = parseMonto(o.total_pagar);
            const envio = tipo === "departamental" ? ENVIO_DEPTO : (envios[o.id] || 0);
            const neto = total - envio;
            const pendiente = o.estado_flujo === "pendiente_aprobacion" || !o.estado_flujo;
            return (
              <tr key={o.id} onClick={() => { setOrdenEditar(o); setTipoEditar(tipo); }} style={{ borderBottom: "1px solid #f5f5f7", cursor: "pointer", background: pendiente ? "rgba(255,149,0,0.03)" : "transparent" }}>
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
                        e.target.style.border = "1.5px solid #007AFF";
                      }}
                      onBlur={e => {
                        e.target.style.border = "1.5px solid #e5e5ea";
                        handleEnvioChange(o.id, e.target.value);
                        handleEnvioBlur(o.id, e.target.value, "local");
                      }}
                      style={{
                        width: 70, padding: "0.35rem 0.6rem",
                        border: "1.5px solid #e5e5ea", borderRadius: "8px",
                        fontSize: "0.82rem", outline: "none",
                        background: "#f5f5f7", color: "#1d1d1f",
                        fontFamily: "'Inter', sans-serif", fontWeight: 500, textAlign: "center",
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
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>

                    {/* Badge + botón aprobar — solo para pendientes y admin */}
                    {pendiente && esAdmin && (
                      <>
                        <span style={{
                          background: "rgba(255,149,0,0.1)", color: "#FF9500",
                          borderRadius: "6px", padding: "0.15rem 0.4rem",
                          fontSize: "0.68rem", fontWeight: 600, whiteSpace: "nowrap",
                        }}>Pendiente</span>
                        <button
                          onClick={() => onAprobar && onAprobar(o.id, tipo)}
                          title="Aprobar orden"
                          style={{
                            padding: "0.3rem 0.55rem",
                            background: "rgba(52,199,89,0.1)",
                            border: "none", borderRadius: "6px",
                            cursor: "pointer", color: "#34C759",
                            display: "flex", alignItems: "center", gap: "0.3rem",
                            fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap",
                          }}>
                          <CheckCircle size={13} /> Aprobar
                        </button>
                      </>
                    )}

                    {/* Badge aprobada */}
                    {o.estado_flujo === "aprobada" && (
                      <span style={{
                        background: "rgba(0,122,255,0.1)", color: "#007AFF",
                        borderRadius: "6px", padding: "0.15rem 0.4rem",
                        fontSize: "0.68rem", fontWeight: 600,
                      }}>✓ Aprobada</span>
                    )}

                    {/* Badge cancelada */}
                    {o.estado === "cancelada" && (
                      <span style={{ background: "#fff2f2", color: "#ff3b30", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem" }}>Cancelada</span>
                    )}

                    {/* Botón cancelar/reactivar */}
                    <button onClick={() => cancelarOrden(o.id, tipo, o.estado === "cancelada" ? "completada" : "cancelada")}
                      title={o.estado === "cancelada" ? "Reactivar" : "Cancelar"}
                      style={{
                        padding: "0.3rem", background: o.estado === "cancelada" ? "#f0fff4" : "#fff2f2",
                        border: "none", borderRadius: "6px",
                        cursor: "pointer", color: o.estado === "cancelada" ? "#34C759" : "#ff3b30",
                        display: "flex", alignItems: "center",
                      }}>
                      {o.estado === "cancelada" ? <RefreshCw size={14} /> : <XCircle size={14} />}
                    </button>

                    {/* Botón copiar */}
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
          rolUsuario={rolUsuario}
          onClose={() => setOrdenEditar(null)}
          onSave={() => { setOrdenEditar(null); onSave && onSave(); }}
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
  const [tienda, setTienda] = useState([]);
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
      fetch(SUPABASE_URL + "/rest/v1/ordenes_tienda?fecha_orden=eq." + hoy + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]).then(async ([resL, resD, resT]) => {
      const localesData = await resL.json();
      const deptosData = await resD.json();
      const tiendaData = await resT.json();

      const todasNuevas = [...localesData, ...deptosData];
      const ultima = todasNuevas.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))[0];

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
      setTienda(tiendaData);
      setLoading(false);
    });
  }

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalL = locales.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = deptos.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);
  const totalT = tienda.reduce((s, o) => s + parseMonto(o.total_pagar), 0);
  const totalGeneral = totalL + totalD + totalT;
  const pendientesAprobacion = [...locales, ...deptos].filter(o => o.estado_flujo === "pendiente_aprobacion" || !o.estado_flujo).length;
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
          <p style={{ color: "#007AFF", fontSize: "0.9rem", fontWeight: 500, margin: 0 }}>
            {frase}
          </p>
        </div>

        {/* Alerta de órdenes pendientes */}
        {pendientesAprobacion > 0 && (
          <div style={{
            background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.25)",
            borderRadius: "12px", padding: "0.85rem 1.25rem", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "0.75rem",
          }}>
            <Clock size={18} color="#FF9500" />
            <span style={{ color: "#FF9500", fontWeight: 600, fontSize: "0.88rem" }}>
              {pendientesAprobacion} orden{pendientesAprobacion !== 1 ? "es" : ""} pendiente{pendientesAprobacion !== 1 ? "s" : ""} de aprobación
            </span>
          </div>
        )}

        <GraficasComparativas />

        {loading ? (
          <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div>
        ) : (
          <>
            {/* Cards principales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Total vendido hoy", value: formatMoney(totalGeneral), sub: "Online + Tienda", accent: "#007AFF" },
                { label: "Órdenes online", value: (locales.length + deptos.length).toString(), sub: locales.length + " locales · " + deptos.length + " deptos" },
                { label: "Ventas en tienda", value: formatMoney(totalT), sub: tienda.length + " venta" + (tienda.length !== 1 ? "s" : ""), accent: "#5856D6" },
                { label: "Locales (neto)", value: formatMoney(totalL), sub: locales.length + " órdenes" },
                { label: "Deptos (neto)", value: formatMoney(totalD), sub: deptos.length + " órdenes" },
              ].map((card, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{card.label}</div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, color: card.accent || "#1d1d1f", letterSpacing: "-0.02em" }}>{card.value}</div>
                  <div style={{ fontSize: "0.78rem", color: "#6e6e73", marginTop: "0.25rem" }}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* Última orden + Últimas tienda en grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

              {/* Última orden online */}
              {ultimaOrden && (
                <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Última orden online</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ background: "#007AFF", color: "#fff", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.75rem", fontWeight: 700 }}>{ultimaOrden.numero_ficha}</span>
                      </div>
                      <div style={{ color: "#1d1d1f", fontWeight: 600, fontSize: "0.88rem" }}>{ultimaOrden.nombre_cliente || "Sin nombre"}</div>
                      <div style={{ color: "#6e6e73", fontSize: "0.78rem", marginTop: "0.15rem" }}>{ultimaOrden.articulos?.slice(0, 50)}{ultimaOrden.articulos?.length > 50 ? "…" : ""}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1d1d1f" }}>{ultimaOrden.total_pagar}</div>
                      <div style={{ color: "#6e6e73", fontSize: "0.75rem" }}>{ultimaOrden.quien_ingresa}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Últimas ventas de tienda */}
              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Últimas ventas en tienda</div>
                {tienda.length === 0 ? (
                  <div style={{ color: "#6e6e73", fontSize: "0.85rem" }}>Sin ventas hoy</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {tienda.slice(0, 3).map((v, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.35rem 0", borderBottom: i < Math.min(tienda.length, 3) - 1 ? "1px solid #f5f5f7" : "none" }}>
                        <div>
                          <span style={{ background: "rgba(88,86,214,0.1)", color: "#5856D6", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 700, marginRight: "0.4rem" }}>{v.numero_ficha}</span>
                          <span style={{ color: "#1d1d1f", fontSize: "0.82rem" }}>{v.articulos?.slice(0, 30)}{v.articulos?.length > 30 ? "…" : ""}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: "#5856D6", fontSize: "0.88rem", flexShrink: 0, marginLeft: "0.5rem" }}>{v.total_pagar}</span>
                      </div>
                    ))}
                    {tienda.length > 3 && (
                      <div style={{ color: "#6e6e73", fontSize: "0.75rem", marginTop: "0.25rem" }}>+{tienda.length - 3} más hoy</div>
                    )}
                  </div>
                )}
              </div>
            </div>

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


// ══ DashboardContador ══════════════════════════════════════════
function DashboardContador({ user }) {
  const [localesMes, setLocalesMes] = useState([]);
  const [deptosMes, setDeptosMes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [todosVendedores, setTodosVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const VENDEDORES_EXTERNOS = [
    "Maressa (Vend)",
    "Yanci (Vend)",
    "Sara Eunice (Vend)",
    "Kevin (Vend)",
    "Marisol (Vend)",
    "Herbert (Vend)",
    "Pedido Pagina Web",
  ];

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    setLoading(true);
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0];

    const [resL, resD, resPagos, resVendedores] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + inicioMes, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + inicioMes, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/pagos_comisiones?fecha_pago=gte." + inicioMes, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/usuarios?rol=eq.vendedor&activo=eq.true", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
    ]);

    setLocalesMes(await resL.json());
    setDeptosMes(await resD.json());
    setPagos(await resPagos.json());
    setTodosVendedores(await resVendedores.json());
    setLoading(false);
  }

  // Comisiones por vendedor este mes
  const porVendedor = {};
  localesMes.filter(o => o.estado !== "cancelada").forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    if (!VENDEDORES_EXTERNOS.includes(v)) return;
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, total: 0 };
    porVendedor[v].total += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptosMes.filter(o => o.estado !== "cancelada").forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    if (!VENDEDORES_EXTERNOS.includes(v)) return;
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, total: 0 };
    porVendedor[v].total += parseMonto(o.total_pagar) - ENVIO_DEPTO;
  });

  const vendedoresConComision = Object.values(porVendedor).map(v => ({
    ...v,
    comision: v.total * COMISION,
  }));

  const vendedoresPagados = new Set(pagos.map(p => p.vendedor));

  const pendientes = vendedoresConComision.filter(v => !vendedoresPagados.has(v.vendedor));
  const pagados = vendedoresConComision.filter(v => vendedoresPagados.has(v.vendedor));

  const totalPendiente = pendientes.reduce((s, v) => s + v.comision, 0);
  const totalPagado = pagos.reduce((s, p) => s + p.monto, 0);

  const topPendiente = [...pendientes].sort((a, b) => b.comision - a.comision)[0];

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "¡Buenos días" : hora < 18 ? "¡Buenas tardes" : "¡Buenas noches";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", position: "relative" }}>

      {/* Bolitas de fondo */}
      <div style={{ position: "fixed", top: 80, left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: 200, right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,199,89,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Saludo */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 0.35rem", letterSpacing: "-0.03em" }}>
            {saludo}, {user.nombre.split(" ")[0]}! 👋
          </h1>
          <p style={{ color: "#6e6e73", fontSize: "1rem", margin: 0 }}>
            Resumen de comisiones del mes
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div>
        ) : (
          <>
            {/* Cards principales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Comisiones pendientes</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ff3b30", letterSpacing: "-0.02em" }}>{formatMoney(totalPendiente)}</div>
                <div style={{ fontSize: "0.78rem", color: "#6e6e73", marginTop: "0.25rem" }}>{pendientes.length} vendedor{pendientes.length !== 1 ? "es" : ""} por pagar</div>
              </div>

              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Comisiones pagadas</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#34C759", letterSpacing: "-0.02em" }}>{formatMoney(totalPagado)}</div>
                <div style={{ fontSize: "0.78rem", color: "#6e6e73", marginTop: "0.25rem" }}>{pagados.length} pago{pagados.length !== 1 ? "s" : ""} este mes</div>
              </div>

              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Total comisiones mes</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#007AFF", letterSpacing: "-0.02em" }}>{formatMoney(totalPendiente + totalPagado)}</div>
                <div style={{ fontSize: "0.78rem", color: "#6e6e73", marginTop: "0.25rem" }}>{vendedoresConComision.length} vendedores activos</div>
              </div>
            </div>

            {/* Top pendiente */}
            {topPendiente && (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Comisión más alta pendiente</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#ff3b30", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>
                      {topPendiente.vendedor.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.95rem" }}>{topPendiente.vendedor}</div>
                      <div style={{ color: "#6e6e73", fontSize: "0.78rem" }}>Ventas: {formatMoney(topPendiente.total)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#ff3b30" }}>{formatMoney(topPendiente.comision)}</div>
                </div>
              </div>
            )}

            {/* Lista de pendientes */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Comisiones por pagar</div>
              {pendientes.length === 0 ? (
                <div style={{ color: "#34C759", fontSize: "0.88rem", fontWeight: 500 }}>✅ Todas las comisiones del mes están pagadas</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {pendientes.sort((a, b) => b.comision - a.comision).map((v, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: i < pendientes.length - 1 ? "1px solid #f5f5f7" : "none" }}>
                      <span style={{ fontWeight: 500, color: "#1d1d1f", fontSize: "0.88rem" }}>{v.vendedor}</span>
                      <span style={{ fontWeight: 700, color: "#ff3b30", fontSize: "0.95rem" }}>{formatMoney(v.comision)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ══ AdminOrdenes ══════════════════════════════════════════
function AdminOrdenes({ rolUsuario }) {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [filtroVendedor, setFiltroVendedor] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("");
  const [tab, setTab] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [rangoFecha, setRangoFecha] = useState("dia");
  const [filtroPendientes, setFiltroPendientes] = useState(false);

  const esAdminCompleto = rolUsuario === "admin";

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

  useEffect(() => {
  cargarOrdenes();
  const interval = setInterval(cargarOrdenes, 10000);
  return () => clearInterval(interval);
}, [filtroFecha, rangoFecha]);


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

  async function aprobarOrden(id, tipo) {
    const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
    await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ estado_flujo: "aprobada" }),
    });
    cargarOrdenes();
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
      "Estado flujo": o.estado_flujo,
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
      if (filtroPendientes && o.estado_flujo !== "pendiente_aprobacion") return false;
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

  const pendientesCount = [...locales, ...deptos].filter(o => o.estado_flujo === "pendiente_aprobacion" || !o.estado_flujo).length;

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
        {/* Badge de pendientes */}
        {pendientesCount > 0 && (
          <button onClick={() => setFiltroPendientes(!filtroPendientes)} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: filtroPendientes ? "#FF9500" : "rgba(255,149,0,0.1)",
            color: filtroPendientes ? "#fff" : "#FF9500",
            border: "none", borderRadius: "10px", padding: "0.5rem 0.85rem",
            fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}>
            <Clock size={15} />
            {pendientesCount} pendiente{pendientesCount !== 1 ? "s" : ""} de aprobar
          </button>
        )}
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} style={selectStyle} />
        <button onClick={() => setRangoFecha(rangoFecha === "dia" ? "todo" : "dia")} style={{
          padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px",
          fontSize: "0.85rem", background: rangoFecha === "todo" ? "#007AFF" : "#fff",
          color: rangoFecha === "todo" ? "#fff" : "#1d1d1f", cursor: "pointer",
          fontFamily: "'Inter', sans-serif", fontWeight: rangoFecha === "todo" ? 600 : 400,
        }}>
          {rangoFecha === "todo" ? "Hasta hoy" : "Solo hoy"}
        </button>
        {esAdminCompleto && (
          <button onClick={exportarExcel} style={{
            padding: "0.5rem 0.85rem", background: "#34C759", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600,
            fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            display: "flex", alignItems: "center", gap: "0.35rem",
          }}>
            <Download size={15} /> Exportar Excel
          </button>
        )}
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
          ? <TablaOrdenes ordenes={todosF} tipo="local" onUpdateEnvio={actualizarEnvio} esAdmin={esAdminCompleto} rolUsuario={rolUsuario} onSave={cargarOrdenes} onAprobar={aprobarOrden} />
          : tab === "locales"
          ? <TablaOrdenes ordenes={lF} tipo="local" onUpdateEnvio={actualizarEnvio} esAdmin={esAdminCompleto} rolUsuario={rolUsuario} onSave={cargarOrdenes} onAprobar={aprobarOrden} />
          : <TablaOrdenes ordenes={dF} tipo="departamental" esAdmin={esAdminCompleto} rolUsuario={rolUsuario} onSave={cargarOrdenes} onAprobar={aprobarOrden} />
        }
      </div>
    </div>
  );
}


// ══ AdminEstadisticas ═════════════════════════════════════
function AdminEstadisticas() {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [tienda, setTienda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState("semana");

  useEffect(() => { cargarTodo(); }, [rango]);

  async function cargarTodo() {
    setLoading(true);
    const dias = rango === "semana" ? 7 : rango === "mes" ? 30 : 90;
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);
    const desdeStr = desde.toISOString().split("T")[0];
    const [resL, resD, resT] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + desdeStr + "&order=fecha_orden.asc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + desdeStr + "&order=fecha_orden.asc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_tienda?fecha_orden=gte." + desdeStr + "&order=fecha_orden.asc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]);
    setLocales(await resL.json());
    setDeptos(await resD.json());
    setTienda(await resT.json());
    setLoading(false);
  }

  const todas = [...locales, ...deptos].filter(o => o.estado !== "cancelada");

  // Ventas por día — incluye tienda
  const ventasPorDia = {};
  locales.filter(o => o.estado !== "cancelada").forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = { fecha: o.fecha_orden, locales: 0, deptos: 0, tienda: 0 };
    ventasPorDia[o.fecha_orden].locales += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptos.filter(o => o.estado !== "cancelada").forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = { fecha: o.fecha_orden, locales: 0, deptos: 0, tienda: 0 };
    ventasPorDia[o.fecha_orden].deptos += parseMonto(o.total_pagar) - ENVIO_DEPTO;
  });
  tienda.forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = { fecha: o.fecha_orden, locales: 0, deptos: 0, tienda: 0 };
    ventasPorDia[o.fecha_orden].tienda += parseMonto(o.total_pagar);
  });
  const chartData = Object.values(ventasPorDia).sort((a, b) => a.fecha.localeCompare(b.fecha));

  // Por perfil
  const porPerfil = {};
  todas.forEach(o => {
    const p = o.perfil_salio_1 || o.perfil_salio || "Sin perfil";
    porPerfil[p] = (porPerfil[p] || 0) + 1;
  });
  const pieData = Object.entries(porPerfil).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Por forma de pago (incluye tienda)
  const porPago = {};
  [...todas, ...tienda].forEach(o => {
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

  // Top ubicaciones
  const porUbicacion = {};
  todas.forEach(o => {
    const ub = o.departamento || o.municipio || "Sin ubicación";
    porUbicacion[ub] = (porUbicacion[ub] || 0) + 1;
  });
  const ubicacionData = Object.entries(porUbicacion).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const totalL = locales.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = deptos.filter(o => o.estado !== "cancelada").reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);
  const totalT = tienda.reduce((s, o) => s + parseMonto(o.total_pagar), 0);
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Locales" value={formatMoney(totalL)} />
        <StatCard label="Deptos" value={formatMoney(totalD)} />
        <StatCard label="Tienda" value={formatMoney(totalT)} accent="#5856D6" sub={tienda.length + " ventas"} />
        <StatCard label="Gran Total" value={formatMoney(totalL + totalD + totalT)} accent="#007AFF" />
        <StatCard label="Órdenes online" value={(locales.length + deptos.length - canceladas).toString()} />
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
              <Bar dataKey="tienda" name="Tienda" fill="#5856D6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>,
          "Ventas por día (Online + Tienda)"
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
          "Forma de pago (Online + Tienda)"
        )}
      </div>

      {/* Fila 3: Top ubicaciones */}
      {cardChart(
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {ubicacionData.length === 0 ? (
            <div style={{ color: "#6e6e73", fontSize: "0.85rem" }}>Sin datos</div>
          ) : ubicacionData.map((u, i) => (
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
  const [historicosPagos, setHistoricosPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState("mes");
  const [tab, setTab] = useState("ordenes");
  const [pagando, setPagando] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [comisionPagada, setComisionPagada] = useState(false);
  const [montoPagar, setMontoPagar] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  useEffect(() => {
    function handleResize() { setIsMobile(window.innerWidth < 768); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    const [resL, resD, resLTodo, resDTodo, resPago, resHistorico] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + desdeStr + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + desdeStr + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/pagos_comisiones?vendedor=eq." + nombre + "&fecha_pago=gte." + inicioMes, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/pagos_comisiones?vendedor=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]);

    const l = await resL.json();
    const d = await resD.json();
    const lTodo = await resLTodo.json();
    const dTodo = await resDTodo.json();
    const pagos = await resPago.json();
    const historico = await resHistorico.json();

    setOrdenes([...l, ...d].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en)));
    setTodos([...lTodo, ...dTodo]);
    setHistoricosPagos(historico);
    if (pagos.length > 0) setComisionPagada(true);
    setLoading(false);
  }

  async function registrarPago() {
    const montoFinal = parseFloat(montoPagar) || comision;
    if (montoFinal <= 0) return;
    setPagando(true);
    await fetch(SUPABASE_URL + "/rest/v1/pagos_comisiones", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ vendedor: vendedor, monto: montoFinal }),
    });
    setPagando(false);
    setComisionPagada(true);
    setShowConfirm(false);
    setMontoPagar("");
    cargarDatos();
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

  const inputStyle = {
    width: "100%", padding: "0.6rem 0.85rem",
    border: "1px solid #e5e5ea", borderRadius: "8px",
    fontSize: "0.95rem", outline: "none",
    background: "#f5f5f7", color: "#1d1d1f",
    fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
    textAlign: "center", fontWeight: 600,
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
    }} onClick={onClose}>

      {/* Botón X fuera del modal */}
      <button onClick={onClose} style={{
        position: "fixed", top: "1rem", right: "1rem",
        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%",
        width: 40, height: 40, cursor: "pointer", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1001, fontSize: "1rem",
      }}>✕</button>

      <div style={{
        background: "#f5f5f7", borderRadius: "20px",
        width: "100%", maxWidth: 920,
        maxHeight: "calc(100vh - 3rem)",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden",
        boxSizing: "border-box",
      }} onClick={e => e.stopPropagation()}>

        {/* ══ Columna izquierda: Perfil ══ */}
        <div style={{
          background: "#1c1c1e", padding: "1.5rem",
          position: "relative", overflow: "hidden",
          width: isMobile ? "100%" : 280, flexShrink: 0,
          display: "flex", flexDirection: "column",
        }}>
          {/* Destellos difuminados */}
          <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.25) 0%, transparent 70%)", top: -100, right: -60, pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,199,89,0.15) 0%, transparent 70%)", bottom: -80, left: -40, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0 }}>
                {vendedor.charAt(0)}
              </div>
              <div>
                <h2 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{vendedor}</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", margin: "0.2rem 0 0" }}>{todos.length} órdenes históricas</p>
              </div>
            </div>

            {/* Cards de totales */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Vendido este período", value: formatMoney(totalVendido) },
                { label: "Comisión pendiente", value: formatMoney(comision), green: true },
                { label: "Histórico total", value: formatMoney(totalHistorico) },
              ].map((card, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "0.85rem 1rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{card.label}</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: card.green ? "#34C759" : "#fff", letterSpacing: "-0.01em" }}>{card.value}</div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Botón pago */}
            <button
              onClick={() => { setMontoPagar(comision.toFixed(2)); setShowConfirm(true); }}
              disabled={comisionPagada || comision === 0}
              style={{
                width: "100%", padding: "0.8rem",
                background: comisionPagada ? "rgba(52,199,89,0.15)" : comision === 0 ? "rgba(255,255,255,0.05)" : "#34C759",
                color: comisionPagada ? "#34C759" : comision === 0 ? "rgba(255,255,255,0.3)" : "#fff",
                border: "none", borderRadius: "12px",
                fontWeight: 600, fontSize: "0.85rem",
                cursor: comisionPagada || comision === 0 ? "default" : "pointer",
                fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                boxSizing: "border-box", flexWrap: "wrap", textAlign: "center",
              }}>
              {comisionPagada
                ? <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle size={16} /> Comisión pagada</span>
                : <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}><Banknote size={16} /> Pagar {formatMoney(comision)}</span>
              }
            </button>
          </div>
        </div>

        {/* ══ Columna derecha ══ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>

          {/* Controles */}
          <div style={{ background: "#fff", padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f5f5f7", flexShrink: 0, flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button onClick={() => setTab("ordenes")} style={tabStyle(tab === "ordenes")}>Órdenes</button>
              <button onClick={() => setTab("grafica")} style={tabStyle(tab === "grafica")}>Gráfica</button>
              <button onClick={() => setTab("pagos")} style={tabStyle(tab === "pagos")}>Pagos</button>
            </div>
            <div style={{ display: "flex", gap: "0.35rem", background: "#f5f5f7", borderRadius: "10px", padding: "0.25rem" }}>
              {["semana", "mes", "año"].map(r => <button key={r} onClick={() => setRango(r)} style={btnStyle(rango === r)}>{r}</button>)}
            </div>
          </div>

          {/* Contenido scrolleable */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", minHeight: 0 }}>
            {loading ? (
              <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div>
            ) : tab === "grafica" ? (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>Ventas por día</div>
                {chartData.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Sin datos</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
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
            ) : tab === "pagos" ? (
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                  Historial de pagos de comisión
                </div>
                {historicosPagos.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73" }}>
                    Sin pagos registrados
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {historicosPagos.map((p, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.88rem" }}>Pago de comisión</div>
                          <div style={{ color: "#6e6e73", fontSize: "0.75rem", marginTop: "0.15rem" }}>
                            {new Date(p.creado_en).toLocaleDateString("es-SV", { day: "2-digit", month: "long", year: "numeric" })}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#34C759" }}>{formatMoney(p.monto)}</div>
                          <span style={{ background: "rgba(52,199,89,0.1)", color: "#34C759", borderRadius: "6px", padding: "0.1rem 0.4rem", fontSize: "0.68rem", fontWeight: 600 }}>Pagado</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ background: "#fff", borderRadius: "12px", padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #f5f5f7" }}>
                      <span style={{ fontWeight: 600, color: "#6e6e73", fontSize: "0.82rem" }}>Total pagado históricamente</span>
                      <span style={{ fontWeight: 700, color: "#007AFF", fontSize: "1rem" }}>{formatMoney(historicosPagos.reduce((s, p) => s + p.monto, 0))}</span>
                    </div>
                  </div>
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
      </div>

      {/* Modal confirmación pago con monto editable */}
      {showConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "2rem",
            maxWidth: 380, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💰</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 0.25rem" }}>Confirmar pago</h3>
              <p style={{ color: "#6e6e73", fontSize: "0.85rem", margin: 0 }}>
                Pagando comisión a <strong>{vendedor.replace("(Vend)", "").trim()}</strong>
              </p>
            </div>

            {/* Comisión total como referencia */}
            <div style={{ background: "#f5f5f7", borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", color: "#6e6e73" }}>Comisión total calculada</span>
              <span style={{ fontWeight: 700, color: "#1d1d1f" }}>{formatMoney(comision)}</span>
            </div>

            {/* Input monto a pagar */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                Monto a depositar
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={montoPagar}
                onChange={e => setMontoPagar(e.target.value)}
                placeholder="0.00"
                style={inputStyle}
              />
              <p style={{ color: "#6e6e73", fontSize: "0.75rem", margin: "0.4rem 0 0", textAlign: "center" }}>
                Puedes ajustar el monto si el vendedor no pide el total
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: "0.75rem", background: "#f5f5f7",
                border: "none", borderRadius: "10px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Inter', sans-serif", color: "#6e6e73",
              }}>Cancelar</button>
              <button onClick={registrarPago} disabled={pagando || !montoPagar || parseFloat(montoPagar) <= 0} style={{
                flex: 2, padding: "0.75rem",
                background: pagando || !montoPagar ? "#e5e5ea" : "#34C759",
                color: pagando || !montoPagar ? "#6e6e73" : "#fff",
                border: "none", borderRadius: "10px", fontWeight: 600,
                cursor: pagando || !montoPagar ? "default" : "pointer",
                fontFamily: "'Inter', sans-serif", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              }}>
                {pagando ? "Procesando..." : <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle size={16} /> Confirmar {montoPagar ? formatMoney(parseFloat(montoPagar)) : ""}</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// == AdminRepartidores =========================================
function AdminRepartidores() {
  const [repartidores, setRepartidores] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesMes, setOrdenesMes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [busqueda, setBusqueda] = useState("");
  const [perfilRepartidor, setPerfilRepartidor] = useState(null);

  useEffect(() => { cargarTodo(); }, [filtroFecha]);

  async function cargarTodo() {
    setLoading(true);
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0];

    const [resR, resL, resD, resLMes, resDMes] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/usuarios?rol=eq.repartidor&activo=eq.true", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha + "&estado_flujo=eq.entregada", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha + "&estado_flujo=eq.entregada", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + inicioMes + "&estado_flujo=eq.entregada", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + inicioMes + "&estado_flujo=eq.entregada", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
    ]);

    setRepartidores(await resR.json());
    const l = await resL.json();
    const d = await resD.json();
    const lMes = await resLMes.json();
    const dMes = await resDMes.json();
    setOrdenes([...l, ...d]);
    setOrdenesMes([...lMes, ...dMes]);
    setLoading(false);
  }

  // Stats del día por repartidor
  const porRepartidor = {};
  ordenes.forEach(o => {
    const r = o.repartidor_asignado || "Sin asignar";
    if (!porRepartidor[r]) porRepartidor[r] = { entregas: 0, cobrado: 0 };
    porRepartidor[r].entregas++;
    porRepartidor[r].cobrado += o.monto_repartidor || 0;
  });

  // Ranking del mes
  const porRepartidorMes = {};
  ordenesMes.forEach(o => {
    const r = o.repartidor_asignado || "Sin asignar";
    if (!porRepartidorMes[r]) porRepartidorMes[r] = { entregas: 0 };
    porRepartidorMes[r].entregas++;
  });

  const rankingMes = Object.entries(porRepartidorMes)
    .map(([nombre, data]) => ({ nombre, ...data }))
    .sort((a, b) => b.entregas - a.entregas)
    .slice(0, 3);

  const coloresPodio = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const altosPodio = [80, 60, 45];
  

  const repartidoresFiltrados = repartidores
    .filter(r => r.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const selectStyle = {
    padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px",
    fontSize: "0.85rem", background: "#fff", outline: "none", fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Repartidores</h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            placeholder="Buscar repartidor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={selectStyle}
          />
          <input
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            style={selectStyle}
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
                Ranking del mes — Entregas completadas
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem" }}>
                {[rankingMes[1], rankingMes[0], rankingMes[2]].map((r, i) => {
                  if (!r) return <div key={i} style={{ width: 120 }} />;
                  const posReal = i === 0 ? 1 : i === 1 ? 0 : 2;
                  return (
                    <div key={i} onClick={() => setPerfilRepartidor(r.nombre)}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: 120 }}>
                      <Medal size={28} color={coloresPodio[posReal]} style={{ marginBottom: "0.25rem" }} />
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: coloresPodio[posReal], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                        {r.nombre.charAt(0)}
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1d1d1f", textAlign: "center", marginBottom: "0.15rem" }}>
                        {r.nombre.replace("(Rep)", "").trim()}
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: coloresPodio[posReal] }}>
                        {r.entregas} entrega{r.entregas !== 1 ? "s" : ""}
                      </div>
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

          {/* Cards repartidores */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {repartidoresFiltrados.map((r, i) => {
              const datos = porRepartidor[r.nombre] || { entregas: 0, cobrado: 0 };
              return (
                <div key={i} onClick={() => setPerfilRepartidor(r.nombre)} style={{
                  background: "#fff", borderRadius: "16px",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.95rem" }}>
                        {r.nombre.replace("(Rep)", "").trim()}
                      </div>
                      <div style={{ color: "#6e6e73", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                        {datos.entregas} entrega{datos.entregas !== 1 ? "s" : ""} hoy
                      </div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#5856D6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>
                      {r.nombre.charAt(0)}
                    </div>
                  </div>
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f5f5f7", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cobrado hoy</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{formatMoney(datos.cobrado)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Estado</div>
                      <div style={{ marginTop: "0.25rem" }}>
                        <span style={{ background: datos.entregas > 0 ? "rgba(52,199,89,0.1)" : "rgba(110,110,115,0.1)", color: datos.entregas > 0 ? "#34C759" : "#6e6e73", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.72rem", fontWeight: 600 }}>
                          {datos.entregas > 0 ? "Activo" : "Sin entregas"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {repartidoresFiltrados.length === 0 && (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem", textAlign: "center", color: "#6e6e73", gridColumn: "1/-1" }}>
                No hay repartidores registrados
              </div>
            )}
          </div>
        </>
      )}

      {perfilRepartidor && (
        <PerfilRepartidor
          nombre={perfilRepartidor}
          onClose={() => setPerfilRepartidor(null)}
        />
      )}
    </div>
  );
}

// ══ Perfil individual del repartidor ══════════════════════
function PerfilRepartidor({ nombre, onClose }) {
  const [ordenesDia, setOrdenesDia] = useState([]);
  const [ordenesMes, setOrdenesMes] = useState([]);
  const [cierres, setCierres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("hoy");
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  useEffect(() => {
    function handleResize() { setIsMobile(window.innerWidth < 768); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { cargarDatos(); }, [filtroFecha]);

  async function cargarDatos() {
    setLoading(true);
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0];
    const nombreEnc = encodeURIComponent(nombre);

    const [resL, resD, resLMes, resDMes, resCierres] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha + "&repartidor_asignado=eq." + nombreEnc, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha + "&repartidor_asignado=eq." + nombreEnc, {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + inicioMes + "&repartidor_asignado=eq." + nombreEnc + "&estado_flujo=eq.entregada", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + inicioMes + "&repartidor_asignado=eq." + nombreEnc + "&estado_flujo=eq.entregada", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/cierres_caja?nombre=eq." + nombreEnc + "&tipo=eq.repartidor&order=creado_en.desc", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
    ]);

    const l = await resL.json();
    const d = await resD.json();
    const lMes = await resLMes.json();
    const dMes = await resDMes.json();
    setOrdenesDia([...l, ...d].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en)));
    setOrdenesMes([...lMes, ...dMes]);
    setCierres(await resCierres.json());
    setLoading(false);
  }

  const entregadasHoy = ordenesDia.filter(o => o.estado_flujo === "entregada");
  const pendientesHoy = ordenesDia.filter(o => o.estado_flujo !== "entregada");
  const cobradoHoy = entregadasHoy.reduce((s, o) => s + (o.monto_repartidor || 0), 0);
  const totalProductosHoy = entregadasHoy.reduce((s, o) => s + parseMonto(o.total_pagar), 0);
  const entregasMes = ordenesMes.length;
  const cobradoMes = ordenesMes.reduce((s, o) => s + (o.monto_repartidor || 0), 0);

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
      padding: "1.5rem", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
    }} onClick={onClose}>

      {/* X fuera del modal */}
      <button onClick={onClose} style={{
        position: "fixed", top: "1rem", right: "1rem",
        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%",
        width: 40, height: 40, cursor: "pointer", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1001, fontSize: "1rem",
      }}>✕</button>

      <div style={{
        background: "#f5f5f7", borderRadius: "20px",
        width: "100%", maxWidth: 920,
        maxHeight: "calc(100vh - 3rem)",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden", boxSizing: "border-box",
      }} onClick={e => e.stopPropagation()}>

        {/* ══ Columna izquierda ══ */}
        <div style={{
          background: "#1c1c1e", padding: "1.5rem",
          position: "relative", overflow: "hidden",
          width: isMobile ? "100%" : 280, flexShrink: 0,
          display: "flex", flexDirection: "column",
        }}>
          {/* Destellos */}
          <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(88,86,214,0.25) 0%, transparent 70%)", top: -100, right: -60, pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,199,89,0.15) 0%, transparent 70%)", bottom: -80, left: -40, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Avatar y nombre */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#5856D6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0 }}>
                {nombre.charAt(0)}
              </div>
              <div>
                <h2 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                  {nombre.replace("(Rep)", "").trim()}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", margin: "0.2rem 0 0" }}>Repartidor</p>
              </div>
            </div>

            {/* Cards del día */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Entregas hoy", value: entregadasHoy.length.toString(), color: "#34C759" },
                { label: "Pendientes hoy", value: pendientesHoy.length.toString(), color: "#FF9500" },
                { label: "Cobrado hoy", value: formatMoney(cobradoHoy) },
                { label: "Entregas del mes", value: entregasMes.toString(), color: "#5856D6" },
                { label: "Cobrado este mes", value: formatMoney(cobradoMes) },
              ].map((card, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "0.75rem 1rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>{card.label}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: card.color || "#fff" }}>{card.value}</div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Filtro de fecha */}
            <div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.35rem" }}>Fecha</div>
              <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} style={{
                width: "100%", padding: "0.6rem 0.85rem", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px", fontSize: "0.85rem", outline: "none",
                background: "rgba(255,255,255,0.08)", color: "#fff", boxSizing: "border-box",
              }} />
            </div>
          </div>
        </div>

        {/* ══ Columna derecha ══ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>

          {/* Tabs */}
          <div style={{ background: "#fff", padding: "0.75rem 1.25rem", display: "flex", gap: "0.25rem", borderBottom: "1px solid #f5f5f7", flexShrink: 0, flexWrap: "wrap" }}>
            <button onClick={() => setTab("hoy")} style={tabStyle(tab === "hoy")}>Entregas hoy</button>
            <button onClick={() => setTab("mes")} style={tabStyle(tab === "mes")}>Este mes</button>
            <button onClick={() => setTab("cierres")} style={tabStyle(tab === "cierres")}>Cierres de caja</button>
          </div>

          {/* Contenido */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", minHeight: 0 }}>
            {loading ? (
              <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div>
            ) : tab === "hoy" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {ordenesDia.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73" }}>Sin entregas asignadas para esta fecha</div>
                ) : ordenesDia.map((o, i) => {
                  const entregada = o.estado_flujo === "entregada";
                  return (
                    <div key={o.id} style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 700 }}>{o.numero_ficha}</span>
                          <span style={{ background: entregada ? "rgba(52,199,89,0.1)" : "rgba(255,149,0,0.1)", color: entregada ? "#34C759" : "#FF9500", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 600 }}>
                            {entregada ? "Entregada" : "Pendiente"}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, color: "#1d1d1f", fontSize: "0.9rem" }}>{o.total_pagar}</div>
                          <div style={{ color: "#FF9500", fontSize: "0.72rem", fontWeight: 600 }}>Cobro: ${o.monto_repartidor || 0}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 500, color: "#1d1d1f", fontSize: "0.85rem" }}>{o.nombre_cliente || "Sin nombre"}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#6e6e73", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                        <MapPin size={11} />
                        {o.direccion_entrega || (o.departamento + " - " + o.municipio)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : tab === "mes" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Entregas</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#5856D6" }}>{entregasMes}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cobrado</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FF9500" }}>{formatMoney(cobradoMes)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Promedio</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#34C759" }}>{formatMoney(entregasMes > 0 ? cobradoMes / entregasMes : 0)}</div>
                  </div>
                </div>
                {ordenesMes.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73" }}>Sin entregas este mes</div>
                ) : ordenesMes.map((o, i) => (
                  <div key={o.id} style={{ background: "#fff", borderRadius: "12px", padding: "0.85rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 700, marginRight: "0.4rem" }}>{o.numero_ficha}</span>
                        <span style={{ fontWeight: 500, color: "#1d1d1f", fontSize: "0.85rem" }}>{o.nombre_cliente || "Sin nombre"}</span>
                        <div style={{ color: "#6e6e73", fontSize: "0.72rem", marginTop: "0.15rem" }}>{o.fecha_orden}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: "#1d1d1f" }}>{o.total_pagar}</div>
                        <div style={{ color: "#FF9500", fontSize: "0.72rem" }}>+${o.monto_repartidor || 0}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Tab cierres
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {cierres.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73" }}>
                    Sin cierres de caja registrados
                  </div>
                ) : (
                  <>
                    <div style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Total histórico entregado</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34C759" }}>{formatMoney(cierres.reduce((s, c) => s + (c.monto_entregado || 0), 0))}</div>
                    </div>
                    {cierres.map((cierre, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                          <div>
                            <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.88rem" }}>Cierre de caja</div>
                            <div style={{ color: "#6e6e73", fontSize: "0.75rem" }}>
                              {new Date(cierre.creado_en).toLocaleDateString("es-SV", { day: "2-digit", month: "long", year: "numeric" })}
                            </div>
                          </div>
                          <span style={{ background: "rgba(52,199,89,0.1)", color: "#34C759", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.7rem", fontWeight: 600 }}>Completado</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid #f5f5f7" }}>
                          <div>
                            <div style={{ fontSize: "0.65rem", color: "#6e6e73", textTransform: "uppercase" }}>Total productos</div>
                            <div style={{ fontWeight: 700, color: "#1d1d1f" }}>{formatMoney(cierre.total_productos)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.65rem", color: "#6e6e73", textTransform: "uppercase" }}>Se quedó</div>
                            <div style={{ fontWeight: 700, color: "#FF9500" }}>{formatMoney(cierre.monto_cobrado)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.65rem", color: "#6e6e73", textTransform: "uppercase" }}>Entregó</div>
                            <div style={{ fontWeight: 700, color: "#34C759" }}>{formatMoney(cierre.monto_entregado)}</div>
                          </div>
                        </div>
                        {cierre.notas && (
                          <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "#6e6e73" }}>Nota: {cierre.notas}</div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
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
                <Trophy size={14} color="#6e6e73" style={{ marginRight: "0.4rem" }} />Ranking del mes
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem" }}>
                {/* Reordenar para que el 1ro esté en el centro */}
                {[rankingMes[1], rankingMes[0], rankingMes[2]].map((v, i) => {
                  if (!v) return <div key={i} style={{ width: 120 }} />;
                  const posReal = i === 0 ? 1 : i === 1 ? 0 : 2;
                  return (
                    <div key={i} onClick={() => setPerfilVendedor(v.vendedor)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: 120 }}>
                      <Medal size={28} color={coloresPodio[posReal]} style={{ marginBottom: "0.25rem" }} />
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
                 <option value="operaciones">Operaciones</option>
                  <option value="repartidor">Repartidor</option>
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

// ══ Panel de Operaciones ══════════════════════════════════
function OperacionesPanel({ user }) {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [busqueda, setBusqueda] = useState("");
  const [tab, setTab] = useState("todos");
  const [ordenEditar, setOrdenEditar] = useState(null);
  const [tipoEditar, setTipoEditar] = useState(null);
  const [copiado, setCopiado] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ordenesRef = useRef([]);
  const ultimaOrdenRef = useRef(null);

  useEffect(() => {
    if ("Notification" in window) Notification.requestPermission();
    function handleResize() { setIsMobile(window.innerWidth < 768); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 10000);
    return () => clearInterval(interval);
  }, [filtroFecha]);

  function reproducirSonido() {
    const audio = new Audio("/notificacion.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  async function cargarDatos() {
    const [resL, resD, resR] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha + "&estado_flujo=neq.pendiente_aprobacion&order=creado_en.desc", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha + "&estado_flujo=neq.pendiente_aprobacion&order=creado_en.desc", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/usuarios?rol=eq.repartidor&activo=eq.true", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
    ]);

    const localesData = await resL.json();
    const deptosData = await resD.json();
    const todasNuevas = [...localesData, ...deptosData];

    // Detectar orden nueva aprobada
    const ultima = todasNuevas.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))[0];
    if (ultimaOrdenRef.current && ultima && ultima.id !== ultimaOrdenRef.current) {
      reproducirSonido();
      if (Notification.permission === "granted") {
        new Notification("📦 Nueva orden aprobada", {
          body: (ultima.numero_ficha || "") + " — " + (ultima.nombre_cliente || "Sin nombre") + " — " + ultima.total_pagar,
          icon: "/logo.png",
        });
      }
    }
    ultimaOrdenRef.current = ultima?.id;
    ordenesRef.current = todasNuevas;

    setLocales(localesData);
    setDeptos(deptosData);
    setRepartidores(await resR.json());
    setLoading(false);
  }

  async function cambiarEstadoFlujo(id, tipo, nuevoEstado) {
    const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
    await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ estado_flujo: nuevoEstado }),
    });
    cargarDatos();
  }

  async function asignarRepartidor(id, tipo, repartidor, monto) {
    const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
    await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ repartidor_asignado: repartidor, monto_repartidor: parseFloat(monto) || 0, estado_flujo: "asignada" }),
    });
    cargarDatos();
  }

  const todas = [...locales, ...deptos].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
  const filtradas = todas.filter(o => {
    if (!busqueda) return true;
    const b = busqueda.toLowerCase();
    return (o.numero_ficha && o.numero_ficha.toLowerCase().includes(b)) ||
      (o.nombre_cliente && o.nombre_cliente.toLowerCase().includes(b));
  });

  const badgeEstado = (estado) => {
    const config = {
      aprobada: { bg: "rgba(0,122,255,0.1)", color: "#007AFF", label: "Aprobada" },
      preparada: { bg: "rgba(255,149,0,0.1)", color: "#FF9500", label: "Preparada" },
      asignada: { bg: "rgba(88,86,214,0.1)", color: "#5856D6", label: "Asignada" },
      entregada: { bg: "rgba(52,199,89,0.1)", color: "#34C759", label: "Entregada" },
      cancelada: { bg: "rgba(255,59,48,0.1)", color: "#ff3b30", label: "Cancelada" },
    };
    const c = config[estado] || { bg: "#f5f5f7", color: "#6e6e73", label: estado };
    return <span style={{ background: c.bg, color: c.color, borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.7rem", fontWeight: 600 }}>{c.label}</span>;
  };

  const tabStyle = (active) => ({
    padding: "0.45rem 1rem", borderRadius: "8px", border: "none",
    background: active ? "#007AFF" : "transparent",
    color: active ? "#fff" : "#6e6e73",
    fontWeight: active ? 600 : 400, fontSize: "0.85rem", cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  });

  const selectStyle = {
    padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px",
    fontSize: "0.85rem", background: "#fff", outline: "none", fontFamily: "'Inter', sans-serif",
  };

  const listaActual = tab === "todos" ? filtradas : tab === "locales" ? locales : deptos;

  const copiarOrden = (o) => {
    const texto = "Orden " + o.numero_ficha +
      "\n👤 " + (o.nombre_cliente || "Sin nombre") +
      "\n📱 " + (o.numero_contacto || "-") +
      "\n📍 " + (o.municipio || o.departamento || "-") +
      "\n🏠 " + (o.direccion_entrega || "-") +
      "\n📦 " + o.articulos +
      "\n💰 " + o.total_pagar;
    navigator.clipboard.writeText(texto);
    setCopiado(o.id);
    setTimeout(() => setCopiado(null), 2000);
  };

  // ══ Vista Móvil ══
  if (isMobile) {
    return (
      <div style={{ background: "#f5f5f7", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "#fff", padding: "1rem", borderBottom: "1px solid #f5f5f7", position: "sticky", top: 52, zIndex: 50 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#1d1d1f" }}>Operaciones</span>
              <span style={{ background: "rgba(52,199,89,0.1)", color: "#34C759", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.65rem", fontWeight: 600 }}>↻ 10s</span>
            </div>
            <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}
              style={{ padding: "0.35rem 0.6rem", border: "1px solid #e5e5ea", borderRadius: "8px", fontSize: "0.8rem", background: "#fff", outline: "none" }} />
          </div>
          <input placeholder="Buscar ficha o cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.85rem", background: "#f5f5f7", outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ padding: "0.75rem 1rem", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "0.5rem", minWidth: "max-content" }}>
            {[
              { label: "Aprob.", value: todas.filter(o => o.estado_flujo === "aprobada").length, color: "#007AFF" },
              { label: "Prep.", value: todas.filter(o => o.estado_flujo === "preparada").length, color: "#FF9500" },
              { label: "Asig.", value: todas.filter(o => o.estado_flujo === "asignada").length, color: "#5856D6" },
              { label: "Entregadas", value: todas.filter(o => o.estado_flujo === "entregada").length, color: "#34C759" },
              { label: "Canceladas", value: todas.filter(o => o.estado_flujo === "cancelada").length, color: "#ff3b30" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "0.6rem 0.85rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textAlign: "center", minWidth: 70 }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", marginBottom: "0.2rem" }}>{s.label}</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 1rem", display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
          {[["todos", `Todos (${filtradas.length})`], ["locales", `Loc. (${locales.length})`], ["deptos", `Dep. (${deptos.length})`]].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{ ...tabStyle(tab === val), fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: "0 1rem 2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Cargando...</div>
          ) : listaActual.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73" }}>No hay órdenes</div>
          ) : listaActual.map((o) => {
            const tipo = o.departamento ? "departamental" : "local";
            return (
              <div key={o.id} style={{ background: "#fff", borderRadius: "16px", padding: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.7rem", fontWeight: 700 }}>#{o.numero_ficha || "-"}</span>
                    {badgeEstado(o.estado_flujo || "aprobada")}
                  </div>
                  <span style={{ fontWeight: 700, color: "#1d1d1f", fontSize: "0.95rem" }}>{o.total_pagar}</span>
                </div>
                <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.9rem", marginBottom: "0.25rem" }}>{o.nombre_cliente || "Sin nombre"}</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <Package size={12} color="#6e6e73" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                  <span style={{ fontSize: "0.78rem", color: "#6e6e73" }}>{o.articulos?.slice(0, 50)}{o.articulos?.length > 50 ? "…" : ""}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", background: "#f5f5f7", borderRadius: "8px", padding: "0.5rem 0.75rem", marginBottom: "0.6rem" }}>
                  <MapPin size={12} color="#6e6e73" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                  <span style={{ fontSize: "0.78rem", color: "#6e6e73" }}>{o.direccion_entrega || (o.departamento + " - " + o.municipio)}</span>
                </div>
                {o.repartidor_asignado && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                    <Truck size={12} color="#5856D6" />
                    <span style={{ fontSize: "0.78rem", color: "#5856D6", fontWeight: 600 }}>{o.repartidor_asignado}</span>
                    {o.monto_repartidor > 0 && <span style={{ fontSize: "0.72rem", color: "#FF9500" }}>— ${o.monto_repartidor}</span>}
                  </div>
                )}
                <AccionesOperaciones
                  orden={o} tipo={tipo} repartidores={repartidores}
                  onCambiarEstado={cambiarEstadoFlujo}
                  onAsignar={asignarRepartidor}
                  onCopiar={() => copiarOrden(o)}
                  copiado={copiado === o.id}
                  isMobile={true}
                />
              </div>
            );
          })}
        </div>

        {ordenEditar && (
          <ModalEditar orden={ordenEditar} tipo={tipoEditar} rolUsuario="operaciones"
            onClose={() => setOrdenEditar(null)}
            onSave={() => { setOrdenEditar(null); cargarDatos(); }} />
        )}
      </div>
    );
  }

  // ══ Vista Desktop ══
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Operaciones</h2>
          <span style={{ background: "rgba(52,199,89,0.1)", color: "#34C759", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.7rem", fontWeight: 600 }}>↻ 10s</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input placeholder="Buscar ficha o cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={selectStyle} />
          <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} style={selectStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Aprobadas", value: todas.filter(o => o.estado_flujo === "aprobada").length, color: "#007AFF" },
          { label: "Preparadas", value: todas.filter(o => o.estado_flujo === "preparada").length, color: "#FF9500" },
          { label: "Asignadas", value: todas.filter(o => o.estado_flujo === "asignada").length, color: "#5856D6" },
          { label: "Entregadas", value: todas.filter(o => o.estado_flujo === "entregada").length, color: "#34C759" },
          { label: "Canceladas", value: todas.filter(o => o.estado_flujo === "cancelada").length, color: "#ff3b30" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "1rem 1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>{s.label}</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "0.25rem", padding: "0.75rem 1rem", borderBottom: "1px solid #f5f5f7" }}>
          <button onClick={() => setTab("todos")} style={tabStyle(tab === "todos")}>Todos ({filtradas.length})</button>
          <button onClick={() => setTab("locales")} style={tabStyle(tab === "locales")}>Locales ({locales.length})</button>
          <button onClick={() => setTab("deptos")} style={tabStyle(tab === "deptos")}>Deptos ({deptos.length})</button>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>Cargando...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f5f5f7" }}>
                  {["Ficha", "Cliente", "Artículos", "Dirección", "Total", "Estado", "Repartidor", "Acciones"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#6e6e73", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listaActual.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>No hay órdenes</td></tr>
                )}
                {listaActual.map((o) => {
                  const tipo = o.departamento ? "departamental" : "local";
                  return (
                    <tr key={o.id} style={{ borderBottom: "1px solid #f5f5f7" }}>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#007AFF", cursor: "pointer" }} onClick={() => { setOrdenEditar(o); setTipoEditar(tipo); }}>
                        #{o.numero_ficha || "-"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>{o.nombre_cliente || "Sin nombre"}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6e6e73", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.articulos}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6e6e73", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.direccion_entrega || (o.departamento + " - " + o.municipio)}</td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{o.total_pagar}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>{badgeEstado(o.estado_flujo || "aprobada")}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6e6e73", fontSize: "0.8rem" }}>
                        {o.repartidor_asignado || "—"}
                        {o.monto_repartidor > 0 && <div style={{ color: "#FF9500", fontSize: "0.72rem" }}>${o.monto_repartidor}</div>}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }} onClick={e => e.stopPropagation()}>
                        <AccionesOperaciones
                          orden={o} tipo={tipo} repartidores={repartidores}
                          onCambiarEstado={cambiarEstadoFlujo}
                          onAsignar={asignarRepartidor}
                          onCopiar={() => copiarOrden(o)}
                          copiado={copiado === o.id}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ordenEditar && (
        <ModalEditar orden={ordenEditar} tipo={tipoEditar} rolUsuario="operaciones"
          onClose={() => setOrdenEditar(null)}
          onSave={() => { setOrdenEditar(null); cargarDatos(); }} />
      )}
    </div>
  );
}



// ══ Acciones por orden en Operaciones ══════════════════════
function AccionesOperaciones({ orden, tipo, repartidores, onCambiarEstado, onAsignar, onCopiar, copiado, isMobile }) {
  const [showAsignar, setShowAsignar] = useState(false);
  const [repartidorSel, setRepartidorSel] = useState("");
  const [montoRep, setMontoRep] = useState("");

  const estado = orden.estado_flujo || "aprobada";
  const esDepartamental = tipo === "departamental";

  const btnBase = {
    border: "none", borderRadius: "8px",
    fontSize: isMobile ? "0.85rem" : "0.82rem",
    cursor: "pointer", fontWeight: 600,
    whiteSpace: "nowrap", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "0.35rem",
    padding: isMobile ? "0.65rem 1rem" : "0.45rem 0.85rem",
    flex: isMobile ? 1 : "none",
  };

  return (
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>

      {/* Botón Preparar — igual para locales y departamentales */}
      {estado === "aprobada" && (
        <button onClick={() => onCambiarEstado(orden.id, tipo, "preparada")}
          style={{ ...btnBase, background: "rgba(255,149,0,0.1)", color: "#FF9500" }}>
          <Package size={isMobile ? 15 : 14} /> Preparar
        </button>
      )}

      {/* Botón Asignar — solo para locales */}
      {estado === "preparada" && !esDepartamental && (
        <button onClick={() => setShowAsignar(true)}
          style={{ ...btnBase, background: "rgba(88,86,214,0.1)", color: "#5856D6" }}>
          <Truck size={isMobile ? 15 : 14} /> Asignar
        </button>
      )}

      {/* Departamentales: en preparada ya están listas — badge informativo */}
      {estado === "preparada" && esDepartamental && (
        <span style={{
          background: "rgba(52,199,89,0.1)", color: "#34C759",
          borderRadius: "6px", padding: "0.3rem 0.6rem",
          fontSize: "0.75rem", fontWeight: 600,
          display: "flex", alignItems: "center", gap: "0.3rem",
        }}>
          <CheckCircle size={13} /> Lista para envío
        </span>
      )}

      {/* Cancelar */}
      {(estado === "aprobada" || estado === "preparada" || estado === "asignada") && (
        <button onClick={() => onCambiarEstado(orden.id, tipo, "cancelada")}
          style={{ ...btnBase, background: "rgba(255,59,48,0.1)", color: "#ff3b30" }}>
          <XCircle size={isMobile ? 15 : 14} /> Cancelar
        </button>
      )}

      {/* Reactivar */}
      {estado === "cancelada" && (
        <button onClick={() => onCambiarEstado(orden.id, tipo, "aprobada")}
          style={{ ...btnBase, background: "rgba(52,199,89,0.1)", color: "#34C759" }}>
          <RefreshCw size={isMobile ? 15 : 14} /> Reactivar
        </button>
      )}

      {/* Copiar */}
      <button onClick={onCopiar} style={{
        padding: isMobile ? "0.65rem" : "0.45rem",
        background: copiado ? "rgba(52,199,89,0.1)" : "#f5f5f7",
        border: "none", borderRadius: "8px", cursor: "pointer",
        color: copiado ? "#34C759" : "#6e6e73",
        display: "flex", alignItems: "center", justifyContent: "center",
        minWidth: isMobile ? 44 : "auto",
      }}>
        {copiado ? <Check size={isMobile ? 16 : 15} /> : <Copy size={isMobile ? 16 : 15} />}
      </button>

      {/* Modal asignar repartidor — solo locales */}
      {showAsignar && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
        }} onClick={() => setShowAsignar(false)}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "1.5rem",
            maxWidth: 380, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1d1d1f", margin: 0 }}>Asignar repartidor</h3>
                <p style={{ fontSize: "0.78rem", color: "#6e6e73", margin: "0.2rem 0 0" }}>
                  {orden.numero_ficha} — {orden.nombre_cliente || "Sin nombre"}
                </p>
              </div>
              <button onClick={() => setShowAsignar(false)} style={{
                background: "#f5f5f7", border: "none", borderRadius: "50%",
                width: 32, height: 32, cursor: "pointer", color: "#6e6e73",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", marginBottom: "0.35rem", textTransform: "uppercase" }}>Repartidor</label>
              <select value={repartidorSel} onChange={e => setRepartidorSel(e.target.value)} style={{
                width: "100%", padding: "0.75rem 0.85rem", border: "1px solid #e5e5ea",
                borderRadius: "10px", fontSize: "0.9rem", outline: "none", background: "#f5f5f7",
                boxSizing: "border-box",
              }}>
                <option value="">Seleccionar...</option>
                {repartidores.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73", marginBottom: "0.35rem", textTransform: "uppercase" }}>Monto del repartidor ($)</label>
              <input type="text" inputMode="decimal" value={montoRep} onChange={e => setMontoRep(e.target.value)}
                placeholder="0.00" style={{
                  width: "100%", padding: "0.75rem 0.85rem", border: "1px solid #e5e5ea",
                  borderRadius: "10px", fontSize: "0.9rem", outline: "none", background: "#f5f5f7",
                  boxSizing: "border-box",
                }} />
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowAsignar(false)} style={{
                flex: 1, padding: "0.85rem", background: "#f5f5f7", color: "#6e6e73",
                border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
                fontSize: "0.9rem",
              }}>Cancelar</button>
              <button onClick={() => {
                if (!repartidorSel) return;
                onAsignar(orden.id, tipo, repartidorSel, montoRep);
                setShowAsignar(false);
              }} style={{
                flex: 2, padding: "0.85rem", background: "#007AFF", color: "#fff",
                border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                fontSize: "0.9rem",
              }}>
                <Truck size={16} /> Asignar repartidor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ══ Panel de Repartidor ════════════════════════════════════
function RepartidorPanel({ user }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const ordenesRef = useRef([]);

  useEffect(() => {
    if ("Notification" in window) Notification.requestPermission();
    cargarMisEntregas();
    const interval = setInterval(cargarMisEntregas, 15000);
    return () => clearInterval(interval);
  }, [filtroFecha]);

  function reproducirSonido() {
    const audio = new Audio("/notificacion.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  async function cargarMisEntregas() {
    const nombre = encodeURIComponent(user.nombre);
    const [resL, resD] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha + "&repartidor_asignado=eq." + nombre + "&order=creado_en.desc", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha + "&repartidor_asignado=eq." + nombre + "&order=creado_en.desc", {
        headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      }),
    ]);
    const l = await resL.json();
    const d = await resD.json();
    const nuevas = [...l, ...d].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));

    // Detectar orden nueva asignada
    nuevas.forEach(orden => {
      const existia = ordenesRef.current.find(o => o.id === orden.id);
      if (!existia) {
        reproducirSonido();
        if (Notification.permission === "granted") {
          new Notification("🚚 Nueva entrega asignada", {
            body: (orden.numero_ficha || "") + " — " + (orden.nombre_cliente || "Sin nombre") + " — " + (orden.direccion_entrega || orden.municipio || ""),
            icon: "/logo.png",
          });
        }
      }
    });
    ordenesRef.current = nuevas;
    setOrdenes(nuevas);
    setLoading(false);
  }

  async function marcarEntregada(id, tipo) {
    const tabla = tipo === "local" ? "ordenes_locales" : "ordenes_departamentales";
    await fetch(SUPABASE_URL + "/rest/v1/" + tabla + "?id=eq." + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ estado_flujo: "entregada" }),
    });
    cargarMisEntregas();
  }

  const pendientes = ordenes.filter(o => o.estado_flujo !== "entregada");
  const entregadas = ordenes.filter(o => o.estado_flujo === "entregada");
  const totalACobrar = ordenes.reduce((s, o) => s + (o.monto_repartidor || 0), 0);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "¡Buenos días!" : hora < 18 ? "¡Buenas tardes!" : "¡Buenas noches!";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "'Inter', sans-serif" }}>
      <div style={{
        background: "linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)",
        padding: "2rem 1.5rem 3rem",
        position: "relative", overflow: "hidden",
        marginTop: "-52px", paddingTop: "calc(2rem + 52px)",
      }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)", top: -100, right: -50, pointerEvents: "none" }} />

        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <Sun size={14} color="rgba(255,255,255,0.5)" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>{saludo}</p>
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>
            {user.nombre.replace("(Rep)", "").trim()}
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
            {[
              { label: "Pendientes", value: pendientes.length.toString(), color: "#FF9500", icon: <Clock size={14} color="#FF9500" /> },
              { label: "Entregadas", value: entregadas.length.toString(), color: "#34C759", icon: <CheckCircle size={14} color="#34C759" /> },
              { label: "A cobrar", value: formatMoney(totalACobrar), color: "#007AFF", icon: <DollarSign size={14} color="#007AFF" /> },
            ].map((c, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px", padding: "0.85rem 0.75rem", textAlign: "center",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.35rem" }}>{c.icon}</div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>{c.label}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: c.color, letterSpacing: "-0.01em" }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "1.5rem auto 0", padding: "0 1.5rem 3rem", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#1d1d1f", margin: 0 }}>Mis entregas</h2>
          <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} style={{
            padding: "0.4rem 0.75rem", border: "1px solid #e5e5ea", borderRadius: "10px",
            fontSize: "0.82rem", background: "#fff", outline: "none",
          }} />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Cargando...</div>
        ) : ordenes.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#6e6e73" }}>
            No tienes entregas asignadas para esta fecha
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {ordenes.map(o => {
              const tipo = o.departamento ? "departamental" : "local";
              const entregada = o.estado_flujo === "entregada";
              return (
                <div key={o.id} style={{
                  background: "#fff", borderRadius: "16px", padding: "1rem 1.25rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  opacity: entregada ? 0.7 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <span style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF", borderRadius: "6px", padding: "0.15rem 0.4rem", fontSize: "0.68rem", fontWeight: 700 }}>
                        {o.numero_ficha}
                      </span>
                      <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.88rem", marginTop: "0.25rem" }}>{o.nombre_cliente || "Sin nombre"}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#6e6e73", fontSize: "0.75rem", marginTop: "0.15rem" }}>
                        <Phone size={11} />
                        {o.numero_contacto || "Sin número"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#1d1d1f" }}>{o.total_pagar}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#FF9500", fontSize: "0.75rem", fontWeight: 600, justifyContent: "flex-end", marginTop: "0.15rem" }}>
                        <DollarSign size={11} />
                        Cobrar: ${o.monto_repartidor || 0}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", background: "#f5f5f7", borderRadius: "8px", padding: "0.6rem 0.85rem", marginBottom: "0.6rem" }}>
                    <MapPin size={13} color="#6e6e73" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                    <span style={{ fontSize: "0.8rem", color: "#6e6e73" }}>{o.direccion_entrega || (o.departamento + " - " + o.municipio)}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <Package size={13} color="#6e6e73" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                    <span style={{ fontSize: "0.78rem", color: "#6e6e73" }}>{o.articulos?.slice(0, 60)}{o.articulos?.length > 60 ? "…" : ""}</span>
                  </div>

                  {!entregada ? (
                    <button onClick={() => marcarEntregada(o.id, tipo)} style={{
                      width: "100%", padding: "0.7rem",
                      background: "#34C759", color: "#fff",
                      border: "none", borderRadius: "10px", fontWeight: 600,
                      fontSize: "0.85rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    }}>
                      <CheckCircle size={16} /> Marcar como entregada
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", color: "#34C759", fontSize: "0.82rem", fontWeight: 600 }}>
                      <CheckCircle size={15} /> Entregada
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ══ Tienda (Ventas en punto de venta) ═════════════════════
function AdminTienda({ user }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const QUIEN_INGRESA = ["Tecno Gadget - Fer", "Tecno Gadget - Jefferson", "Tecno Gadget - Wendy", "Tecno Gadget - Liss", "Tecno Gadget - Isa", "Tecno Gadget - Josue"];
  const FORMAS_PAGO = ["Efectivo", "Transferencia", "Tarjeta", "Otro"];
  const TIPOS_COMPROBANTE = ["Ticket", "Factura", "Factura Consumidor Final", "Sin comprobante"];

  const initialForm = {
    articulos: "", nombre_cliente: "", total_pagar: "",
    forma_pago: "Efectivo", tipo_comprobante: "Ticket",
    quien_ingresa: user.nombre, comentario_libre: "",
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => { cargarVentas(); }, [filtroFecha]);

  async function cargarVentas() {
    setLoading(true);
    const res = await fetch(SUPABASE_URL + "/rest/v1/ordenes_tienda?fecha_orden=eq." + filtroFecha + "&order=creado_en.desc", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
    });
    setVentas(await res.json());
    setLoading(false);
  }

  async function guardarVenta() {
    if (!form.articulos || !form.total_pagar || !form.forma_pago || !form.tipo_comprobante || !form.quien_ingresa) return;
    setSaving(true);

    // Generar número de ficha VEN-YYMMDD-XXX
    const resUltimo = await fetch(SUPABASE_URL + "/rest/v1/ordenes_tienda?select=numero_ficha&order=id.desc&limit=1", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
    });
    const dataUltimo = await resUltimo.json();
    let numero = 1;
    if (dataUltimo.length > 0 && dataUltimo[0].numero_ficha) {
      const partes = dataUltimo[0].numero_ficha.split("-");
      numero = (parseInt(partes[partes.length - 1]) || 0) + 1;
    }
    const d = new Date();
    const fecha = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    const numeroFicha = "VEN-" + fecha + "-" + String(numero).padStart(3, "0");

    await fetch(SUPABASE_URL + "/rest/v1/ordenes_tienda", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify({ ...form, numero_ficha: numeroFicha, fecha_orden: filtroFecha }),
    });

    setSaving(false);
    setShowModal(false);
    setForm(initialForm);
    cargarVentas();
  }

  const totalDia = ventas.reduce((s, v) => s + parseMonto(v.total_pagar), 0);

  const inputStyle = {
    width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #e5e5ea",
    borderRadius: "8px", fontSize: "0.88rem", outline: "none",
    background: "#f5f5f7", color: "#1d1d1f", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#6e6e73",
    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.35rem",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Tienda</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} style={{
            padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px",
            fontSize: "0.85rem", background: "#fff", outline: "none",
          }} />
          <button onClick={() => setShowModal(true)} style={{
            padding: "0.5rem 1rem", background: "#007AFF", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "0.85rem",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem",
          }}>
            + Venta nueva
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Ventas hoy" value={ventas.length.toString()} />
        <StatCard label="Total recaudado" value={formatMoney(totalDia)} accent="#007AFF" />
      </div>

      {/* Tabla de ventas */}
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>Cargando...</div>
        ) : ventas.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>No hay ventas para esta fecha</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f5f5f7" }}>
                {["Ficha", "Cliente", "Artículos", "Total", "Pago", "Quien registra"].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#6e6e73", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ventas.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: "1px solid #f5f5f7" }}>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#007AFF" }}>#{v.numero_ficha}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{v.nombre_cliente || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6e6e73", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.articulos}</td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{v.total_pagar}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>{v.forma_pago}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>{v.quien_ingresa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal nueva venta */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "1.5rem",
            width: "100%", maxWidth: 480, maxHeight: "85vh",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            display: "flex", flexDirection: "column",
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexShrink: 0 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1d1d1f", margin: 0 }}>Nueva venta en tienda</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "#f5f5f7", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#6e6e73", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Artículos *</label>
                <textarea value={form.articulos} onChange={e => setForm(p => ({ ...p, articulos: e.target.value }))} style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} placeholder="Describe los artículos vendidos" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Total *</label>
                  <input value={form.total_pagar} onChange={e => setForm(p => ({ ...p, total_pagar: e.target.value }))} style={inputStyle} placeholder="$0.00" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Cliente (opcional)</label>
                  <input value={form.nombre_cliente} onChange={e => setForm(p => ({ ...p, nombre_cliente: e.target.value }))} style={inputStyle} placeholder="Nombre del cliente" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Forma de pago *</label>
                  <select value={form.forma_pago} onChange={e => setForm(p => ({ ...p, forma_pago: e.target.value }))} style={inputStyle}>
                    {FORMAS_PAGO.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Comprobante *</label>
                  <select value={form.tipo_comprobante} onChange={e => setForm(p => ({ ...p, tipo_comprobante: e.target.value }))} style={inputStyle}>
                    {TIPOS_COMPROBANTE.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Quién registra *</label>
                <select value={form.quien_ingresa} onChange={e => setForm(p => ({ ...p, quien_ingresa: e.target.value }))} style={inputStyle}>
                  {QUIEN_INGRESA.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Comentario (opcional)</label>
                <textarea value={form.comentario_libre} onChange={e => setForm(p => ({ ...p, comentario_libre: e.target.value }))} style={{ ...inputStyle, resize: "vertical", minHeight: 56 }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #f5f5f7", flexShrink: 0 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: "0.75rem", background: "#f5f5f7", color: "#6e6e73",
                border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
              }}>Cancelar</button>
              <button onClick={guardarVenta} disabled={saving} style={{
                flex: 2, padding: "0.75rem",
                background: saving ? "#e5e5ea" : "#007AFF",
                color: saving ? "#6e6e73" : "#fff",
                border: "none", borderRadius: "10px", fontWeight: 600, cursor: saving ? "default" : "pointer",
              }}>
                {saving ? "Guardando..." : "Registrar venta"}
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

  function handleLogin(u) {
    setUser(u);
    localStorage.setItem("panel_user", JSON.stringify(u));
    if (u.rol === "admin") setActiveTab("dashboard");
    else if (u.rol === "operaciones") setActiveTab("ordenes");
    else if (u.rol === "repartidor") setActiveTab("mis-entregas");
    else setActiveTab("mis-ordenes");
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("panel_user");
  }

  useEffect(() => {
    if (user) {
      if (user.rol === "admin") setActiveTab("dashboard");
      else if (user.rol === "operaciones") setActiveTab("ordenes");
      else if (user.rol === "repartidor") setActiveTab("mis-entregas");
      else setActiveTab("mis-ordenes");
    }
  }, []);

  if (!user) return <Login onLogin={handleLogin} />;

  function renderContent() {
    if (user.rol === "admin") {
      if (activeTab === "dashboard") return <Dashboard user={user} />;
      if (activeTab === "ordenes") return <AdminOrdenes rolUsuario="admin" />;
      if (activeTab === "estadisticas") return <AdminEstadisticas />;
      if (activeTab === "vendedores") return <AdminVendedores />;
      if (activeTab === "equipo") return <AdminEquipo />;
      if (activeTab === "tienda") return <AdminTienda user={user} />;
      if (activeTab === "repartidores") return <AdminRepartidores />;
    } else if (user.rol === "operaciones") {
      if (activeTab === "ordenes") return <OperacionesPanel user={user} />;
      if (activeTab === "tienda") return <AdminTienda user={user} />;
      if (activeTab === "cobros") return <CobrosRepartidor />;
       if (activeTab === "repartidores") return <AdminRepartidores />;
    } else if (user.rol === "repartidor") {
      return <RepartidorPanel user={user} />;
    } else {
      return <VendedorPanel user={user} />;
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={user.rol === "vendedor" || user.rol === "repartidor"} />
      {renderContent()}
    </div>
  );
}

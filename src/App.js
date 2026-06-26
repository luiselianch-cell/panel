/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// eslint-disable-next-line no-unused-vars
import { Home, ClipboardList, BarChart2, Users, UserCheck, Search, Menu, MessageCircle, Eye, EyeOff } from "lucide-react";
import { Copy, XCircle, RefreshCw } from "lucide-react";

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
            <div style={{ display: "flex", flex: 1 }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{
                  padding: "0.4rem 0.85rem",
                  background: "transparent",
                  color: activeTab === tab.id ? textActive : textColor,
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid " + textActive : "2px solid transparent",
                  borderRadius: 0,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  transition: "all 0.15s",
                  paddingBottom: "0.5rem",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {tab.icon}{tab.label}
                </button>
              ))}
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
  onFocus={e => e.target.style.border = "1.5px solid #007AFF"}
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
    }} title="Copiar orden"
      style={{
        padding: "0.3rem", background: "#f5f5f7",
        border: "none", borderRadius: "6px",
        cursor: "pointer", color: "#6e6e73",
        display: "flex", alignItems: "center",
      }}>
      <Copy size={14} />
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

// == Dashboard ═══════════════════════════════════════════════
function Dashboard({ user }) {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);

  function cargarDatos() {
    const hoy = fechaHoy();
    Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + hoy + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + hoy + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]).then(async ([resL, resD]) => {
      setLocales(await resL.json());
      setDeptos(await resD.json());
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
          <p style={{ color: "#6e6e73", fontSize: "1rem", margin: 0 }}>
            ¿Cuántas ventas hicimos hoy?
          </p>
        </div>

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
                      <span style={{ background: "#007AFF", color: "#fff", borderRadius: "6px", padding: "0.2rem 0.5rem", fontSize: "0.75rem", fontWeight: 700 }}>Ficha #{ultimaOrden.numero_ficha}</span>
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
function AdminOrdenes({ busquedaGlobal }) {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [filtroVendedor, setFiltroVendedor] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("");
  const [tab, setTab] = useState("locales");

  useEffect(() => { cargarOrdenes(); }, [filtroFecha]);

  async function cargarOrdenes() {
    setLoading(true);
    try {
      const [resL, resD] = await Promise.all([
        fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
        fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
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

  const vendedores = [...new Set([...locales, ...deptos].map(o => o.quien_ingresa).filter(Boolean))];
  const perfiles = [...new Set([...locales, ...deptos].map(o => o.perfil_salio_1 || o.perfil_salio).filter(Boolean))];

  function filtrar(lista) {
    return lista.filter(o => {
      if (filtroVendedor && o.quien_ingresa !== filtroVendedor) return false;
      if (filtroPerfil && (o.perfil_salio_1 || o.perfil_salio) !== filtroPerfil) return false;
      return true;
    });
  }

  const lF = filtrar(locales);
  const dF = filtrar(deptos);
  const totalL = lF.reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = dF.reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);

  const selectStyle = { padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.85rem", background: "#fff", color: "#1d1d1f", outline: "none" };
  const tabStyle = (active) => ({
    padding: "0.45rem 1rem", borderRadius: "8px", border: "none",
    background: active ? "#007AFF" : "transparent",
    color: active ? "#fff" : "#6e6e73",
    fontWeight: active ? 600 : 400, fontSize: "0.85rem", cursor: "pointer",
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Órdenes</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} style={selectStyle} />
          <select value={filtroVendedor} onChange={e => setFiltroVendedor(e.target.value)} style={selectStyle}>
            <option value="">Todos los vendedores</option>
            {vendedores.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={filtroPerfil} onChange={e => setFiltroPerfil(e.target.value)} style={selectStyle}>
            <option value="">Todos los perfiles</option>
            {perfiles.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Locales (neto)" value={formatMoney(totalL)} sub={lF.length + " órdenes"} />
        <StatCard label="Deptos (neto)" value={formatMoney(totalD)} sub={dF.length + " órdenes"} />
        <StatCard label="Total General" value={formatMoney(totalL + totalD)} sub={(lF.length + dF.length) + " órdenes"} accent="#007AFF" />
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "0.25rem", padding: "0.75rem 1rem", borderBottom: "1px solid #f5f5f7" }}>
          <button onClick={() => setTab("locales")} style={tabStyle(tab === "locales")}>Locales ({lF.length})</button>
          <button onClick={() => setTab("departamentales")} style={tabStyle(tab === "departamentales")}>Departamentales ({dF.length})</button>
        </div>
        {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>Cargando...</div>
          : tab === "locales"
          ? <TablaOrdenes ordenes={lF} tipo="local" onUpdateEnvio={actualizarEnvio} esAdmin={true} onSave={cargarOrdenes}/>
          : <TablaOrdenes ordenes={dF} tipo="departamental" esAdmin={true} onSave={cargarOrdenes} />}
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

  const ventasPorDia = {};
  locales.forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = { fecha: o.fecha_orden, locales: 0, deptos: 0 };
    ventasPorDia[o.fecha_orden].locales += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptos.forEach(o => {
    if (!ventasPorDia[o.fecha_orden]) ventasPorDia[o.fecha_orden] = { fecha: o.fecha_orden, locales: 0, deptos: 0 };
    ventasPorDia[o.fecha_orden].deptos += parseMonto(o.total_pagar) - ENVIO_DEPTO;
  });
  const chartData = Object.values(ventasPorDia).sort((a, b) => a.fecha.localeCompare(b.fecha));

  const porPerfil = {};
  [...locales, ...deptos].forEach(o => {
    const p = o.perfil_salio_1 || o.perfil_salio || "Sin perfil";
    porPerfil[p] = (porPerfil[p] || 0) + 1;
  });
  const pieData = Object.entries(porPerfil).map(([name, value]) => ({ name, value }));
  const totalL = locales.reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = deptos.reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);

  const btnStyle = (active) => ({
    padding: "0.4rem 0.85rem", borderRadius: "8px",
    background: active ? "#007AFF" : "#f5f5f7",
    color: active ? "#fff" : "#6e6e73",
    border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: active ? 600 : 400,
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Estadísticas</h2>
        <div style={{ display: "flex", gap: "0.35rem", background: "#f5f5f7", borderRadius: "10px", padding: "0.25rem" }}>
          {["semana", "mes", "trimestre"].map(r => <button key={r} onClick={() => setRango(r)} style={btnStyle(rango === r)}>{r}</button>)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Locales" value={formatMoney(totalL)} />
        <StatCard label="Total Deptos" value={formatMoney(totalD)} />
        <StatCard label="Gran Total" value={formatMoney(totalL + totalD)} accent="#007AFF" />
        <StatCard label="Órdenes" value={(locales.length + deptos.length).toString()} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1.25rem" }}>Ventas por día</div>
          {loading ? <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Cargando...</div> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f7" />
                <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: "#6e6e73" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6e6e73" }} />
                <Tooltip formatter={v => formatMoney(v)} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="locales" name="Locales" fill="#007AFF" radius={[6, 6, 0, 0]} />
                <Bar dataKey="deptos" name="Deptos" fill="#34C759" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1.25rem" }}>Por perfil</div>
          {loading ? <div style={{ textAlign: "center", color: "#6e6e73", padding: "2rem" }}>Cargando...</div> : (
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
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span style={{ color: "#1d1d1f" }}>{entry.name}</span>
                    </div>
                    <span style={{ color: "#6e6e73", fontWeight: 600 }}>{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ══ AdminVendedores ═══════════════════════════════════════
function AdminVendedores() {
  const [locales, setLocales] = useState([]);
  const [deptos, setDeptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => { cargarTodo(); }, [filtroFecha]);

  async function cargarTodo() {
    setLoading(true);
    const [resL, resD] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]);
    setLocales(await resL.json());
    setDeptos(await resD.json());
    setLoading(false);
  }

  const porVendedor = {};
  locales.forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    const VENDEDORES_EXTERNOS = [
          "Maressa (Vend)",
          "Yanci (Vend)",
          "Sara Eunice (Vend)",
          "Kevin (Vend)",
          "Marisol (Vend)",
          "Herbert (Vend)",
      ];
    if (!VENDEDORES_EXTERNOS.includes(v)) return;  
    if (v.includes("Tecno Gadget")) return; // Excluir órdenes de Tecno Gadget
    if (v.includes("Caleb (Venta Propia)")) return; // Excluir órdenes de Caleb
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, ordenes: 0, total: 0 };
    porVendedor[v].ordenes++;
    porVendedor[v].total += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptos.forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
    const VENDEDORES_EXTERNOS = [
  "Maressa (Vend)",
  "Yanci (Vend)",
  "Sara Eunice (Vend)",
  "Kevin (Vend)",
  "Marisol (Vend)",
  "Herbert (Vend)",
];
    
    if (!VENDEDORES_EXTERNOS.includes(v)) return;
    if (v.includes("TecnoGadget")) return; // Excluir órdenes de TecnoGadget
    if (v.includes("Caleb (Venta Propia)")) return; // Excluir órdenes de Caleb 
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, ordenes: 0, total: 0 };
    porVendedor[v].ordenes++;
    porVendedor[v].total += parseMonto(o.total_pagar) - ENVIO_DEPTO;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Vendedores</h2>
        <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} />
        <input placeholder="Buscar vendedor..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.85rem", background: "#fff", outline: "none", fontFamily: "'Inter', sans-serif" }} />
      </div>

      {loading ? <div style={{ textAlign: "center", color: "#6e6e73", padding: "3rem" }}>Cargando...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {Object.values(porVendedor)
          .filter(v => v.vendedor.toLowerCase().includes(busqueda.toLowerCase()))
          .map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#1d1d1f", fontSize: "0.95rem" }}>{v.vendedor}</div>
                  <div style={{ color: "#6e6e73", fontSize: "0.78rem", marginTop: "0.2rem" }}>{v.ordenes} orden{v.ordenes !== 1 ? "es" : ""}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>
                  {v.vendedor.split(" ").pop().charAt(0)}
                </div>
              </div>
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f5f5f7", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total vendido</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{formatMoney(v.total)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>Comisión 10%</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34C759", letterSpacing: "-0.02em" }}>{formatMoney(v.total * COMISION)}</div>
                </div>
              </div>
            </div>
          ))}
          {Object.keys(porVendedor).length === 0 && (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem", textAlign: "center", color: "#6e6e73", gridColumn: "1/-1" }}>No hay órdenes para esta fecha</div>
          )}
        </div>
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
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());

  useEffect(() => { cargarMisOrdenes(); }, [filtroFecha]);

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
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha + "&quien_ingresa=eq." + nombre + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=gte." + inicioMes + "&quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=gte." + inicioMes + "&quien_ingresa=eq." + nombre, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
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
  const nombreCorto = user.nombre.split(" ")[0].replace("(Vend)", "").trim();

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
          <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}
            style={{ padding: "0.4rem 0.75rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.82rem", background: "#fff", outline: "none", fontFamily: "'Inter', sans-serif" }} />
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
                <div key={o.id} style={{
                  background: "#fff", borderRadius: "16px",
                  padding: "1rem 1.25rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  opacity: cancelada ? 0.5 : 1,
                  borderLeft: cancelada ? "3px solid #ff3b30" : "3px solid transparent",
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
                      <button onClick={() => handleEditar(u)} style={{ padding: "0.3rem 0.6rem", background: "#f5f5f7", border: "none", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", color: "#007AFF", fontWeight: 500 }}>Editar</button>
                      <button onClick={() => toggleActivo(u)} style={{ padding: "0.3rem 0.6rem", background: u.activo ? "#fff2f2" : "#f0fff4", border: "none", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", color: u.activo ? "#ff3b30" : "#34C759", fontWeight: 500 }}>
                        {u.activo ? "Desactivar" : "Activar"}
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
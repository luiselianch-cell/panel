/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// eslint-disable-next-line no-unused-vars
import { Search } from "lucide-react";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;
const ENVIO_DEPTO = 3.39;
const COMISION = 0.10;
const LOGO_URL = "/Logo-banner.png";

const USUARIOS = [
  { usuario: "admin", password: "admin2026", rol: "admin", nombre: "Administrador" },
  { usuario: "fer", password: "fer2026", rol: "vendedor", nombre: "Tecno Gadget - Fer" },
  { usuario: "jefferson", password: "jeff2026", rol: "vendedor", nombre: "Tecno Gadget - Jefferson" },
  { usuario: "wendy", password: "wendy2026", rol: "vendedor", nombre: "Tecno Gadget - Wendy" },
  { usuario: "liss", password: "liss2026", rol: "vendedor", nombre: "Tecno Gadget - Liss" },
  { usuario: "isa", password: "isa2026", rol: "vendedor", nombre: "Tecno Gadget - Isa" },
];

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

  function handleLogin() {
    const user = USUARIOS.find(u => u.usuario === usuario && u.password === password);
    if (user) { onLogin(user); } else { setError("Usuario o contraseña incorrectos"); }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f5f5f7",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "1rem",
      overflow: "hidden",
      position: "fixed",
      width: "100%",
    }}>
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        <img src={LOGO_URL} alt="Tecno Gadget" style={{ width: 120, height: 40, borderRadius: "6px", marginBottom: "1.5rem", display: "block", margin: "0 auto 1.5rem" }} />
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 0.25rem" }}>Panel de Control</h1>
        <p style={{ color: "#6e6e73", fontSize: "0.9rem", margin: "0 0 2rem" }}>Tecno Gadget SV</p>

        <div style={{ background: "#fff", borderRadius: "18px", padding: "1.75rem" }}>
          {error && (
            <div style={{ background: "#fff2f2", borderRadius: "10px", padding: "0.7rem 1rem", color: "#ff3b30", fontSize: "0.85rem", marginBottom: "1.25rem", textAlign: "left" }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", marginBottom: "0.4rem" }}>USUARIO</label>
            <input value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="tu usuario" autoComplete="off"
              style={{ width: "100%", background: "#f5f5f7", border: "none", borderRadius: "10px", padding: "0.75rem 1rem", color: "#1d1d1f", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6e6e73", marginBottom: "0.4rem" }}>CONTRASEÑA</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", background: "#f5f5f7", border: "none", borderRadius: "10px", padding: "0.75rem 1rem", color: "#1d1d1f", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
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
function Navbar({ user, onLogout, activeTab, setActiveTab }) {
  const [showMenu, setShowMenu] = useState(false);
  const tabs = user.rol === "admin"
    ? [{ id: "ordenes", label: "Órdenes" }, { id: "estadisticas", label: "Estadísticas" }, { id: "vendedores", label: "Vendedores" }]
    : [{ id: "mis-ordenes", label: "Mis Órdenes" }, { id: "mis-stats", label: "Mis Stats" }];

  return (
    <div style={{
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      position: "sticky", top: 0, zIndex: 100,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", height: 52, gap: "2rem" }}>
        <img src={LOGO_URL} alt="Tecno Gadget" style={{ width: 120, borderRadius: "6px" }} />

        <div style={{ display: "flex", gap: "0.25rem", flex: 1 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "0.4rem 0.85rem",
              background: activeTab === tab.id ? "rgba(0,122,255,0.1)" : "transparent",
              color: activeTab === tab.id ? "#007AFF" : "#6e6e73",
              border: "none", borderRadius: "8px",
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: "0.88rem", cursor: "pointer",
              transition: "all 0.15s",
            }}>{tab.label}</button>
          ))}
        </div>

         <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
  <Search size={14} color="#6e6e73" style={{ position: "absolute", left: 10, pointerEvents: "none" }} />
  <input
    placeholder="Buscar ficha o vendedor..."
    style={{
      padding: "0.4rem 0.85rem 0.4rem 2rem",
      border: "1px solid #e5e5ea",
      borderRadius: "20px",
      fontSize: "0.82rem",
      background: "#f5f5f7",
      outline: "none",
      fontFamily: "'Inter', sans-serif",
      width: 220,
      color: "#1d1d1f",
    }}
  />
</div>

        <div style={{ position: "relative" }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "transparent", border: "none", cursor: "pointer",
            color: "#1d1d1f", fontSize: "0.85rem", fontWeight: 500,
            padding: "0.4rem 0.75rem", borderRadius: "8px",
            background: showMenu ? "rgba(0,0,0,0.05)" : "transparent",
          }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#007AFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.78rem", fontWeight: 700 }}>
              {user.nombre.charAt(0)}
            </div>
            <span>{user.nombre.split(" ")[0]}</span>
            <span style={{ fontSize: "0.7rem", color: "#6e6e73" }}>▾</span>
          </button>

          {showMenu && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "#fff", borderRadius: "12px",
              minWidth: 180, zIndex: 200,
            }}>
              <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #f5f5f7", marginBottom: "0.25rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1d1d1f" }}>{user.nombre}</div>
                <div style={{ fontSize: "0.72rem", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.05em" }}>{user.rol}</div>
              </div>
              <button onClick={onLogout} style={{
                width: "100%", textAlign: "left", padding: "0.6rem 0.75rem",
                background: "transparent", border: "none", borderRadius: "8px",
                color: "#ff3b30", fontSize: "0.85rem", cursor: "pointer",
                fontWeight: 500,
              }}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </div>
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

// ══ TablaOrdenes ══════════════════════════════════════════
function TablaOrdenes({ ordenes, tipo, onUpdateEnvio, esAdmin }) {
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

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #f5f5f7" }}>
            {["Ficha", "Fecha", "Cliente", "Artículos", tipo === "departamental" ? "Depto" : "Municipio", "Total", "Envío", "Neto", "Perfil", "Vendedor"].map(h => (
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
              <tr key={o.id} style={{ borderBottom: "1px solid #f5f5f7" }}>
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
  type="number"
  step="0.01"
  min="0"
  value={envios[o.id] || 0}
  onChange={e => handleEnvioChange(o.id, e.target.value)}
  onFocus={e => e.target.style.border = "1.5px solid #007AFF"}
  onBlur={e => {
    e.target.style.border = "1.5px solid #e5e5ea";
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
    transition: "border 0.15s",
  }}
/>
                  ) : (
                    <span style={{ color: "#ff3b30", fontSize: "0.82rem" }}>-${(envios[o.id] || 0).toFixed(2)}</span>
                  )}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#34C759" }}>{formatMoney(neto)}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>{o.perfil_salio_1 || o.perfil_salio || "-"}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#6e6e73" }}>{o.quien_ingresa}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
          ? <TablaOrdenes ordenes={lF} tipo="local" onUpdateEnvio={actualizarEnvio} esAdmin={true} />
          : <TablaOrdenes ordenes={dF} tipo="departamental" esAdmin={true} />}
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
    if (v.includes("TecnoGadget")) return; // Excluir órdenes de TecnoGadget
    if (v.includes("Caleb (Venta Propia)")) return; // Excluir órdenes de Caleb
    if (!porVendedor[v]) porVendedor[v] = { vendedor: v, ordenes: 0, total: 0 };
    porVendedor[v].ordenes++;
    porVendedor[v].total += parseMonto(o.total_pagar) - (o.costo_envio || 0);
  });
  deptos.forEach(o => {
    const v = o.quien_ingresa || "Sin asignar";
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
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(fechaHoy());
  const [tab, setTab] = useState("locales");

  useEffect(() => { cargarMisOrdenes(); }, [filtroFecha]);

  async function cargarMisOrdenes() {
    setLoading(true);
    const [resL, resD] = await Promise.all([
      fetch(SUPABASE_URL + "/rest/v1/ordenes_locales?fecha_orden=eq." + filtroFecha + "&quien_ingresa=eq." + encodeURIComponent(user.nombre) + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
      fetch(SUPABASE_URL + "/rest/v1/ordenes_departamentales?fecha_orden=eq." + filtroFecha + "&quien_ingresa=eq." + encodeURIComponent(user.nombre) + "&order=creado_en.desc", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }),
    ]);
    setLocales(await resL.json());
    setDeptos(await resD.json());
    setLoading(false);
  }

  const totalL = locales.reduce((s, o) => s + parseMonto(o.total_pagar) - (o.costo_envio || 0), 0);
  const totalD = deptos.reduce((s, o) => s + parseMonto(o.total_pagar) - ENVIO_DEPTO, 0);
  const totalGeneral = totalL + totalD;

  const tabStyle = (active) => ({
    padding: "0.45rem 1rem", borderRadius: "8px", border: "none",
    background: active ? "#007AFF" : "transparent",
    color: active ? "#fff" : "#6e6e73",
    fontWeight: active ? 600 : 400, fontSize: "0.85rem", cursor: "pointer",
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>Mis Órdenes</h2>
        <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}
          style={{ padding: "0.5rem 0.85rem", border: "1px solid #e5e5ea", borderRadius: "10px", fontSize: "0.85rem", background: "#fff", outline: "none" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Mis Locales" value={formatMoney(totalL)} sub={locales.length + " órdenes"} />
        <StatCard label="Mis Deptos" value={formatMoney(totalD)} sub={deptos.length + " órdenes"} />
        <StatCard label="Mi Total" value={formatMoney(totalGeneral)} accent="#007AFF" />
        <StatCard label="Mi Comisión" value={formatMoney(totalGeneral * COMISION)} accent="#34C759" />
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "0.25rem", padding: "0.75rem 1rem", borderBottom: "1px solid #f5f5f7" }}>
          <button onClick={() => setTab("locales")} style={tabStyle(tab === "locales")}>Locales ({locales.length})</button>
          <button onClick={() => setTab("departamentales")} style={tabStyle(tab === "departamentales")}>Departamentales ({deptos.length})</button>
        </div>
        {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "#6e6e73" }}>Cargando...</div>
          : tab === "locales"
          ? <TablaOrdenes ordenes={locales} tipo="local" esAdmin={false} />
          : <TablaOrdenes ordenes={deptos} tipo="departamental" esAdmin={false} />}
      </div>
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
    setActiveTab(u.rol === "admin" ? "ordenes" : "mis-ordenes");
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("panel_user");
  }

  useEffect(() => {
    if (user) setActiveTab(user.rol === "admin" ? "ordenes" : "mis-ordenes");
  }, []);

  if (!user) return <Login onLogin={handleLogin} />;

  function renderContent() {
    if (user.rol === "admin") {
      if (activeTab === "ordenes") return <AdminOrdenes />;
      if (activeTab === "estadisticas") return <AdminEstadisticas />;
      if (activeTab === "vendedores") return <AdminVendedores />;
    } else {
      return <VendedorPanel user={user} />;
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}
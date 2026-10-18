"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  createdAt: string;
};

type FormData = { nombre: string; precio: string; stock: string };

// El valor por defecto permite que el sitio estático publicado siempre use la API pública.
// Para desarrollo local puede sobrescribirse con NEXT_PUBLIC_API_URL=http://localhost:3000.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://backendupbtest-6d55.onrender.com").replace(/\/$/, "");
const emptyForm: FormData = { nombre: "", precio: "", stock: "" };

const money = new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB", minimumFractionDigits: 2 });

function Icon({ name }: { name: "box" | "plus" | "refresh" | "edit" | "trash" | "search" | "close" }) {
  const paths = {
    box: <><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="m3 7 9 4 9-4M3 7v10l9 4 9-4V7M12 11v10" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    refresh: <><path d="M20 11a8 8 0 1 0 2 5.5" /><path d="M20 4v7h-7" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 11v6m4-6v6" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Producto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/productos`, { cache: "no-store" });
      if (!response.ok) throw new Error("No fue posible cargar el inventario.");
      const data = await response.json() as Producto[];
      setProductos(data);
      setOnline(true);
    } catch {
      setOnline(false);
      setMessage("No se pudo conectar con la API. Revisa que el backend esté publicado y activo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const task = window.setTimeout(() => { void loadProducts(); }, 0);
    return () => window.clearTimeout(task);
  }, [loadProducts]);

  const visibleProducts = useMemo(() => productos.filter((product) =>
    product.nombre.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [productos, query]);
  const totalValue = useMemo(() => productos.reduce((sum, product) => sum + product.precio * product.stock, 0), [productos]);
  const totalUnits = useMemo(() => productos.reduce((sum, product) => sum + product.stock, 0), [productos]);

  function openCreate() { setEditing(null); setForm(emptyForm); setMessage(""); setIsModalOpen(true); }
  function openEdit(product: Producto) {
    setEditing(product);
    setForm({ nombre: product.nombre, precio: String(product.precio), stock: String(product.stock) });
    setMessage("");
    setIsModalOpen(true);
  }
  function closeModal() { setEditing(null); setForm(emptyForm); setIsModalOpen(false); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = { nombre: form.nombre, precio: Number(form.precio), stock: Number(form.stock) };
    try {
      const response = await fetch(editing ? `${API_URL}/api/productos/${editing.id}` : `${API_URL}/api/productos`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null) as Producto | { error?: string } | null;
      if (!response.ok) throw new Error(data && "error" in data ? data.error : "No se pudo guardar el producto.");
      closeModal();
      setMessage(editing ? "Producto actualizado correctamente." : "Producto creado correctamente.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    } finally { setSaving(false); }
  }

  async function remove(product: Producto) {
    if (!window.confirm(`¿Eliminar “${product.nombre}” del inventario?`)) return;
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/productos/${product.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el producto.");
      setMessage("Producto eliminado correctamente.");
      await loadProducts();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado."); }
  }

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>NODO<span className="accent">.</span></span></div>
        <div className="workspace-label">ESPACIO DE TRABAJO</div>
        <div className="workspace"><span className="workspace-avatar">C</span><span><b>Casa Central</b><small>Inventario general</small></span></div>
        <nav aria-label="Navegación principal"><a className="nav-item active" href="#inventario"><Icon name="box" /> Inventario</a></nav>
        <div className="sidebar-footer"><span className={`status-dot ${online ? "live" : ""}`} /> {online ? "API conectada" : "Verificando API"}</div>
      </aside>

      <section className="content" id="inventario">
        <header className="topbar"><div><p className="eyebrow">OPERACIONES / INVENTARIO</p><h1>Control de inventario</h1></div><button className="primary-button" onClick={openCreate}><Icon name="plus" /> Nuevo producto</button></header>

        <section className="metrics" aria-label="Resumen de inventario">
          <article><span>REFERENCIAS ACTIVAS</span><strong>{productos.length}</strong><small>Productos registrados</small></article>
          <article><span>UNIDADES DISPONIBLES</span><strong>{totalUnits}</strong><small>Stock total actual</small></article>
          <article><span>VALOR DE INVENTARIO</span><strong>{money.format(totalValue)}</strong><small>Calculado en tiempo real</small></article>
        </section>

        <section className="inventory-card">
          <div className="card-header"><div><h2>Productos</h2><p>Administra existencias, precios y referencias de tu catálogo.</p></div><button className="icon-button" onClick={() => void loadProducts()} aria-label="Actualizar inventario" title="Actualizar"><Icon name="refresh" /></button></div>
          <div className="toolbar"><label className="search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre…" /></label><span>{visibleProducts.length} {visibleProducts.length === 1 ? "resultado" : "resultados"}</span></div>
          {message && <div className={`notice ${online === false ? "notice-error" : ""}`}>{message}</div>}
          <div className="table-wrap"><table><thead><tr><th>PRODUCTO</th><th>PRECIO UNIT.</th><th>STOCK</th><th>VALOR TOTAL</th><th aria-label="Acciones" /></tr></thead><tbody>
            {loading ? <tr><td colSpan={5} className="empty">Actualizando inventario…</td></tr> : visibleProducts.length === 0 ? <tr><td colSpan={5} className="empty">{online === false ? "La API no está disponible en este momento." : "No encontramos productos con esa búsqueda."}</td></tr> : visibleProducts.map((product) => <tr key={product.id}><td><div className="product-name"><span className="product-icon"><Icon name="box" /></span><span><b>{product.nombre}</b><small>REF-{String(product.id).padStart(4, "0")}</small></span></div></td><td>{money.format(product.precio)}</td><td><span className={`stock ${product.stock === 0 ? "out" : product.stock < 5 ? "low" : ""}`}>{product.stock} un.</span></td><td><b>{money.format(product.precio * product.stock)}</b></td><td><div className="actions"><button onClick={() => openEdit(product)} aria-label={`Editar ${product.nombre}`}><Icon name="edit" /></button><button className="delete" onClick={() => void remove(product)} aria-label={`Eliminar ${product.nombre}`}><Icon name="trash" /></button></div></td></tr>)}</tbody></table></div>
        </section>
        <footer>Datos sincronizados desde API REST · <code>{API_URL}</code></footer>
      </section>

      {isModalOpen && <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={closeModal} aria-label="Cerrar"><Icon name="close" /></button><p className="eyebrow">{editing ? "EDITAR REFERENCIA" : "NUEVA REFERENCIA"}</p><h2 id="modal-title">{editing ? "Actualizar producto" : "Registrar producto"}</h2><p className="modal-copy">Completa la información para mantener tu inventario actualizado.</p><form onSubmit={(event) => void submit(event)}><label>Nombre del producto<input required maxLength={100} value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Ej. Teclado mecánico" /></label><div className="form-grid"><label>Precio unitario<input required min="0" step="0.01" type="number" value={form.precio} onChange={(event) => setForm({ ...form, precio: event.target.value })} placeholder="0.00" /></label><label>Stock inicial<input required min="0" step="1" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="0" /></label></div><button className="primary-button modal-submit" disabled={saving} type="submit">{saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear producto"}</button></form></section></div>}
    </main>
  );
}

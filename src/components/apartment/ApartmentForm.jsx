import React, { useEffect, useMemo, useRef, useState } from "react";
import { Save, Search, Loader2, ChevronDown, X } from "lucide-react";
import api from "../../services/authService";
import { authConfig } from "../../redux/actions/helpers";

/** Headless async select (Tailwind) */
function AsyncSearchSelect({
  label,
  placeholder = "Escribe para buscar...",
  value,
  onChange,
  fetchUrl,
  fetchOneUrl,
  getOptionLabel,
  getOptionValue,
  required = false,
  disabled = false,
  allowClear = true,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  // Prefill when editing
  useEffect(() => {
    let ignore = false;

    const normalize = async () => {
      if (!value) { setSelected(null); return; }

      if (typeof value === "object") {
        const id = getOptionValue(value);
        setSelected(value);
        return;
      }

      try {
        setBusy(true);
        const url = typeof fetchOneUrl === "function" ? fetchOneUrl(value) : `${fetchUrl}/${value}`;
        const res = await api.get(url, authConfig());
        if (!ignore && res?.data?.body) setSelected(res.data.body);
      } catch {
        if (!ignore) setSelected(null);
      } finally {
        if (!ignore) setBusy(false);
      }
    };

    normalize();
    return () => { ignore = true; };
  }, [value]);


  // Debounced search
  useEffect(() => {
    if (!open) return;
    let ignore = false;
    const t = setTimeout(async () => {
      try {
        setBusy(true);
        const params = new URLSearchParams({ page: 1, limit: 10 });
        if (query) params.append("search", query);
        const res = await api.get(`${fetchUrl}?${params.toString()}`, authConfig());
        const data = res?.data?.body?.items || res?.data?.body || [];
        if (!ignore) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setItems([]);
      } finally {
        if (!ignore) setBusy(false);
      }
    }, 300);
    return () => { clearTimeout(t); ignore = true; };
  }, [query, open, fetchUrl]);

  useEffect(() => {
    const onClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayText = useMemo(
    () => (selected ? getOptionLabel(selected) : ""),
    [selected, getOptionLabel]
  );

  const choose = (item) => {
    const id = getOptionValue(item);
    setSelected(item);
    onChange?.(id, item);
    setOpen(false);
  };

  const clearSelection = () => {
    setSelected(null);
    onChange?.("", null);
  };

  return (
    <div ref={containerRef} className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`relative border rounded-md px-3 py-2 flex items-center gap-2 ${disabled ? "bg-gray-50 opacity-70" : "bg-white"} focus-within:ring-2 focus-within:ring-cyan-500`}
      >
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={open ? query : displayText}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setOpen(true); setQuery(""); }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-6 outline-none text-sm bg-transparent"
        />
        {busy && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        {allowClear && !!selected && !disabled && (
          <button
            type="button"
            onClick={clearSelection}
            className="p-1 rounded hover:bg-gray-100"
            title="Limpiar"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-1 rounded hover:bg-gray-100"
          disabled={disabled}
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border bg-white shadow-lg">
            {items.length === 0 && !busy ? (
              <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
            ) : (
              <ul className="max-h-60 overflow-auto py-1">
                {items.map((it) => {
                  const id = getOptionValue(it);
                  const label = getOptionLabel(it);
                  const isActive = selected && getOptionValue(selected) === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${isActive ? "bg-cyan-50" : ""}`}
                        onClick={() => choose(it)}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      {required && (
        <input
          tabIndex={-1}
          className="hidden"
          value={selected ? getOptionValue(selected) : ""}
          onChange={() => { }}
          required
        />
      )}
    </div>
  );
}

const asStringId = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    if (typeof v._id === "string") return v._id;
    if (v._id && typeof v._id.$oid === "string") return v._id.$oid;
    if (typeof v.id === "string") return v.id;
  }
  return "";
};


/**
 * ApartmentForm — solo el FORM (sin encabezados ni layout)
 * Campos: number (required), tower (required, select async), user (optional, select async)
 */
function ApartmentForm({ initialData, onSubmit, isLoading = false, mode = "create" }) {
  const [formData, setFormData] = useState({
    number: initialData?.number ?? 1,
    tower: initialData?.tower || "",
    user: initialData?.user || "",
  });
  useEffect(() => {
    setFormData({
      number: initialData?.number ?? 1,
      tower: initialData?.tower || "",
      user: initialData?.user || "",
    });
  }, [initialData?.number, initialData?.tower, initialData?.user]);

  const handle = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit({
      number: Math.max(1, parseInt(formData.number || "1", 10)),
      tower: asStringId(formData.tower).trim(),
      user: asStringId(formData.user) || undefined,
    });
  };


  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Torre (required) */}
        <AsyncSearchSelect
          label="Torre *"
          placeholder="Buscar torre por código..."
          value={formData.tower}
          onChange={(id) => handle("tower", id)}
          fetchUrl="/towers"
          fetchOneUrl={(id) => `/towers/${id}`}
          getOptionLabel={(it) => `${it.code} · ${it.floors} pisos`}
          getOptionValue={(it) => it._id || it.id}
          required
        />

        {/* Número */}
        <div className="space-y-2">
          <label htmlFor="number" className="text-sm font-medium">
            Número de Apartamento *
          </label>
          <input
            id="number"
            type="number"
            min="1"
            value={formData.number}
            onChange={(e) => handle("number", e.target.value)}
            placeholder="Ej: 101"
            required
            className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p className="text-xs text-gray-500">
            Debe ser único dentro de la torre seleccionada.
          </p>
        </div>

        {/* Persona (opcional) */}
        <AsyncSearchSelect
          label="Persona (opcional)"
          placeholder="Buscar por nombre, apellido, email..."
          value={formData.user}
          onChange={(id) => handle("user", id)}
          fetchUrl="/persons"
          fetchOneUrl={(id) => `/persons/${id}`}
          getOptionLabel={(it) =>
            `${it.firstName || ""} ${it.lastName || ""}`.trim() || it.email
          }
          getOptionValue={(it) => it._id || it.id}
          required={false}
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isLoading
            ? mode === "create"
              ? "Creando..."
              : "Guardando..."
            : mode === "create"
              ? "Crear Apartamento"
              : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}

export default ApartmentForm;

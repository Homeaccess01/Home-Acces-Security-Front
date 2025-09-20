import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";

const ID_TYPES = ["CC", "CE", "TI", "PASSPORT", "NIT", "OTHER"];

function PersonForm({ initialData, onSubmit, isLoading = false, mode = "create" }) {
    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || "",
        lastName: initialData?.lastName || "",
        phone: initialData?.phone || "",
        birthDate: initialData?.birthDate ? new Date(initialData.birthDate).toISOString().slice(0, 10) : "",
        idType: initialData?.idType || "CC",
        idNumber: initialData?.idNumber || "",
        // ---- Auth ----
        email: initialData?.email || "",
        password: "",
        // ---- Household ----
        children: initialData?.children || "",
        childrenCount: initialData?.childrenCount || "",
        pets: initialData?.pets || "",
        petType: initialData?.petType || "",
        // ---- Relations (comentado por ahora) ----
        // apartment: initialData?.apartment || "",
        // vehicle: initialData?.vehicle || "",
        // pet: initialData?.pet || "",
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            phone: initialData?.phone || "",
            birthDate: initialData?.birthDate ? new Date(initialData.birthDate).toISOString().slice(0, 10) : "",
            idType: initialData?.idType || "CC",
            idNumber: initialData?.idNumber || "",
            email: initialData?.email || "",
            // password se mantiene como esté escrito por el usuario
            children: initialData?.children || "",
            childrenCount: initialData?.childrenCount || "",
            pets: initialData?.pets || "",
            petType: initialData?.petType || "",
            // apartment: initialData?.apartment || "",
            // vehicle: initialData?.vehicle || "",
            // pet: initialData?.pet || "",
        }));
    }, [
        initialData?.firstName,
        initialData?.lastName,
        initialData?.phone,
        initialData?.birthDate,
        initialData?.idType,
        initialData?.idNumber,
        initialData?.email,
        initialData?.children,
        initialData?.childrenCount,
        initialData?.pets,
        initialData?.petType,
        // initialData?.apartment,
        // initialData?.vehicle,
        // initialData?.pet,
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName: (formData.firstName || "").trim(),
            lastName: (formData.lastName || "").trim(),
            phone: (formData.phone || "").trim(),
            birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
            idType: formData.idType || "CC",
            idNumber: (formData.idNumber || "").trim(),
            email: (formData.email || "").trim(),
            // password: solo en create o si el usuario lo llenó en edit
            children: (formData.children || "").trim(),
            childrenCount: (formData.childrenCount || "").trim(),
            pets: (formData.pets || "").trim(),
            petType: (formData.petType || "").trim(),
            estado: "activo",
            // Relations comentadas:
            // apartment: formData.apartment || undefined,
            // vehicle: formData.vehicle || undefined,
            // pet: formData.pet || undefined,
        };

        if (mode === "create") {
            payload.password = (formData.password || "").trim(); // requerido en create
        } else if (formData.password && formData.password.trim()) {
            payload.password = formData.password.trim(); // opcional en edit
        }

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identidad */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium mb-1">Nombre *</label>
                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ej: Juan"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Apellido *</label>
                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ej: Pérez"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ej: 3001234567"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
            </div>

            {/* Identificación */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium mb-1">Tipo de documento</label>
                    <select
                        name="idType"
                        value={formData.idType}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        {ID_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Número de documento</label>
                    <input
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ej: 1234567890"
                    />
                </div>
            </div>

            {/* Credenciales de usuario */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium mb-1">Correo electrónico *</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ej: usuario@correo.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        {mode === "create" ? "Contraseña *" : "Contraseña (opcional)"}
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder={mode === "create" ? "Mín. 8 caracteres" : "Dejar vacío para no cambiar"}
                        {...(mode === "create" ? { required: true } : {})}
                    />
                </div>
            </div>

            {/* Hogar / familia */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium mb-1">Hijos</label>
                    <input
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Sí/No/Detalle"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Cantidad de hijos</label>
                    <input
                        name="childrenCount"
                        value={formData.childrenCount}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ej: 2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mascotas</label>
                    <input
                        name="pets"
                        value={formData.pets}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Sí/No/Detalle"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tipo de mascota</label>
                    <input
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Perro, Gato, etc."
                    />
                </div>
            </div>

            {/* Relaciones (comentadas por ahora) */}
            {/*
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-1">Apartamento (ID)</label>
          <input
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="ObjectId de Apartment"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vehículo (ID)</label>
          <input
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="ObjectId de Vehicle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mascota (ID)</label>
          <input
            name="pet"
            value={formData.pet}
            onChange={handleChange}
            className="w-full h-11 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="ObjectId de Pet"
          />
        </div>
      </div>
      */}

            {/* Acciones */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                    <Save className="h-4 w-4" />
                    {isLoading
                        ? (mode === "create" ? "Creando..." : "Guardando...")
                        : (mode === "create" ? "Crear Persona" : "Guardar Cambios")}
                </button>
            </div>
        </form>
    );
}

export default PersonForm;

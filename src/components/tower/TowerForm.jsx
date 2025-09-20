import React, { useEffect, useState } from "react";

function TowerForm({
    onSubmit,
    isLoading,
    mode = "create",
    initialData, // { code, floors, state } opcional
}) {
    const [formData, setFormData] = useState(() => ({
        code: initialData?.code || "",
        floors: Number(initialData?.floors) || 1,
        state: initialData?.state || "active",
    }));

    useEffect(() => {
        const next = {
            code: initialData?.code || "",
            floors: Number(initialData?.floors) || 1,
            state: initialData?.state || "active",
        };

        setFormData((prev) => {
            const same =
                prev.code === next.code &&
                prev.floors === next.floors &&
                prev.state === next.state;
            return same ? prev : next;
        });
    }, [initialData?.code, initialData?.floors, initialData?.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "floors" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            code: (formData.code || "").toUpperCase().trim(),
            floors: Number(formData.floors) || 1,
            state: formData.state || "active",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Código */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Código de la torre
                </label>
                <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    placeholder="Ej: T-A o 101"
                />
            </div>

            {/* Pisos */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Número de pisos
                </label>
                <input
                    type="number"
                    name="floors"
                    value={formData.floors}
                    onChange={handleChange}
                    min="1"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    placeholder="Ej: 12"
                />
            </div>

            {/* Estado */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Estado
                </label>
                <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="maintenance">Mantenimiento</option>
                </select>
            </div>

            {/* Botón */}
            <div className="flex justify-end gap-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading
                        ? "Guardando..."
                        : mode === "create"
                            ? "Crear Torre"
                            : "Guardar Cambios"}
                </button>
            </div>
        </form>
    );
}

export default TowerForm;

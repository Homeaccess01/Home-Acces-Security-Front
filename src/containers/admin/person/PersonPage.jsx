import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

import {
    fetchPersons as fetchPersonsAction,
    deletePerson as deletePersonAction,
} from "../../../redux/actions/person";
import { SET_MODAL_MESSAGE } from "../../../redux/reducers/messages";
import Layout from "../../../hocs/Layout";

/** Modal de confirmación (Tailwind) */
function ConfirmModal({
    open,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onClose,
    busy,
}) {
    if (!open) return null;
    return (
        <Layout>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/30" onClick={onClose} />
                <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
                    <div className="border-b px-5 py-4">
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <div className="px-5 py-4 text-sm text-gray-700">{description}</div>
                    <div className="flex justify-end gap-2 border-t px-5 py-3">
                        <button
                            type="button"
                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                            onClick={onClose}
                            disabled={busy}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                            onClick={onConfirm}
                            disabled={busy}
                        >
                            {busy ? "Eliminando..." : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function PersonsPage({
    loading,
    persons,
    fetchPersons,
    deletePerson,
    showToast,
}) {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, person: null });

    // Load data on mount
    useEffect(() => {
        fetchPersons({ page: 1, limit: 100 });
    }, [fetchPersons]);

    // Local filter (variables en inglés, UI en español)
    const filteredPersons = useMemo(() => {
        const q = (searchTerm || "").toLowerCase();
        if (!q) return persons;
        return persons.filter((p) => {
            const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
            const idNumber = String(p.idNumber || "");
            const email = String(p.email || "").toLowerCase();
            const phone = String(p.phone || "").toLowerCase();
            return (
                fullName.includes(q) ||
                idNumber.includes(q) ||
                email.includes(q) ||
                phone.includes(q)
            );
        });
    }, [persons, searchTerm]);

    const onDelete = async () => {
        if (!deleteDialog.person) return;
        try {
            setIsDeleting(true);
            await deletePerson(deleteDialog.person._id || deleteDialog.person.id);
            showToast({
                message: "Persona eliminada.",
                type_message: "success",
                time: 3000,
            });
            setDeleteDialog({ open: false, person: null });
        } catch (err) {
            console.error("Error deleting person:", err);
            showToast({
                message: "Error eliminando la persona.",
                type_message: "error",
                time: 3000,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (s) => {
        if (!s) return "";
        try {
            return new Date(s).toLocaleDateString("es-ES");
        } catch {
            return s;
        }
    };

    return (
        <Layout>
            <div className="space-y-6 p-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
                        <p className="text-sm text-gray-600">Gestiona las personas registradas en el sistema</p>
                    </div>

                    <Link to="/dashboard/people/create">
                        <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                            Nueva Persona
                        </button>
                    </Link>
                </div>

                {/* Buscador + Total */}
                <div className="grid gap-6 md:grid-cols-4">
                    <div className="md:col-span-3 rounded-lg border bg-white">
                        <div className="p-4">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    placeholder="Buscar por nombre, apellido, cédula o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-md border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white">
                        <div className="border-b px-4 py-3">
                            <div className="text-xs font-medium text-gray-500">Total</div>
                        </div>
                        <div className="px-4 py-4">
                            <div className="text-2xl font-bold text-gray-900">{persons.length}</div>
                            <p className="text-xs text-gray-500">personas registradas</p>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="rounded-lg border bg-white">
                    <div className="border-b px-4 py-3">
                        <div className="text-base font-semibold">Lista de Personas</div>
                        <div className="text-sm text-gray-600">
                            {filteredPersons.length} de {persons.length} personas
                        </div>
                    </div>

                    <div className="p-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-10 text-gray-500">
                                Cargando personas...
                            </div>
                        ) : filteredPersons.length === 0 ? (
                            <div className="py-10 text-center text-gray-500">Sin resultados</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3">Nombre</th>
                                            <th className="px-4 py-3">Cédula</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Teléfono</th>
                                            <th className="px-4 py-3">Estado</th>
                                            <th className="px-4 py-3">Fecha creación</th>
                                            <th className="px-4 py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPersons.map((person) => {
                                            const id = person._id || person.id;
                                            return (
                                                <tr key={id} className="border-b last:border-0">
                                                    <td className="px-4 py-3 font-medium">
                                                        {person.firstName} {person.lastName}
                                                    </td>
                                                    <td className="px-4 py-3">{person.idNumber}</td>
                                                    <td className="px-4 py-3">{person.email}</td>
                                                    <td className="px-4 py-3">{person.phone}</td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={
                                                                "inline-flex rounded-full px-2 py-0.5 text-xs " +
                                                                ((person.state || "active") === "active"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-200 text-gray-800")
                                                            }
                                                        >
                                                            {(person.state || "active") === "active" ? "activo" : "inactivo"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{formatDate(person.createdAt)}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {/* <button
                                                            type="button"
                                                            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                                                            onClick={() => navigate(`/dashboard/person/${id}`)}
                                                            title="Ver"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button> */}
                                                            <button
                                                                type="button"
                                                                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                                                                onClick={() => navigate(`/dashboard/people/${id}/edit`)}
                                                                title="Editar"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="rounded-md p-2 text-red-600 hover:bg-red-50"
                                                                onClick={() => setDeleteDialog({ open: true, person })}
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Diálogo de eliminar */}
                <ConfirmModal
                    open={deleteDialog.open}
                    onClose={() => setDeleteDialog({ open: false, person: null })}
                    onConfirm={onDelete}
                    busy={isDeleting}
                    title="Eliminar Persona"
                    description={
                        <>
                            ¿Estás seguro de que deseas eliminar a{" "}
                            <b>
                                {deleteDialog.person ? `${deleteDialog.person.firstName} ${deleteDialog.person.lastName}` : ""}
                            </b>
                            ? Esta acción no se puede deshacer.
                        </>
                    }
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                />
            </div>
        </Layout>
    );
}

const mapStateToProps = (state) => ({
    loading: state.messages?.loading || false,
    persons: state.persons?.items || [],
});

const mapDispatchToProps = {
    fetchPersons: fetchPersonsAction,
    deletePerson: deletePersonAction,
    showToast: SET_MODAL_MESSAGE,
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonsPage);

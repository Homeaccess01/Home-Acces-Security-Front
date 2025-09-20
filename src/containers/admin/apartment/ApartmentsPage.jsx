import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Plus, Search, Eye, Edit, Trash2, Users } from "lucide-react";

import Layout from "../../../hocs/Layout";
import {
  fetchApartments as fetchApartmentsAction,
  deleteApartment as deleteApartmentAction,
} from "../../../redux/actions/apartment";

function ApartmentsPage({
  items,
  loading,
  error,
  fetchApartments,
  deleteApartment,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, apartment: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchApartments({});
  }, [fetchApartments]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items || [];
    return (items || []).filter((a) => {
      const number = String(a.number ?? "").toLowerCase();
      const towerCode = (a.tower?.code ?? "").toLowerCase();
      const userName =
        `${a.user?.firstName ?? ""} ${a.user?.lastName ?? ""}`.trim().toLowerCase();
      const userEmail = (a.user?.email ?? "").toLowerCase();
      return (
        number.includes(term) ||
        towerCode.includes(term) ||
        userName.includes(term) ||
        userEmail.includes(term)
      );
    });
  }, [items, searchTerm]);

  // Stats
  const total = items?.length || 0;
  const occupied = (items || []).filter((a) => !!a.user).length;

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleDateString("es-ES");
    } catch {
      return value || "-";
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.apartment) return;
    try {
      setIsDeleting(true);
      await deleteApartment(deleteDialog.apartment._id || deleteDialog.apartment.id);
      setDeleteDialog({ open: false, apartment: null });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Departamentos</h1>
            <p className="text-muted-foreground">
              Gestiona los departamentos (apartments) del complejo residencial
            </p>
          </div>
          <Link to="/dashboard/apartments/create">
            <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" />
              Nuevo Departamento
            </button>
          </Link>
        </div>

        {/* Search & Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Search box */}
          <div className="md:col-span-2 rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                placeholder="Buscar por número, torre o residente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Total */}
          <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
            <div className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{total}</div>
              <p className="text-xs text-muted-foreground">departamentos</p>
            </div>
          </div>

          {/* Ocupados */}
          <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
            <div className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Ocupados</h3>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{occupied}</div>
              <p className="text-xs text-muted-foreground">con residente asignado</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
          <div className="p-5 border-b">
            <h3 className="text-lg font-semibold">Lista de Departamentos</h3>
            <p className="text-sm text-muted-foreground">
              {filtered.length} de {total} departamentos
            </p>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Cargando departamentos...</div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 px-3">Departamento</th>
                      <th className="py-2 px-3">Torre</th>
                      <th className="py-2 px-3">Residente</th>
                      <th className="py-2 px-3">Correo</th>
                      <th className="py-2 px-3">Fecha Creación</th>
                      <th className="py-2 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a._id || a.id} className="border-t">
                        <td className="py-2 px-3 font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            {/* número de apartamento */}
                            {a.number ?? "-"}
                          </div>
                        </td>
                        <td className="py-2 px-3">{a.tower?.code ?? "-"}</td>
                        <td className="py-2 px-3">
                          {(a.user?.firstName || a.user?.lastName)
                            ? `${a.user?.firstName ?? ""} ${a.user?.lastName ?? ""}`.trim()
                            : "—"}
                        </td>
                        <td className="py-2 px-3">{a.user?.email ?? "—"}</td>
                        <td className="py-2 px-3">{formatDate(a.createdAt)}</td>
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 rounded hover:bg-gray-100"
                              onClick={() =>
                                navigate(`/dashboard/apartments/${a._id || a.id}`)
                              }
                              title="Ver"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 rounded hover:bg-gray-100"
                              onClick={() =>
                                navigate(`/dashboard/apartments/${a._id || a.id}/edit`)
                              }
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 rounded hover:bg-gray-100"
                              onClick={() => setDeleteDialog({ open: true, apartment: a })}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No hay departamentos para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Delete Dialog */}
        {deleteDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
              <div className="p-5 border-b">
                <h4 className="text-lg font-semibold">Eliminar Departamento</h4>
                <p className="text-sm text-gray-600">
                  ¿Estás seguro de que deseas eliminar el departamento{" "}
                  <span className="font-medium">
                    #{deleteDialog.apartment?.number}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="p-4 flex items-center justify-end gap-2">
                <button
                  className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => setDeleteDialog({ open: false, apartment: null })}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  items: state.apartments?.items || [],
  loading: state.apartments?.loading || false,
  error: state.apartments?.error || null,   
});

const mapDispatchToProps = {
  fetchApartments: fetchApartmentsAction,
  deleteApartment: deleteApartmentAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApartmentsPage);

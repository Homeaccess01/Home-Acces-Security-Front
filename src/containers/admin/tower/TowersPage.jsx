import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Plus, Search, Edit, Trash2, Eye, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
    getTowers as getTowersAction,
    deleteTower as deleteTowerAction,
} from "../../../redux/actions/tower";
import Layout from "../../../hocs/Layout";

function TowersPage({ towers, loading, error, getTowers, deleteTower }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialog, setDeleteDialog] = useState({ open: false, tower: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getTowers();
    }, [getTowers]);

    // Filtro: por código
    const filteredTowers = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return (towers || []).filter((t) => (t.code || "").toString().toLowerCase().includes(term));
    }, [towers, searchTerm]);

    // Stats
    const totalApartments = (towers || []).reduce(
        (sum, t) => sum + (Number(t.apartments) || 0),
        0
    );
    const activeTowers = (towers || []).filter(
        (t) => (t.state || "").toLowerCase() === "active"
    ).length;

    const formatDate = (value) => {
        const d = value || new Date().toISOString();
        try {
            return new Date(d).toLocaleDateString("es-ES");
        } catch {
            return d;
        }
    };

    const getStateBadgeClasses = (state) => {
        const v = (state || "").toLowerCase();
        if (v === "active") return "bg-blue-600/10 text-blue-700 border border-blue-200";
        if (v === "under_maintenance") return "bg-orange-600/10 text-orange-700 border border-orange-200";
        if (v === "inactive") return "bg-gray-600/10 text-gray-700 border border-gray-200";
        return "bg-gray-600/10 text-gray-700 border border-gray-200";
    };

    const handleConfirmDelete = async () => {
        if (!deleteDialog.tower) return;
        try {
            setIsDeleting(true);
            await deleteTower(deleteDialog.tower.id || deleteDialog.tower._id);
            setDeleteDialog({ open: false, tower: null });
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
                        <h1 className="text-2xl font-bold text-foreground">Torres</h1>
                        <p className="text-muted-foreground">Gestiona las torres del complejo residencial</p>
                    </div>
                    <Link to="/dashboard/towers/create">
                        <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
                            <Plus className="h-4 w-4" />
                            Nueva Torre
                        </button>
                    </Link>
                </div>

                {/* Search & Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="md:col-span-2 rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                placeholder="Buscar por código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
                        <div className="pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Torres</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{towers?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">torres registradas</p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
                        <div className="pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Torres Activas</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{activeTowers}</div>
                            <p className="text-xs text-muted-foreground">en operación</p>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
                        <div className="pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Apartamentos</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{totalApartments}</div>
                            <p className="text-xs text-muted-foreground">unidades habitacionales</p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
                        <div className="pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Promedio Pisos</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">
                                {towers?.length
                                    ? Math.round(
                                        (towers || []).reduce(
                                            (sum, t) => sum + (Number(t.floors || 0)),
                                            0
                                        ) / towers.length
                                    )
                                    : 0}
                            </div>
                            <p className="text-xs text-muted-foreground">pisos por torre</p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow p-4">
                        <div className="pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">En Mantenimiento</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">
                                {(towers || []).filter(
                                    (t) => (t.state || "").toLowerCase() === "under_maintenance"
                                ).length}
                            </div>
                            <p className="text-xs text-muted-foreground">torres en mantenimiento</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
                    <div className="p-5 border-b">
                        <h3 className="text-lg font-semibold">Lista de Torres</h3>
                        <p className="text-sm text-muted-foreground">
                            {filteredTowers.length} de {towers?.length || 0} torres
                        </p>
                    </div>

                    <div className="p-5">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-muted-foreground">Cargando torres...</div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 text-sm">{error}</div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500">
                                            <th className="py-2 px-3">Código</th>
                                            <th className="py-2 px-3">Pisos</th>
                                            <th className="py-2 px-3">Apartamentos</th>
                                            <th className="py-2 px-3">Estado</th>
                                            <th className="py-2 px-3">Fecha Creación</th>
                                            <th className="py-2 px-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTowers.map((t) => (
                                            <tr key={t.id || t._id} className="border-t">
                                                <td className="py-2 px-3 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-blue-500" />
                                                        {t.code}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3">{t.floors ?? "-"}</td>
                                                <td className="py-2 px-3">{t.apartments ?? "-"}</td>
                                                <td className="py-2 px-3">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs capitalize ${getStateBadgeClasses(
                                                            t.state
                                                        )}`}
                                                    >
                                                        {t.state || "—"}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3">{formatDate(t.createdAt)}</td>
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* <button
                                                            className="p-2 rounded hover:bg-gray-100"
                                                            onClick={() => navigate(`/dashboard/towers/${t.id || t._id}`)}
                                                            title="Ver"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button> */}
                                                        <button
                                                            className="p-2 rounded hover:bg-gray-100"
                                                            onClick={() => navigate(`/dashboard/towers/${t.id || t._id}/edit`)}
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="p-2 rounded hover:bg-gray-100"
                                                            onClick={() => setDeleteDialog({ open: true, tower: t })}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTowers.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                                    No hay torres para mostrar.
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
                                <h4 className="text-lg font-semibold">Eliminar Torre</h4>
                                <p className="text-sm text-gray-600">
                                    ¿Estás seguro de que deseas eliminar la torre "
                                    <span className="font-medium">{deleteDialog.tower?.code}</span>
                                    "? Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="p-4 flex items-center justify-end gap-2">
                                <button
                                    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                                    onClick={() => setDeleteDialog({ open: false, tower: null })}
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
    towers: state.towers?.items || [],
    loading: state.towers?.loading || false,
    error: state.towers?.error || null,
});

const mapDispatchToProps = {
    getTowers: getTowersAction,
    deleteTower: deleteTowerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(TowersPage);

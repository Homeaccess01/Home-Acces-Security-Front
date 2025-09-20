import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Layout from "../../../hocs/Layout.jsx";
import ApartmentForm from "../../../components/apartment/ApartmentForm.jsx";
import { SET_MODAL_MESSAGE } from "../../../redux/reducers/messages";

import {
    fetchApartmentById as fetchApartmentByIdAction,
    updateApartment as updateApartmentAction,
} from "../../../redux/actions/apartment";

function EditApartmentPage({
    apartments,
    loading,
    fetchApartmentById,
    updateApartment,
    dispatch,
}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [initialData, setInitialData] = useState(null);

    const apartmentFromStore = useMemo(
        () => (apartments || []).find((a) => (a._id || a.id) === id),
        [apartments, id]
    );

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                if (apartmentFromStore) {
                    if (!ignore) {
                        setInitialData({
                            number: apartmentFromStore.number ?? 1,
                            tower: apartmentFromStore.tower || "",
                            user: apartmentFromStore.user || "",
                        });
                    }
                    return;
                }
                const res = await fetchApartmentById(id);
                const data =
                    res?.data?.body || res || null;
                if (!ignore && data) {
                    setInitialData({
                        number: data.number ?? 1,
                        tower: data.tower || "",
                        user: data.user || "",
                    });
                }
            } catch (err) {
                dispatch(
                    SET_MODAL_MESSAGE({
                        message: "No se pudo cargar el departamento.",
                        type_message: "error",
                        time: 3000,
                    })
                );
            }
        };

        load();
        return () => {
            ignore = true;
        };
    }, [id, apartmentFromStore, fetchApartmentById, dispatch]);

    const handleSubmit = async (formValues) => {
        try {
            setIsSaving(true);
            const payload = {
                number: Math.max(1, Number(formValues.number) || 1),
                tower: (formValues.tower || "").trim(),
                user: formValues.user ? (formValues.user || "").trim() : undefined,
            };
            console.log("Payload to update:", payload);
            await updateApartment(id, payload);

            dispatch(
                SET_MODAL_MESSAGE({
                    message: "Departamento actualizado exitosamente",
                    type_message: "success",
                    time: 3000,
                })
            );

            navigate("/dashboard/departments");
        } catch (error) {
            console.error("Error updating apartment:", error);
            dispatch(
                SET_MODAL_MESSAGE({
                    message: "Error al actualizar el departamento",
                    type_message: "error",
                    time: 3000,
                })
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/departments">
                        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Editar Departamento</h1>
                        <p className="text-muted-foreground">
                            Modifica los datos del departamento seleccionado
                        </p>
                    </div>
                </div>

                <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
                    <div className="p-5 border-b">
                        <h2 className="text-lg font-semibold">Información del Departamento</h2>
                        <p className="text-sm text-muted-foreground">
                            Actualiza la torre, número y (opcional) la persona asignada
                        </p>
                    </div>

                    <div className="p-5">
                        {initialData ? (
                            <ApartmentForm
                                initialData={initialData}
                                onSubmit={handleSubmit}
                                isLoading={isSaving || loading}
                                mode="edit"
                            />
                        ) : (
                            <div className="text-sm text-gray-500">Cargando datos...</div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const mapStateToProps = (state) => ({
    apartments: state.apartments?.items || [],
    loading: state.messages?.loading || false,
});

const mapDispatchToProps = {
    fetchApartmentById: fetchApartmentByIdAction,
    updateApartment: updateApartmentAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditApartmentPage);

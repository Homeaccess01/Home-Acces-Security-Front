import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Layout from "../../../hocs/Layout";
import PersonForm from "../../../components/person/PersonForm";
import {
    fetchPersonById as fetchPersonByIdAction,
    updatePerson as updatePersonAction,
} from "../../../redux/actions/person";
import { SET_MODAL_MESSAGE } from "../../../redux/reducers/messages";

function EditPersonPage({
    loading,
    persons,           // state.persons.items
    personItem,        // state.persons.item (seleccionado por fetch)
    fetchPersonById,
    updatePerson,
    showToast,
}) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isSaving, setIsSaving] = useState(false);
    const [initialData, setInitialData] = useState(null);

    // Busca primero en la lista; si no, usa el item individual del slice
    const personFromStore = useMemo(() => {
        const fromList = (persons || []).find(p => (p._id || p.id) === id);
        return fromList || personItem || null;
    }, [persons, personItem, id]);

    // Carga si no está en store
    useEffect(() => {
        if (!personFromStore && id) {
            fetchPersonById(id);
        }
    }, [id, personFromStore, fetchPersonById]);

    // Sincroniza initialData cuando haya datos en store
    useEffect(() => {
        if (!personFromStore) return;
        setInitialData({
            firstName: personFromStore.firstName || "",
            lastName: personFromStore.lastName || "",
            phone: personFromStore.phone || "",
            birthDate: personFromStore.birthDate || personFromStore.birth_date || "",
            idType: personFromStore.idType || "CC",
            idNumber: personFromStore.idNumber || "",
            email: personFromStore.email || "",
            // password se escribe en el form (opcional en edición)
            children: personFromStore.children || "",
            childrenCount: personFromStore.childrenCount || "",
            pets: personFromStore.pets || "",
            petType: personFromStore.petType || "",
            // Relaciones comentadas en el form por ahora
            // apartment: personFromStore.apartment || "",
            // vehicle: personFromStore.vehicle || "",
            // pet: personFromStore.pet || "",
        });
    }, [personFromStore]);

    const handleSubmit = async (data) => {
        try {
            setIsSaving(true);
            await updatePerson(id, data);
            showToast({
                message: "Persona actualizada exitosamente",
                type_message: "success",
                time: 3000,
            });
            navigate("/dashboard/people");
        } catch (error) {
            console.error("Error updating person:", error);
            showToast({
                message: "Error al actualizar la persona",
                type_message: "error",
                time: 3000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard/people">
                        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Editar Persona</h1>
                        <p className="text-sm text-gray-600">Modifica los datos de la persona seleccionada</p>
                    </div>
                </div>

                <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
                    <div className="p-5 border-b">
                        <h2 className="text-lg font-semibold">Información de la Persona</h2>
                        <p className="text-sm text-gray-600">Actualiza los campos necesarios y guarda los cambios</p>
                    </div>
                    <div className="p-5">
                        {initialData ? (
                            <PersonForm
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
    loading: state.messages?.loading || false,
    persons: state.persons?.items || [],
    personItem: state.persons?.item || null,
});

const mapDispatchToProps = {
    fetchPersonById: fetchPersonByIdAction,
    updatePerson: updatePersonAction,
    showToast: SET_MODAL_MESSAGE,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPersonPage);

import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PersonForm from "../../../components/person/PersonForm";
import { createPerson as createPersonAction } from "../../../redux/actions/person";
import { SET_MODAL_MESSAGE } from "../../../redux/reducers/messages";
import Layout from "../../../hocs/Layout";

function CreatePersonPage({ loading, createPerson, showToast }) {
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            setIsSaving(true);
            await createPerson(data);
            showToast({
                message: "Persona creada exitosamente",
                type_message: "success",
                time: 3000,
            });
            navigate("/dashboard/people");
        } catch (error) {
            console.error("Error creating person:", error);
            showToast({
                message: "Error al crear la persona",
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
                    <Link to="/dashboard/personas">
                        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Crear Persona</h1>
                        <p className="text-sm text-gray-600">Registra una nueva persona en el sistema</p>
                    </div>
                </div>

                <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
                    <div className="p-5 border-b">
                        <h2 className="text-lg font-semibold">Información de la Persona</h2>
                        <p className="text-sm text-gray-600">Completa los datos requeridos</p>
                    </div>
                    <div className="p-5">
                        <PersonForm onSubmit={handleSubmit} isLoading={isSaving || loading} mode="create" />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const mapStateToProps = (state) => ({
    loading: state.messages?.loading || false,
});

const mapDispatchToProps = {
    createPerson: createPersonAction,
    showToast: SET_MODAL_MESSAGE,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePersonPage);

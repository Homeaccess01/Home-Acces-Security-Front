import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Layout from "../../../hocs/Layout.jsx";
import DepartmentForm from "../../../components/apartment/ApartmentForm.jsx";
import { SET_MODAL_MESSAGE } from "../../../redux/reducers/messages";

import { createApartment as createAparmentAction } from "../../../redux/actions/apartment";

function CreateApartmentPage({ createApartment, dispatch }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);

      // status en inglés (no mezclamos nombres internos); textos visibles siguen en español
      const payload = { ...data, status: "active" };

      await createApartment(payload);

      dispatch(
        SET_MODAL_MESSAGE({
          message: "Departamento creado exitosamente",
          type_message: "success",
          time: 3000,
        })
      );

      navigate("/dashboard/departments");
    } catch (error) {
      console.error("Error creating department:", error);
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Error al crear el departamento",
          type_message: "error",
          time: 3000,
        })
      );
    } finally {
      setIsLoading(false);
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
            <h1 className="text-2xl font-bold text-foreground">Crear Apartamento</h1>
            <p className="text-muted-foreground">
              Completa los datos para registrar un nuevo apartamento
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold">Información del apartamento</h2>
            <p className="text-sm text-muted-foreground">
              Datos básicos, responsable y recursos
            </p>
          </div>
          <div className="p-5">
            <DepartmentForm onSubmit={handleSubmit} isLoading={isLoading} mode="create" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

const mapDispatchToProps = {
  createApartment: createAparmentAction,
};

export default connect(null, mapDispatchToProps)(CreateApartmentPage);

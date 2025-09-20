import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createTower as createTowerAction } from "../../../redux/actions/tower";
import { SET_MODAL_MESSAGE } from "../../../redux/reducers/messages";
import { ArrowLeft } from "lucide-react";
import TowerForm from "../../../components/tower/TowerForm.jsx";
import Layout from "../../../hocs/Layout.jsx";

function CreateTowerPage({ createTower, dispatch }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = { ...data, state: "active" };
      await createTower(payload);

      dispatch(
        SET_MODAL_MESSAGE({
          message: "Torre creada exitosamente",
          type_message: "success",
          time: 3000,
        })
      );

      navigate("/dashboard/towers");
    } catch (error) {
      console.error("Error creating tower:", error);
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Error al crear la torre",
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
          <Link to="/dashboard/towers">
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crear Torre</h1>
            <p className="text-muted-foreground">
              Completa los datos para registrar una nueva torre
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold">Información de la Torre</h2>
            <p className="text-sm text-muted-foreground">
              Datos básicos y características de la torre
            </p>
          </div>
          <div className="p-5">
            <TowerForm onSubmit={handleSubmit} isLoading={isLoading} mode="create" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

const mapDispatchToProps = {
  createTower: createTowerAction,
};

export default connect(null, mapDispatchToProps)(CreateTowerPage);

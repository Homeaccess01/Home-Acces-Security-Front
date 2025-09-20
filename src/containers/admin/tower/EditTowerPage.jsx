import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getTower as getTowerAction,
  updateTower as updateTowerAction,
} from "../../../redux/actions/tower";
import { SET_MODAL_MESSAGE } from "../../../redux/reducers/messages";
import { ArrowLeft } from "lucide-react";
import TowerForm from "../../../components/tower/TowerForm.jsx";
import Layout from "../../../hocs/Layout.jsx";

function EditTowerPage({ getTower, updateTower, towers, dispatch, loading }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const towerFromStore = useMemo(
    () => (towers || []).find((t) => (t._id || t.id) === id),
    [towers, id]
  );

  const [initialData, setInitialData] = useState(
    towerFromStore
      ? {
          code: towerFromStore.code || "",
          floors: Number(towerFromStore.floors) || 1,
          state: towerFromStore.state || "active",
        }
      : { code: "", floors: 1, state: "active" }
  );

  useEffect(() => {
    let ignore = false;

    const fetch = async () => {
      try {
        if (!towerFromStore && id) {
          const data = await getTower(id);
          if (!ignore && data) {
            setInitialData({
              code: data.code || "",
              floors: Number(data.floors) || 1,
              state: data.state || "active",
            });
          }
        }
      } catch (e) {
        dispatch(
          SET_MODAL_MESSAGE({
            message: "No se pudo cargar la torre",
            type_message: "error",
            time: 3000,
          })
        );
      }
    };

    fetch();
    return () => {
      ignore = true;
    };
  }, [id, towerFromStore, getTower, dispatch]);

  const handleSubmit = async (formValues) => {
    try {
      setIsLoading(true);
      const payload = {
        code: (formValues.code || "").toUpperCase().trim(),
        floors: Number(formValues.floors) || 1,
        state: formValues.state || "active",
      };

      await updateTower(id, payload);

      dispatch(
        SET_MODAL_MESSAGE({
          message: "Torre actualizada exitosamente",
          type_message: "success",
          time: 3000,
        })
      );

      navigate("/dashboard/towers");
    } catch (error) {
      console.error("Error updating tower:", error);
      dispatch(
        SET_MODAL_MESSAGE({
          message: "Error al actualizar la torre",
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
            <h1 className="text-2xl font-bold text-foreground">Editar Torre</h1>
            <p className="text-muted-foreground">
              Modifica los datos de la torre seleccionada
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold">Información de la Torre</h2>
            <p className="text-sm text-muted-foreground">
              Actualiza el código, número de pisos y estado
            </p>
          </div>
          <div className="p-5">
            <TowerForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isLoading={isLoading || loading}
              mode="edit"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  towers: state.towers?.items || [],
  loading: state.towers?.loading || false,
});

const mapDispatchToProps = {
  getTower: getTowerAction,
  updateTower: updateTowerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTowerPage);

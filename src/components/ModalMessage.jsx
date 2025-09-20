import React, { useEffect, useState } from "react";
import { XCircle, CheckCircle } from "lucide-react";
import { connect, useDispatch } from "react-redux";
import { CLEAR_MODAL_MESSAGE } from "../redux/reducers/messages";

const ModalMessage = ({ message, type_message, time }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (message) {
      setIsOpen(true);

      const timer = setTimeout(() => {
        setIsOpen(false);
        dispatch(CLEAR_MODAL_MESSAGE());
      }, time || 3000);

      return () => clearTimeout(timer);
    }
  }, [message, time, dispatch]);

  if (!isOpen) return null;

  const messageStyles =
    type_message === "success"
      ? "bg-white text-green-700 border-2 border-green-300"
      : "bg-white text-red-700 border-2 border-red-300";

  const Icon =
    type_message === "success" ? (
      <CheckCircle className="text-green-500 w-12 h-12 mb-2" />
    ) : (
      <XCircle className="text-red-500 w-12 h-12 mb-2" />
    );

  return (
    <>
      {/* Fondo oscuro que cubre toda la pantalla e impide la interacción */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className={`relative w-full max-w-md p-8 rounded-lg shadow-lg ${messageStyles}`}
          style={{ textAlign: "center" }}
        >
          <div className="flex flex-col items-center justify-center">
            {Icon}
            <span className="text-xl font-semibold mb-4">
              {type_message === "success" ? "¡Buen trabajo!" : "¡Error!"}
            </span>
          </div>

          <div className="text-gray-700 mb-4">{message}</div>

          <button
            onClick={() => setIsOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  message: state.messages.message,
  type_message: state.messages.type_message,
  time: state.messages.time,
});

export default connect(mapStateToProps, {})(ModalMessage);

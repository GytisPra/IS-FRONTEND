// EventModal.tsx
import React from "react";
import { NewEventForm } from "./types";

interface EventModalProps {
  isEditing: boolean;
  newEventForm: NewEventForm;
  modalLoading: boolean;
  modalError: string | null;
  showLocationFields: boolean;
  editingEventId: number | null;
  onClose: () => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onFieldChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onToggleLocationFields: (eventId: number | null) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isEditing,
  newEventForm,
  modalLoading,
  modalError,
  showLocationFields,
  editingEventId,
  onClose,
  onFormSubmit,
  onFieldChange,
  onToggleLocationFields,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Update Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onFormSubmit} className="p-4">
          {modalError && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              {modalError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-2">Renginio detalės</h3>
              <div className="mb-4">
                <label className="block mb-1">Data</label>
                <input
                  type="date"
                  name="date"
                  value={newEventForm.date}
                  onChange={onFieldChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Pradžios laikas</label>
                <input
                  type="time"
                  name="start_time"
                  value={newEventForm.start_time}
                  onChange={onFieldChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Pabaigos laikas</label>
                <input
                  type="time"
                  name="end_time"
                  value={newEventForm.end_time}
                  onChange={onFieldChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="is_free"
                  checked={newEventForm.is_free}
                  onChange={onFieldChange}
                  className="mr-2"
                />
                <label>Is Free</label>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Vietų skaičius</label>
                <input
                  type="number"
                  name="seats_count"
                  value={newEventForm.seats_count}
                  onChange={onFieldChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Max Savanorių</label>
                <input
                  type="number"
                  name="max_volunteer_count"
                  value={newEventForm.max_volunteer_count}
                  onChange={onFieldChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>

              {!showLocationFields && (
                <button
                  type="button"
                  onClick={() => onToggleLocationFields(editingEventId)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Pridėti vietovę
                </button>
              )}
            </div>

            {showLocationFields && (
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-2">
                  Vietovės duomenys
                </h3>
                <div className="mb-4">
                  <label className="block mb-1">Šalis</label>
                  <input
                    type="text"
                    name="location.country"
                    value={newEventForm.location?.country || ""}
                    onChange={onFieldChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Adresas</label>
                  <input
                    type="text"
                    name="location.address"
                    value={newEventForm.location?.address || ""}
                    onChange={onFieldChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Patikslinta vietovė</label>
                  <input
                    type="text"
                    name="location.specified_location"
                    value={newEventForm.location?.specified_location || ""}
                    onChange={onFieldChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Ilguma</label>
                  <input
                    type="number"
                    step="0.000001"
                    name="location.longitude"
                    value={newEventForm.location?.longitude || ""}
                    onChange={onFieldChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Platuma</label>
                  <input
                    type="number"
                    step="0.000001"
                    name="location.latitude"
                    value={newEventForm.location?.latitude || ""}
                    onChange={onFieldChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onToggleLocationFields(editingEventId)}
                  className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Pašalinti vietovę
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                modalLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {modalLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

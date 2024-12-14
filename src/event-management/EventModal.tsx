// EventModal.tsx
import React, { ChangeEvent, useState } from "react";
import { NewEventForm } from "./types";
import {
  LocalizationProvider,
  DateTimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import PreviewEventLocation from "../event-location/PreviewEventLocation";
import { toast } from "react-toastify";

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
  const [showMapPreview, setShowMapPreview] = useState(false);

  const toggleMapPreview = () => {
    if (
      (newEventForm.location?.latitude && newEventForm.location?.longitude) ||
      showMapPreview
    ) {
      setShowMapPreview(!showMapPreview);
    } else {
      toast.error("Nenurodytos koordinatės");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Atnaujinti Renginį" : "Sukurti Naują Renginį"}
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
              <h3 className="text-lg font-semibold mb-2">
                Renginio informacija
              </h3>
              <div className="mb-4">
                <TextField
                  className="w-full p-2 border rounded"
                  name="name"
                  onChange={onFieldChange}
                  value={newEventForm.name}
                  label="Pavadinimas"
                  required
                />
              </div>
              <div className="mb-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="w-full p-0"
                    label="Data"
                    onChange={(value) =>
                      onFieldChange({
                        target: {
                          name: "date",
                          value,
                          type: "datetime",
                        },
                      } as unknown as ChangeEvent<HTMLInputElement>)
                    }
                    value={
                      newEventForm.date.length > 0
                        ? dayjs(newEventForm.date)
                        : null
                    }
                    minDate={dayjs()}
                  />
                </LocalizationProvider>
              </div>
              <div className="flex space-y-4 flex-col mb-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    className="w-full"
                    label="Pradžia"
                    onChange={(value) =>
                      onFieldChange({
                        target: {
                          name: "start_time",
                          value,
                          type: "datetime",
                        },
                      } as unknown as ChangeEvent<HTMLInputElement>)
                    }
                    value={
                      newEventForm.start_time.length > 0
                        ? dayjs(newEventForm.start_time)
                        : null
                    }
                    ampm={false}
                    minDateTime={dayjs()}
                  />
                  <DateTimePicker
                    className="w-full p-0"
                    label="Pabaiga"
                    onChange={(value) =>
                      onFieldChange({
                        target: {
                          name: "end_time",
                          value,
                          type: "datetime",
                        },
                      } as unknown as ChangeEvent<HTMLInputElement>)
                    }
                    value={
                      newEventForm.end_time.length > 0
                        ? dayjs(newEventForm.end_time)
                        : null
                    }
                    ampm={false}
                    minDateTime={dayjs()}
                  />
                </LocalizationProvider>
              </div>
              <div className="mb-4">
                <TextField
                  className="w-full p-2 border rounded"
                  type="number"
                  name="seats_count"
                  onChange={onFieldChange}
                  value={newEventForm.seats_count}
                  label="Vietų skaičius"
                  required
                  slotProps={{
                    input: {
                      inputProps: {
                        step: "1",
                      },
                    },
                  }}
                />
              </div>
              <div className="mb-4">
                <TextField
                  className="w-full p-2 border rounded"
                  type="number"
                  name="price"
                  onChange={onFieldChange}
                  value={newEventForm.price}
                  label="Bilieto kaina"
                  slotProps={{
                    input: {
                      inputProps: {
                        step: "1",
                      },
                    },
                  }}
                />
              </div>
              <div className="mb-4">
                <TextField
                  className="w-full p-2 border rounded"
                  type="number"
                  name="max_volunteer_count"
                  onChange={onFieldChange}
                  value={newEventForm.max_volunteer_count}
                  label="Max Savanorių"
                  required
                  slotProps={{
                    input: {
                      inputProps: {
                        step: "1",
                      },
                    },
                  }}
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
                <label>Mokamas</label>
              </div>
              <div className="mt-10">
                <TextField
                  className="w-full p-2 border rounded"
                  type="text"
                  name="form_url"
                  onChange={onFieldChange}
                  value={newEventForm.form_url}
                  helperText="Google Forms nuoroda"
                  label="Savanorystės apklausos formos nuoroda"
                  slotProps={{
                    input: {
                      inputProps: {
                        step: "1",
                      },
                    },
                  }}
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
                {showMapPreview ? (
                  <>
                    <h3 className="text-lg font-semibold mb-2">
                      Vietovės Žemėlapis
                    </h3>
                    <PreviewEventLocation
                      latitude={newEventForm.location?.latitude}
                      longitude={newEventForm.location?.longitude}
                      disable={false}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">
                      Vietovės duomenys
                    </h3>
                    <div className="mb-4">
                      <TextField
                        className="w-full p-2 border rounded"
                        name="location.city"
                        onChange={onFieldChange}
                        value={newEventForm.location?.city || ""}
                        label="Miestas"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        className="w-full p-2 border rounded"
                        name="location.country"
                        onChange={onFieldChange}
                        value={newEventForm.location?.country || ""}
                        label="Šalis"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        className="w-full p-2 border rounded"
                        name="location.address"
                        onChange={onFieldChange}
                        value={newEventForm.location?.address || ""}
                        label="Adresas"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        className="w-full p-2 border rounded"
                        name="location.specified_location"
                        onChange={onFieldChange}
                        value={newEventForm.location?.specified_location || ""}
                        label="Patikslinta vietovė"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        className="w-full p-2 border rounded"
                        type="number"
                        name="location.longitude"
                        onChange={onFieldChange}
                        value={newEventForm.location?.longitude || ""}
                        label="Ilguma"
                        required
                        slotProps={{
                          input: {
                            inputProps: {
                              step: "0.01",
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        className="w-full p-2 border rounded"
                        type="number"
                        name="location.latitude"
                        onChange={onFieldChange}
                        value={newEventForm.location?.latitude || ""}
                        label="Platuma"
                        required
                        slotProps={{
                          input: {
                            inputProps: {
                              step: "0.01",
                            },
                          },
                        }}
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => onToggleLocationFields(editingEventId)}
                    className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Pašalinti vietovę
                  </button>
                  <button
                    type="button"
                    onClick={toggleMapPreview}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {showMapPreview
                      ? "Uždaryti žemėlapį"
                      : "Atidaryti žemėlapį"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Atšaukti
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
                  ? "Atnaujinama..."
                  : "Kuriama..."
                : isEditing
                ? "Atnaujinti Renginį"
                : "Sukurti Renginį"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

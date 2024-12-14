import { useEffect, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import type { EventLocation } from "./types";
import { fetchEventLocation } from "./locationActions";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "react-toastify";

interface EventLocationProps {
  eventLocationId: string;
  disable: boolean;
}

export default function ViewEventLocation({
  eventLocationId,
  disable,
}: EventLocationProps) {
  const [location, setLocation] = useState<EventLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [dbError, setDbError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const getLocation = async (eventLocationId: string) => {
      const { data, error } = await fetchEventLocation(eventLocationId);

      if (error) {
        setDbError(error);
      } else {
        setLocation(data || null);
      }
    };

    getLocation(eventLocationId);
  }, [eventLocationId]);

  if (!location) {
    return <div>Kraunama...</div>;
  }

  const handleLocationClick = () => {
    if (disable) {
      toast.error("Žemėlapiai išjungti");
      return;
    }

    setShowMap(!showMap);
  };

  return (
    <div>
      <span
        onClick={handleLocationClick}
        className="cursor-pointer hover:text-blue-400 hover:underline"
      >
        {location.address}, {location.city}
      </span>

      {showMap && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleLocationClick} // Close the modal on overlay click
        >
          <div
            className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-3xl"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Patikslinta vieta: {location.specified_location}
              </h2>
              <button
                onClick={handleLocationClick}
                className="text-gray-500 hover:text-red-500"
              >
                &#x2715;
              </button>
            </div>
            <div className="flex justify-center items-center h-[500px] w-full p-4">
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                  defaultZoom={13}
                  defaultCenter={{
                    lat: location.latitude,
                    lng: location.longitude,
                  }}
                  mapId="dae187a0cbdd5192"
                >
                  <AdvancedMarker
                    key={location.id}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                  >
                    <Pin
                      background={"#FBBC04"}
                      glyphColor={"#000"}
                      borderColor={"#000"}
                    />
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            </div>
          </div>
        </div>
      )}

      {dbError && <div className="text-red-500">{dbError.message}</div>}
    </div>
  );
}

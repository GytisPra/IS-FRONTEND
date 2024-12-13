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
      {showMap && location && location.latitude && location.longitude ? (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <span>
            Patikslinta vieta: {location.specified_location}
            <br />
          </span>
          <span
            onClick={handleLocationClick}
            className="cursor-pointer hover:text-blue-400 hover:underline"
          >
            Uždaryti žemėlapį &#x2715;
          </span>
          <div className="flex justify-center items-center h-[500px] w-[500px]">
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
                position={{ lat: location.latitude, lng: location.longitude }}
              >
                <Pin
                  background={"#FBBC04"}
                  glyphColor={"#000"}
                  borderColor={"#000"}
                />
              </AdvancedMarker>
            </Map>
          </div>
        </APIProvider>
      ) : (
        <span
          onClick={handleLocationClick}
          className="cursor-pointer hover:text-blue-400 hover:underline"
        >
          {location.address}, {location.city}
        </span>
      )}

      {dbError && <div className="text-red-500">{dbError.message}</div>}
    </div>
  );
}

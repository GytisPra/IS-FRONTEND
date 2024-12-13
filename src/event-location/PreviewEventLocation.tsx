import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { toast } from "react-toastify";

interface EventLocationProps {
  latitude: string | number | undefined;
  longitude: string | number | undefined;
  disable: boolean;
}

export default function PreviewEventLocation({
  latitude,
  longitude,
  disable,
}: EventLocationProps) {
  if (disable) {
    toast.error("Žemėlapiai išjungti");
    return;
  }

  return (
    <div>
      {latitude && longitude ? (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <div className="flex justify-center items-center h-[27rem] w-full">
            <Map
              defaultZoom={13}
              defaultCenter={{
                lat:
                  typeof latitude === "string"
                    ? parseFloat(latitude)
                    : latitude,
                lng:
                  typeof longitude === "string"
                    ? parseFloat(longitude)
                    : longitude,
              }}
              mapId="dae187a0cbdd5192"
            >
              <AdvancedMarker
                position={{
                  lat:
                    typeof latitude === "string"
                      ? parseFloat(latitude)
                      : latitude,
                  lng:
                    typeof longitude === "string"
                      ? parseFloat(longitude)
                      : longitude,
                }}
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
        <div className="flex w-full h-full">
          <span>Neteisingos koordinatės</span>
        </div>
      )}
    </div>
  );
}

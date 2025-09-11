"use client";

import { InfoWindow, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { Circle } from "./Circle";
import { useMemo, useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreLocation {
  latitude: string;
  longitude: string;
  name: string;
  address: string;
  isClashing?: boolean;
  proximity?: number;
  city_name?: string;
}

interface DirectionsProps {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}

const Directions: React.FC<DirectionsProps> = ({ origin, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
    });

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
        }
      },
    );

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [map, origin, destination]);

  return null;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  return Math.round(distance * 10) / 10;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

const AllStoresMap = ({
                        storeLocations,
                        isAdminPanel = true,
                      }: {
  storeLocations: StoreLocation[];
  isAdminPanel?: boolean;
}) => {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  const center = useMemo(() => {
    return {
      lat:
        storeLocations.reduce((acc, store) => {
          return acc + Number(store.latitude);
        }, 0) / storeLocations.length,
      lng:
        storeLocations.reduce((acc, store) => {
          return acc + Number(store.longitude);
        }, 0) / storeLocations.length,
    };
  }, [storeLocations]);

  // Calculate distance when two locations are selected
  useEffect(() => {
    if (selectedLocations.length === 2) {
      const loc1 = storeLocations[selectedLocations[0]];
      const loc2 = storeLocations[selectedLocations[1]];
      const dist = calculateDistance(
        Number(loc1.latitude),
        Number(loc1.longitude),
        Number(loc2.latitude),
        Number(loc2.longitude)
      );
      setDistance(dist);
    } else {
      setDistance(null);
    }
  }, [selectedLocations, storeLocations]);

  const handleMarkerClick = useCallback(
    (index: number) => {
      const screenWidth = window.screen.width;

      if (screenWidth <= 768) {
        if (hoveredMarkerId === index) return;
        setHoveredMarkerId(index);
      }

      if (!isAdminPanel) return;

      setSelectedLocations((prev) => {
        // If clicking on an already selected marker, deselect it
        if (prev.includes(index)) {
          return prev.filter((i) => i !== index);
        }
        // If two locations are already selected, start fresh with the new selection
        if (prev.length === 2) {
          return [index];
        }
        // Add the new selection
        return [...prev, index];
      });
    },
    [hoveredMarkerId, isAdminPanel],
  );

  const markers = useMemo(() => {
    return storeLocations.map((storeLocation: StoreLocation, index: number) => {
      const isSelected = isAdminPanel && selectedLocations.includes(index);
      return (
        <div key={index} onMouseLeave={() => setHoveredMarkerId(null)}>
          <Marker
            position={{
              lat: Number(storeLocation.latitude),
              lng: Number(storeLocation.longitude),
            }}
            onMouseOver={() => {
              if (hoveredMarkerId === index) return;
              setHoveredMarkerId(index);
            }}
            onClick={() => handleMarkerClick(index)}
          />
          {hoveredMarkerId === index && (
            <InfoWindow
              position={{
                lat: Number(storeLocation.latitude),
                lng: Number(storeLocation.longitude),
              }}
              onCloseClick={() => setHoveredMarkerId(null)}
              headerDisabled
              options={{ pixelOffset: window?.google?.maps ? new window.google.maps.Size(0, -40) : undefined }}
            >
              <div
                className="relative p-5 text-black"
                onMouseOver={() => setHoveredMarkerId(index)}
              >
                <h3 className="font-bold">
                  {isAdminPanel ? storeLocation.name : storeLocation.city_name}
                </h3>
                {isAdminPanel && (
                  <p className="mt-2">{storeLocation.address}</p>
                )}
                {storeLocation.isClashing && isAdminPanel && (
                  <p className="mt-1 text-red-500">
                    Warning: Proximity clash detected
                  </p>
                )}
                <X
                  size={16}
                  onClick={() => setHoveredMarkerId(null)}
                  className="absolute right-0 top-0 h-[20px] w-[20px] cursor-pointer rounded-full bg-black p-1 text-white"
                />
              </div>
            </InfoWindow>
          )}
        </div>
      );
    });
  }, [storeLocations, hoveredMarkerId, selectedLocations, handleMarkerClick]);

  const circles = useMemo(() => {
    return storeLocations
      .filter((sl) => sl.isClashing)
      .map((storeLocation: StoreLocation, index: number) => {
        return (
          <Circle
            center={{
              lat: Number(storeLocation.latitude),
              lng: Number(storeLocation.longitude),
            }}
            radius={Number(storeLocation.proximity) * 1609.344}
            key={index}
            strokeColor={"#FF0000"}
            strokeOpacity={0.8}
            fillColor={"#FF0000"}
            fillOpacity={0.35}
          />
        );
      });
  }, [storeLocations]);

  const clearSelections = () => {
    setSelectedLocations([]);
    setDistance(null);
  };

  return (
    <div className="relative">
      <Map
        className="z-0 h-[700px] 3xl:h-[calc(100vh-500px)]"
        defaultCenter={storeLocations.length > 0 ? center : { lat: 0, lng: 0 }}
        defaultZoom={2}
        gestureHandling={"greedy"}
        disableDefaultUI
      >
        {markers}
        {isAdminPanel && circles.length > 0 && circles}
      </Map>
      {isAdminPanel && selectedLocations.length > 0 && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-white p-6 shadow-xl border border-gray-200">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Selected Locations</h3>
              <ul className="mt-3 space-y-2">
                {selectedLocations.map((index) => (
                  <li key={index} className="text-gray-700 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"/>
                    <span>{storeLocations[index].name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedLocations.length === 1 && (
              <p className="text-sm text-gray-500 italic">
                Select another location to see distance
              </p>
            )}

            {distance !== null && (
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-gray-900 font-medium">
                  Distance: {distance} miles
                </p>
              </div>
            )}

            <Button
              onClick={clearSelections}
              variant={'destructive'}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStoresMap;
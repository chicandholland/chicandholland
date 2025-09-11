import MapProvider from "@/components/custom/map-provider";
import { getClients } from "@/lib/data";
import AllStoresMap from "@/components/custom/map/AllStoresMap";

const FindAStore = async () => {
  const clients = await getClients({});

  return (
    <MapProvider>
      <div className={'p-5 3xl:h-[calc(100vh-441px)]'} >
        <AllStoresMap storeLocations={clients.clients} isAdminPanel={false} />
      </div>
    </MapProvider>
  );
};

export default FindAStore;

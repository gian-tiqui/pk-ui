import { Dialog } from "primereact/dialog";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import useSelectedRoom from "../@utils/store/selectedRoom";
import { TabPanel, TabView } from "primereact/tabview";
import { ImageLocation } from "../@utils/enums/enum";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import handleErrors from "../@utils/functions/handleErrors";
import { getRoomPhotos } from "../@utils/services/roomService";
import { Query, RoomImage } from "../types/types";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const AmenityInfoDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const { selectedRoom } = useSelectedRoom();
  const [query] = useState<Query>({
    limit: 10,
    offset: 0,
    isDeleted: false,
  });
  const toastRef = useRef<Toast>(null);
  const [imageObjs, setImageObjs] = useState<RoomImage[]>([]);

  useEffect(() => {
    const fetchPhotos = () => {
      if (!selectedRoom?.id) return;

      getRoomPhotos(selectedRoom.id, query)
        .then((response) => {
          const roomImagesData = response.data.images;
          const tempImgLocations: string[] = [];

          roomImagesData.map((image: RoomImage) =>
            tempImgLocations.push(
              getImageFromServer(ImageLocation.ROOM, image.imageLocation)
            )
          );
          setImageObjs(response.data.images);
        })
        .catch((error) => handleErrors(error, toastRef));
    };

    fetchPhotos();
  }, [selectedRoom, query]);

  return (
    <Dialog
      header={selectedRoom?.name}
      className="w-[95%] h-[95%]"
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
      pt={{
        header: {
          className:
            "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-slate-700",
        },
      }}
    >
      <TabView
        pt={{
          panelContainer: { className: "h-80 w-full bg-inherit" },
          nav: { className: "w-full bg-inherit" },
          tab: { className: "w-full bg-inherit" },
        }}
      >
        <TabPanel
          header="Details"
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          <pre className="text-slate-100">{selectedRoom?.detail}</pre>
        </TabPanel>
        <TabPanel
          header="Images"
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          <div className="grid grid-cols-1 gap-3">
            {imageObjs.map((img) => (
              <div
                className={`flex items-center justify-center overflow-hidden`}
                key={img.id}
              >
                <Image
                  src={getImageFromServer(
                    ImageLocation.ROOM,
                    img.imageLocation
                  )}
                  alt={img.imageLocation}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </TabPanel>
      </TabView>
    </Dialog>
  );
};

export default AmenityInfoDialog;

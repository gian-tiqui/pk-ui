import { Query, Room } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const createRoom = async (name: string, code: string, floorId: number) => {
  return apiClient.post(`${URI.API_URI}/api/v1/room`, {
    name,
    code,
    floorId,
  });
};

const getRoomById = async (roomId: number): Promise<Room | undefined> => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/room/${roomId}`
    );

    const floor: Room = response.data.room;

    return floor;
  } catch (error) {
    console.error(error);

    return undefined;
  }
};

const getRoomDirectionPatternsById = async (
  roomId?: number,
  params?: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/room/${roomId}/directionPatterns`,
    { params }
  );
};

const updateRoomById = async (
  roomId: number,
  payload: { name?: string; code?: string; detail?: string; direction?: string }
) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/room/${roomId}`, {
    name: payload.name,
    code: payload.code,
    detail: payload.detail,
    direction: payload.direction,
  });
};

const uploadRoomPhotos = (roomId: number, formData: FormData) => {
  return apiClient.post(
    `${URI.API_URI}/api/v1/room/${roomId}/upload`,
    formData
  );
};

const addDirections = async (
  roomId: number,
  {
    directionPattern,
    startingPoint,
  }: { directionPattern: object; startingPoint: number }
) => {
  return apiClient.post(`${URI.API_URI}/api/v1/room/${roomId}/directions`, {
    directionPattern: { arrows: directionPattern },
    startingPoint,
  });
};

const getRoomPhotos = async (roomId: number, query: Query) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/room/${roomId}/photos?limit=${query.limit}&offset=${query.offset}&isDeleted=${query.isDeleted}`
  );
};

const deleteRoomPhotosByRoomId = async (roomId: number, imageIds: string) => {
  return apiClient.delete(
    `${URI.API_URI}/api/v1/room/${roomId}/delete-images?imageIds=${imageIds}`
  );
};

const softDeleteRoomById = async (roomId: number) => {
  return apiClient.delete(`${URI.API_URI}/api/v1/room/${roomId}/soft-delete`);
};

const removeRoomById = async (roomId: number) => {
  return apiClient.delete(`${URI.API_URI}/api/v1/room/${roomId}`);
};

const retrieveRoomById = async (roomId: number) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/room/${roomId}/retrieve`);
};

export {
  createRoom,
  getRoomById,
  updateRoomById,
  softDeleteRoomById,
  addDirections,
  retrieveRoomById,
  removeRoomById,
  uploadRoomPhotos,
  getRoomPhotos,
  deleteRoomPhotosByRoomId,
  getRoomDirectionPatternsById,
};

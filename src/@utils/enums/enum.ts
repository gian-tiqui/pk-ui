enum Namespace {
  BASE = "PATIENT_KIOSK",
}

enum URI {
  API_URI = import.meta.env.VITE_API_URI,
}

enum ImageLocation {
  BASE = "http://localhost:8083",
  UPLOADS = "uploads",
  ROOM = "room_images",
  FLOOR = "floor_images",
}

enum Department {
  IT = 3,
  MRKT = 4,
  SSD = 8,
}

export { Namespace, URI, ImageLocation, Department };

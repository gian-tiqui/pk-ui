enum Namespace {
  BASE = "PATIENT_KIOSK",
}

enum URI {
  API_URI = import.meta.env.VITE_API_URI || "http://10.10.10.30:8083",
}

enum ImageLocation {
  BASE = import.meta.env.VITE_API_URI || "http://10.10.10.30:8083",
  UPLOADS = "uploads",
  ROOM = "room_images",
  FLOOR = "floor_images",
}

enum Department {
  IT = 3,
  MRKT = 4,
  SSD = 8,
}

enum StartingPoint {
  FRONT_ELEVATOR = 10001,
  BACK_ELEVATOR = 10002,
  FRONT_STAIRS = 10003,
  BACK_STAIRS = 10004,
}

export { Namespace, URI, ImageLocation, Department, StartingPoint };

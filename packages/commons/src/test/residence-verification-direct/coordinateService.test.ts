import { describe, it, expect, vi, afterEach } from "vitest";
import NodeGeocoder from "node-geocoder";
import { CoordinatesService } from "../../services/residence-verification-direct/coordinateService.js";
vi.mock("node-geocoder", () => {
  const mockGeocoder = {
    geocode: vi.fn(),
  };
  return {
    default: vi.fn(() => mockGeocoder),
  };
});

vi.mock("pdnd-common", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CoordinatesService", () => {
  const service: CoordinatesService = new CoordinatesService();
  const geocoderInstance = NodeGeocoder({ provider: "openstreetmap" });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return coordinates for a valid address", async () => {
    const mockResponse = [{ latitude: 41.9, longitude: 12.5 }];
    vi.mocked(geocoderInstance.geocode).mockResolvedValue(mockResponse);

    const result = await service.getCoordinates("Via del Corso, Roma");

    expect(geocoderInstance.geocode).toHaveBeenCalledWith(
      "Via del Corso, Roma"
    );
    expect(result).toEqual({ latitude: "41.9", longitude: "12.5" });
  });

  it("should return undefined if address is not found", async () => {
    vi.mocked(geocoderInstance.geocode).mockResolvedValue([]);
    const { logger } = await import("pdnd-common");

    const result = await service.getCoordinates("address-not-found");

    expect(result).toBeUndefined();
    expect(logger.info).toHaveBeenCalledWith("Nessun risultato trovato.");
  });

  it("should return undefined and log an error on geocoding failure", async () => {
    vi.mocked(geocoderInstance.geocode).mockRejectedValue(
      new Error("API Error")
    );
    const { logger } = await import("pdnd-common");

    const result = await service.getCoordinates("any address");

    expect(result).toBeUndefined();
    expect(logger.error).toHaveBeenCalledWith(
      "Errore durante la geocodifica:",
      expect.any(Error)
    );
  });
});

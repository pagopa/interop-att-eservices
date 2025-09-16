import { describe, it, expect, vi, afterEach } from "vitest";
import NodeGeocoder from "node-geocoder";
import { CoordinatesService } from "../../src/services/residence-verification-direct/index.js";

vi.mock("node-geocoder", () => {
  const mockGeocoder = {
    geocode: vi.fn(),
  };
  return {
    default: vi.fn(() => mockGeocoder),
  };
});

const { mockLogger } = vi.hoisted(() => ({
  mockLogger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock("../../src/index.js", () => ({
  logger: mockLogger,
}));

describe("CoordinatesService", () => {
  const geocoderInstance = NodeGeocoder({ provider: "openstreetmap" });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return coordinates for a valid address", async () => {
    const mockResponse = [{ latitude: 41.9, longitude: 12.5 }];
    vi.mocked(geocoderInstance.geocode).mockResolvedValue(mockResponse);

    const result = await CoordinatesService.getCoordinates(
      "Via del Corso, Roma"
    );

    expect(geocoderInstance.geocode).toHaveBeenCalledWith(
      "Via del Corso, Roma"
    );
    expect(result).toEqual({ latitude: "41.9", longitude: "12.5" });
  });

  it("should return undefined if address is not found", async () => {
    vi.mocked(geocoderInstance.geocode).mockResolvedValue([]);
    const result = await CoordinatesService.getCoordinates("address-not-found");

    expect(result).toBeUndefined();
    expect(mockLogger.info).toHaveBeenCalledWith("Nessun risultato trovato.");
  });

  it("should return undefined and log an error on geocoding failure", async () => {
    const testError = new Error("API Error");
    vi.mocked(geocoderInstance.geocode).mockRejectedValue(testError);

    const result = await CoordinatesService.getCoordinates("any address");

    expect(result).toBeUndefined();
    expect(mockLogger.error).toHaveBeenCalledWith(
      "Errore durante la geocodifica:",
      testError
    );
  });
});

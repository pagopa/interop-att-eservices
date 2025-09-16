/* eslint-disable functional/no-let */
import { describe, it, expect, vi, afterEach } from "vitest";
import { ElementDigitalAddressModel } from "pdnd-models";
import { DigitalAddressRepository } from "../../src/repositories/digital-address-verification/digitalAddressRepository.js";

const { mockClient, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    values: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    then: vi.fn(),
  };
  const mockClient = {
    insert: vi.fn().mockReturnValue(mockDbChain),
    delete: vi.fn().mockReturnValue(mockDbChain),
  };
  return { mockClient, mockDbChain };
});

vi.mock("../../src/index.js", () => ({
  client: mockClient,
  logger: { error: vi.fn() },
}));

describe("DigitalAddressRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should delete by subject data response id", async () => {
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(undefined)
    );
    await DigitalAddressRepository.deleteBySubjectDataResponseId(123);
    expect(mockClient.delete).toHaveBeenCalled();
    expect(mockDbChain.where).toHaveBeenCalled();
  });

  it("should insert digital addresses", async () => {
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(undefined)
    );
    const addresses: ElementDigitalAddressModel[] = [
      {
        digitalAddress: "test1@pec.it",
        information: {
          reason: "CESSAZIONE_VOLONTARIA",
          endDate: new Date().toISOString(),
        },
      },
    ];
    await DigitalAddressRepository.insertDigitalAddresses(456, addresses);
    expect(mockClient.insert).toHaveBeenCalled();
    expect(mockDbChain.values).toHaveBeenCalled();
  });
});

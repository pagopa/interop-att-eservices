/* eslint-disable functional/no-let */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ElementDigitalAddressModel } from "pdnd-models";
import { DigitalAddressRepository } from "../../repositories/digital-address-verification/digitalAddressRepository.js";

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

vi.mock("../../db/postgres/client.js", () => ({ client: mockClient }));
vi.mock("../../index.js", () => ({ logger: { error: vi.fn() } }));

describe("DigitalAddressRepository", () => {
  let repository: DigitalAddressRepository;

  beforeEach(() => {
    repository = new DigitalAddressRepository();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should delete by subject data response id", async () => {
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(undefined)
    );
    await repository.deleteBySubjectDataResponseId(123);
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
    await repository.insertDigitalAddresses(456, addresses);
    expect(mockClient.insert).toHaveBeenCalled();
    expect(mockDbChain.values).toHaveBeenCalled();
  });
});

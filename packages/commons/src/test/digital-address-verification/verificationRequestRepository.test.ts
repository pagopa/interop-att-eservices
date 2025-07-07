/* eslint-disable functional/no-let */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { VerificationRequestRepository } from "../../repositories/digital-address-verification/verificationRequestRepository.js";
import { VerifyRequest } from "../../db/model/verifyRequest.js";

const { mockClient, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    values: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn(),
    set: vi.fn().mockReturnThis(),
    then: vi.fn(),
  };
  const mockClient = {
    insert: vi.fn().mockReturnValue(mockDbChain),
    select: vi.fn().mockReturnValue(mockDbChain),
    update: vi.fn().mockReturnValue(mockDbChain),
  };
  return { mockClient, mockDbChain };
});

vi.mock("../../db/postgres/client.js", () => ({ client: mockClient }));
vi.mock("../../index.js", () => ({ logger: { error: vi.fn() } }));

describe("VerificationRequestRepository", (): void => {
  let repository: VerificationRequestRepository;

  const mockRequest: VerifyRequest = {
    idRequest: "req-123",
    count: 1,
    jsonRequest: '{"key":"value"}',
  };

  beforeEach((): void => {
    repository = new VerificationRequestRepository();
  });

  afterEach((): void => {
    vi.clearAllMocks();
  });

  it("should save a request", async (): Promise<void> => {
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(undefined)
    );
    await repository.save(mockRequest);
    expect(mockClient.insert).toHaveBeenCalled();
    expect(mockDbChain.values).toHaveBeenCalled();
  });

  it("should find a request by id", async (): Promise<void> => {
    const dbRecord = {
      ...mockRequest,
      jsonRequest: JSON.parse(mockRequest.jsonRequest),
    };
    vi.mocked(mockDbChain.limit).mockResolvedValue([dbRecord]);
    const result = await repository.findById("req-123");
    expect(mockClient.select).toHaveBeenCalled();
    expect(result).toEqual(mockRequest);
  });

  it("should update a request", async (): Promise<void> => {
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(undefined)
    );
    await repository.update({ idRequest: "req-123", count: 5 });
    expect(mockClient.update).toHaveBeenCalled();
    expect(mockDbChain.set).toHaveBeenCalled();
  });
});

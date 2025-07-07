/* eslint-disable functional/no-let */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ListRequestRepository } from "../../repositories/digital-address-verification/listRequestRepository.js";

const { mockClient, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    onConflictDoNothing: vi.fn().mockReturnThis(),
    then: vi.fn(),
  };
  const mockClient = {
    insert: vi.fn().mockReturnValue(mockDbChain),
  };
  return { mockClient, mockDbChain };
});

vi.mock("uuid", () => ({ v4: (): string => "mock-uuid-1234" }));
vi.mock("../../db/postgres/client.js", () => ({ client: mockClient }));
vi.mock("../../index.js", () => ({ logger: { error: vi.fn() } }));

describe("ListRequestRepository", (): void => {
  let repository: ListRequestRepository;

  beforeEach((): void => {
    repository = new ListRequestRepository();
  });

  afterEach((): void => {
    vi.clearAllMocks();
  });

  it("should create a list request", async (): Promise<void> => {
    vi.mocked(mockDbChain.returning).mockResolvedValue([
      { id: "mock-uuid-1234" },
    ]);
    const result = await repository.createListRequest();
    expect(result).toBe("mock-uuid-1234");
    expect(mockClient.insert).toHaveBeenCalled();
  });

  it("should add a request subject", async (): Promise<void> => {
    vi.mocked(mockDbChain.then).mockImplementation((resolve) =>
      resolve(undefined)
    );
    await repository.addRequestSubject("list-req-1", "subject-1");
    expect(mockClient.insert).toHaveBeenCalled();
    expect(mockDbChain.onConflictDoNothing).toHaveBeenCalled();
  });
});

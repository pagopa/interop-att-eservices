import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrialRepository } from '../../../src/repository/trialRepository';
import trialService from '../../../src/services/trialService';

vi.mock('../../../src/utilities/jsonTrialUtilities', () => ({
  parseJsonToCategoryArray: vi.fn()
}));

describe('trialService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findPaginatedTrial', () => {
    it('should find all Trials in database', async () => {
      const mockParsedData = {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        data: [
            {
                purpose_id: "ebac134c-724f-4381-8180-7f2e1ebfe468",
                correlation_id: "06989b29-de77-47ce-9b5e-27892eb19c28",
                trials: [
                    {
                        id: 57,
                        operation_path: "/residence-verification/verify",
                        operation_method: "POST",
                        response: "OK",
                        created_date: "2024-06-11T15:54:52.869838",
                        checks: [
                            {
                                id: 1,
                                code: "authData",
                                description: "Bearer token can not be parsed",
                                order: 1
                            },
                            {
                                id: 2,
                                code: "header",
                                description: "not present",
                                order: 2
                            },
                            {
                                id: 3,
                                code: "payload",
                                description: "not present",
                                order: 3
                            },
                            {
                                id: 4,
                                code: "typ",
                                description: "\"typ\" not valid in Authentication Bearer",
                                order: 4
                            },
                            {
                                id: 5,
                                code: "iss",
                                description: "\"iss\" not valid in Authentication Bearer header",
                                order: 5
                            },
                            {
                                id: 6,
                                code: "aud",
                                description: "\"aud\" not valid in Authentication Bearer header",
                                order: 6
                            },
                            {
                                id: 44,
                                code: "VOUCHER",
                                description: "Authorization bearer token",
                                order: 7
                            }
                        ]
                    },
                    {
                        id: 58,
                        operation_path: "/residence-verification/verify",
                        operation_method: "POST",
                        response: "OK",
                        created_date: "2024-06-11T15:54:53.180877",
                        checks: [
                            {
                                id: 7,
                                code: "agid-jwt-signature",
                                description: "header attribute not present",
                                order: 1
                            },
                            {
                                id: 8,
                                code: "agid-jwt-signature",
                                description: "header attribute not valid",
                                order: 2
                            },
                            {
                                id: 9,
                                code: "publicKeyService",
                                description: "token not valid",
                                order: 3
                            },
                            {
                                id: 10,
                                code: "payload",
                                description: "not present",
                                order: 4
                            },
                            {
                                id: 11,
                                code: "exp",
                                description: "\"exp\" is required in agid-jwt-signature payload token",
                                order: 5
                            },
                            {
                                id: 12,
                                code: "exp",
                                description: "\"exp\" is expired in agid-jwt-signature payload token",
                                order: 6
                            },
                            {
                                id: 13,
                                code: "iat",
                                description: "\"iat\" is required in agid-jwt-signature payload token",
                                order: 7
                            },
                            {
                                id: 14,
                                code: "iat",
                                description: "\"iat\" is expired in agid-jwt-signature payload token",
                                order: 8
                            },
                            {
                                id: 15,
                                code: "aud",
                                description: "\"aud\" is required in agid-jwt-signature payload token",
                                order: 9
                            },
                            {
                                id: 16,
                                code: "aud",
                                description: "\"aud\" is not valid in agid-jwt-signature payload token",
                                order: 10
                            },
                            {
                                id: 17,
                                code: "content-type",
                                description: "\"content-type\" is required in agid-jwt-signature payload token",
                                order: 11
                            },
                            {
                                id: 18,
                                code: "content-encoding",
                                description: "\"content-encoding\" is required in agid-jwt-signature payload token",
                                order: 12
                            },
                            {
                                id: 19,
                                code: "signed-headers",
                                description: "\"signed-headers\" is required in agid-jwt-signature payload token",
                                order: 13
                            },
                            {
                                id: 20,
                                code: "signed-headers_content-type",
                                description: "\"content-type\" in \"signed-headers\" is required in agid-jwt-signature payload token",
                                order: 14
                            },
                            {
                                id: 21,
                                code: "signed-headers_content-encoding",
                                description: "\"content-encoding\" in \"signed-headers\" is required in agid-jwt-signature payload token",
                                order: 15
                            },
                            {
                                id: 22,
                                code: "signed-headers_digest",
                                description: "\"digest\" in \"signed-headers\" is required in agid-jwt-signature payload token",
                                order: 16
                            },
                            {
                                id: 23,
                                code: "signed-headers_content-type",
                                description: "\"content-type\" in \"signed-headers\" not match with \"content-type\" in headers",
                                order: 17
                            },
                            {
                                id: 24,
                                code: "signed-headers_content-encoding",
                                description: "\"content-encoding\" in \"signed-headers\" not match with \"content-encoding\" in headers",
                                order: 18
                            },
                            {
                                id: 25,
                                code: "signed-headers_digest",
                                description: "\"digest\" in \"signed-headers\" not start with \"SHA-256=\"",
                                order: 19
                            },
                            {
                                id: 26,
                                code: "digest",
                                description: "\"digest\" in headers not start with \"SHA-256=\"",
                                order: 20
                            },
                            {
                                id: 27,
                                code: "signed-headers_digest",
                                description: "\"digest\" in \"signed-headers\" not match with \"digest\" in headers",
                                order: 21
                            },
                            {
                                id: 28,
                                code: "digest",
                                description: "hashed request body not match with the \"digest\" in the \"signed-headers\"",
                                order: 22
                            },
                            {
                                id: 45,
                                code: "Agid-JWT-Signature",
                                description: "Token in the request Headers",
                                order: 23
                            }
                        ]
                    },
                    {
                        id: 59,
                        operation_path: "/residence-verification/verify",
                        operation_method: "POST",
                        response: "OK",
                        created_date: "2024-06-11T15:54:53.433913",
                        checks: [
                            {
                                id: 29,
                                code: "agid-jwt-trackingevidence",
                                description: "header attribute not present",
                                order: 1
                            },
                            {
                                id: 30,
                                code: "agid-jwt-trackingevidence",
                                description: "header attribute not valid",
                                order: 2
                            },
                            {
                                id: 31,
                                code: "publicKeyService",
                                description: "token not valid",
                                order: 3
                            },
                            {
                                id: 32,
                                code: "payload",
                                description: "not present",
                                order: 4
                            },
                            {
                                id: 33,
                                code: "exp",
                                description: "\"exp \"is required in agid-jwt-trackingevidence payload token",
                                order: 5
                            },
                            {
                                id: 34,
                                code: "exp",
                                description: "\"exp\" is expired in agid-jwt-trackingevidence payload token",
                                order: 6
                            },
                            {
                                id: 35,
                                code: "iat",
                                description: "\"iat\" is required in agid-jwt-trackingevidence payload token",
                                order: 7
                            },
                            {
                                id: 36,
                                code: "iat",
                                description: "\"iat\" is expired in agid-jwt-trackingevidence payload token",
                                order: 8
                            },
                            {
                                id: 37,
                                code: "aud",
                                description: "\"aud\" is required in agid-jwt-trackingevidence payload token",
                                order: 9
                            },
                            {
                                id: 38,
                                code: "aud",
                                description: "\"aud\" is not valid in agid-jwt-trackingevidence payload token",
                                order: 10
                            },
                            {
                                id: 39,
                                code: "iss",
                                description: "\"iss\" is required in agid-jwt-trackingevidence payload token",
                                order: 11
                            },
                            {
                                id: 40,
                                code: "purposeId",
                                description: "\"purposeId\" not valid in agid-jwt-trackingevidence payload token",
                                order: 12
                            },
                            {
                                id: 41,
                                code: "userID",
                                description: "\"userID\" not valid in agid-jwt-trackingevidence payload token",
                                order: 13
                            },
                            {
                                id: 42,
                                code: "userLocation",
                                description: "\"userLocation\" not valid in agid-jwt-trackingevidence payload token",
                                order: 14
                            },
                            {
                                id: 43,
                                code: "LoA",
                                description: "\"LoA\" not valid in agid-jwt-trackingevidence payload token",
                                order: 15
                            },
                            {
                                id: 46,
                                code: "Agid-JWT-TrackingEvidence",
                                description: "Token in the request Headers",
                                order: 18
                            }
                        ]
                    },
                    {
                        id: 60,
                        operation_path: "/residence-verification/verify",
                        operation_method: "POST",
                        response: "OK",
                        created_date: "2024-06-11T15:54:53.44299",
                        checks: [
                            {
                                id: 57,
                                code: "residence-verification-002",
                                description: "API to verify a residence",
                                order: 4
                            }
                        ]
                    }
                ]
            }
        ]
    };

    vi.spyOn(TrialRepository, 'findPaginatedTrial').mockResolvedValue(mockParsedData);

    const result = await trialService.getPaginatedTrial(1, 1, "ebac134c-724f-4381-8180-7f2e1ebfe468", undefined, "/residence-verification/verify", "POST");

    expect(TrialRepository.findPaginatedTrial).toHaveBeenCalled();
    expect(result).toEqual(mockParsedData);
    });
  });
});

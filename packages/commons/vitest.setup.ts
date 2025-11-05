import { vi } from "vitest";

vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(() => "--- FAKE MOCKED KEY ---"),
  },
  readFileSync: vi.fn(() => "--- FAKE MOCKED KEY ---"),
}));

vi.mock("./src/config/m2mConfig.js", () => ({
  m2mConfig: vi.fn(() => ({ 
    privateKeyPath: "fake/path/to/key.priv",
  })),
}));

vi.mock("./src/utility/client-assertion-m2m.js", () => ({
  exec_pdnd_client_assertion_m2m: vi.fn(() => "fake-client-assertion"),
  get_pdnd_token_m2m: vi.fn(() => Promise.resolve("fake-m2m-token")),
}));
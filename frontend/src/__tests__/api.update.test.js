import * as api from "../services/api";

describe("API helpers", () => {
  it("exports updateVehicle function", () => {
    expect(typeof api.updateVehicle).toBe("function");
  });
});

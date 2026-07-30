import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "../pages/DashboardPage";

jest.mock("../services/api", () => ({
  setApiToken: jest.fn(),
  fetchCurrentUser: jest.fn(),
  fetchVehicles: jest.fn(),
  searchVehicles: jest.fn(),
  addVehicle: jest.fn(),
  restockVehicle: jest.fn(),
  purchaseVehicle: jest.fn(),
  deleteVehicle: jest.fn(),
}));

import * as api from "../services/api";

describe("Dashboard interactions", () => {
  beforeEach(() => {
    localStorage.setItem("car_dealership_token", "fake-token");
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  test("restock counter enables restock and calls API", async () => {
    const vehicle = { id: "v1", make: "Toyota", model: "Corolla", category: "Sedan", price: 20000, quantity: 1 };
    api.fetchCurrentUser.mockResolvedValue({ data: { role: "admin" } });
    api.fetchVehicles.mockResolvedValue({ data: [vehicle] });
    api.restockVehicle.mockResolvedValue({ data: { ...vehicle, quantity: 2 } });

    render(<DashboardPage />);

    await waitFor(() => expect(api.fetchVehicles).toHaveBeenCalled());

    // restock button should be disabled until we increment
    const plus = screen.getByText("+");
    const restockBtn = screen.getByText("Restock");
    expect(restockBtn).toBeDisabled();

    fireEvent.click(plus);
    expect(restockBtn).not.toBeDisabled();

    fireEvent.click(restockBtn);
    await waitFor(() => expect(api.restockVehicle).toHaveBeenCalledWith("v1", 1));
  });

  test("purchase modal computes total and calls API", async () => {
    const vehicle = { id: "v2", make: "Honda", model: "Civic", category: "Sedan", price: 15000, quantity: 3 };
    api.fetchCurrentUser.mockResolvedValue({ data: { role: "customer" } });
    api.fetchVehicles.mockResolvedValue({ data: [vehicle] });
    api.purchaseVehicle.mockResolvedValue({ data: { ...vehicle, quantity: 1 } });

    render(<DashboardPage />);

    await waitFor(() => expect(api.fetchVehicles).toHaveBeenCalled());

    const purchaseBtn = screen.getByText("Purchase");
    fireEvent.click(purchaseBtn);

    await waitFor(() => screen.getByText(/Total:/));

    const qtyInput = screen.getByLabelText(/Quantity/i);
    fireEvent.change(qtyInput, { target: { value: "2" } });

    const confirm = screen.getByText(/Purchase 2/);
    fireEvent.click(confirm);

    await waitFor(() => expect(api.purchaseVehicle).toHaveBeenCalledWith("v2", 2));
  });

  test("adding an identical vehicle updates quantity instead of creating new one", async () => {
    const vehicle = { id: "v3", make: "Ford", model: "Focus", category: "Hatchback", price: 12000, quantity: 5 };
    api.fetchCurrentUser.mockResolvedValue({ data: { role: "admin" } });
    api.fetchVehicles.mockResolvedValue({ data: [vehicle] });
    api.restockVehicle.mockResolvedValue({ data: { ...vehicle, quantity: 8 } });
    api.addVehicle.mockResolvedValue({ data: { id: "v4" } });

    render(<DashboardPage />);

    await waitFor(() => expect(api.fetchVehicles).toHaveBeenCalled());

    // fill add form with identical fields
    const make = screen.getByPlaceholderText("Make");
    const model = screen.getByPlaceholderText("Model");
    const category = screen.getByPlaceholderText("Category");
    const price = screen.getByPlaceholderText("Price");
    const qty = screen.getByPlaceholderText("Quantity");

    fireEvent.change(make, { target: { value: "Ford" } });
    fireEvent.change(model, { target: { value: "Focus" } });
    fireEvent.change(category, { target: { value: "Hatchback" } });
    fireEvent.change(price, { target: { value: "12000" } });
    fireEvent.change(qty, { target: { value: "3" } });

    const addBtn = screen.getByText("Add vehicle");
    fireEvent.click(addBtn);

    await waitFor(() => expect(api.restockVehicle).toHaveBeenCalledWith("v3", 3));
    expect(api.addVehicle).not.toHaveBeenCalled();
  });
});

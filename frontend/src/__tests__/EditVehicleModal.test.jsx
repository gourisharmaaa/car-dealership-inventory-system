import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditVehicleModal from "../components/EditVehicleModal";

describe("EditVehicleModal", () => {
  const vehicle = { id: 1, make: "Honda", model: "Civic", category: "Sedan", price: 15000, quantity: 5 };

  it("renders fields and calls onSave with updated values", async () => {
    const onSave = jest.fn(() => Promise.resolve());
    const onClose = jest.fn();
    render(<EditVehicleModal vehicle={vehicle} onSave={onSave} onClose={onClose} />);

    // change make
    const makeInput = screen.getByDisplayValue("Honda");
    fireEvent.change(makeInput, { target: { value: "HondaX" } });

    // save
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    // onSave should have been called with id and payload
    expect(onSave).toHaveBeenCalledWith(vehicle.id, expect.objectContaining({ make: "HondaX" }));
  });
});

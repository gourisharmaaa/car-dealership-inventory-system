import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FiltersPanel from "../components/FiltersPanel";

describe("FiltersPanel", () => {
  const vehicles = [
    { id: 1, make: "Toyota", model: "Camry", category: "Sedan" },
    { id: 2, make: "Ford", model: "F-150", category: "Truck" },
    { id: 3, make: "Toyota", model: "Prius", category: "Hybrid" },
  ];

  it("renders dynamic options and calls onApply/onReset", () => {
    const onApply = jest.fn();
    const onReset = jest.fn();
    render(<FiltersPanel vehicles={vehicles} onApply={onApply} onReset={onReset} />);

    // there should be three comboboxes
    const combos = screen.getAllByRole("combobox");
    expect(combos.length).toBeGreaterThanOrEqual(3);
    // apply
    fireEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(onApply).toHaveBeenCalled();
    // reset
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(onReset).toHaveBeenCalled();
  });
});

// Get in /frontend then run 'npx jest' to run this test
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

test("renders CustomNavbar component", () => {
    const { getByText } = render(<App />);
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Recipes")).toBeInTheDocument();
    expect(getByText("Pictures")).toBeInTheDocument();
    expect(getByText("Videos")).toBeInTheDocument();
});

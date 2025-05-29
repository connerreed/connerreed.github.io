import React from "react";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import CustomNavbar from "../components/CustomNavbar";

// Mock hooks
jest.mock("../contexts/ThemeContext", () => ({
    useTheme: () => ({ theme: "dark", toggleTheme: jest.fn() }),
}));
jest.mock("../contexts/AuthContext", () => ({
    useAuth: () => ({
        userData: {
            first_name: "Test",
            last_name: "User",
        },
    }),
}));

const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
};

describe("CustomNavbar Component", () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("renders all navbar links", () => {
        const { getByText } = render(
            <MemoryRouter>
                <CustomNavbar />
            </MemoryRouter>
        );
        expect(getByText("Home")).toBeInTheDocument();
        expect(getByText("Recipes")).toBeInTheDocument();
        expect(getByText("Pictures")).toBeInTheDocument();
        expect(getByText("Videos")).toBeInTheDocument();
    });

    it("shows user info when logged in", () => {
        const { getByText } = render(
            <MemoryRouter>
                <CustomNavbar />
            </MemoryRouter>
        );
        expect(getByText("Test User")).toBeInTheDocument();
    });

    it("navigates on each nav click", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <CustomNavbar />
                <Routes>
                    <Route path="*" element={<LocationDisplay />} />
                </Routes>
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("Recipes"));
        expect(screen.getByTestId("location-display")).toHaveTextContent(
            "/recipes"
        );

        fireEvent.click(screen.getByText("Home"));
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        fireEvent.click(screen.getByText("Pictures"));
        expect(screen.getByTestId("location-display")).toHaveTextContent(
            "/pictures"
        );

        fireEvent.click(screen.getByText("Videos"));
        expect(screen.getByTestId("location-display")).toHaveTextContent(
            "/videos"
        );

        fireEvent.click(screen.getByText("Test User"));
        expect(screen.getByTestId("location-display")).toHaveTextContent(
            "/profile"
        );
    });

    it("toggles offcanvas navbar", () => {
        const { getByTestId } = render(
            <MemoryRouter>
                <CustomNavbar />
            </MemoryRouter>
        );
        expect(getByTestId("navbar-toggler")).toBeInTheDocument();
        fireEvent.click(getByTestId("navbar-toggler"));
        setTimeout(() => {
            expect(getByTestId("navbar-header")).toBeInTheDocument();
        }, 500);
        const offcanvasCloseButton =
            getByTestId("navbar-header").querySelector("button");
        fireEvent.click(offcanvasCloseButton);
        setTimeout(() => {
            expect(getByTestId("navbar-header")).not.toBeInTheDocument();
        }, 500);
    });
});

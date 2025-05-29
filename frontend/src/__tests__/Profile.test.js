import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "../components/Profile";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";

const mockLogout = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
    useAuth: () => ({
        logout: mockLogout,
        loading: false,
        userData: {
            first_name: "Test",
            last_name: "User",
            email: "connerdreed+testuser@gmail.com",
        },
    }),
}));

// jest.mock("../contexts/ThemeContext", () => ({
//     useTheme: () => ({
//         theme: "light",
//         toggleTheme: jest.fn(),
//     }),
// }));

jest.mock("../hooks/useApiRequest", () => ({
    __esModule: true,
    default: () => ({
        patchData: jest.fn(() => Promise.resolve()),
    }),
}));

const renderProfile = () => {
    render(
        <ThemeProvider>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </ThemeProvider>
    );
};

const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
};

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe("Profile Component", () => {
    it("displays user info", () => {
        renderProfile();
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        expect(
            screen.getByText((content) =>
                content.includes("Email: connerdreed+testuser@gmail.com")
            )
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Logout/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Toggle Dark Mode/i })
        ).toBeInTheDocument();
    });
    it("calls logout and navigates to /login", () => {
        render(
            <ThemeProvider>
                <MemoryRouter initialEntries={["/profile"]}>
                    <Routes>
                        <Route path="/login" element={<LocationDisplay />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </MemoryRouter>
            </ThemeProvider>
        );
        expect(mockLogout).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole("button", { name: /Logout/i }));
        expect(mockLogout).toHaveBeenCalled();
        expect(screen.getByTestId("location-display")).toHaveTextContent(
            "/login"
        );
    });
    it("toggles dark mode", () => {
        localStorage.setItem("theme", "light");
        render(renderProfile());
        expect(localStorage.getItem("theme")).toBe("light");
        fireEvent.click(
            screen.getByRole("button", { name: /Toggle Dark Mode/i })
        );
        expect(localStorage.getItem("theme")).toBe("dark");
        fireEvent.click(
            screen.getByRole("button", { name: /Toggle Dark Mode/i })
        );
        expect(localStorage.getItem("theme")).toBe("light");
    });
});

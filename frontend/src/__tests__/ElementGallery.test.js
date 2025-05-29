import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import ElementGallery from "../components/ElementGallery";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";

const mockElements = [
    {
        id: 1,
        recipeAuthor: "Author1",
        user: { first_name: "Ricky", last_name: "Bobby" },
    },
    {
        id: 2,
        recipeAuthor: "Author2",
        user: { first_name: "John", last_name: "Doe" },
    },
    {
        id: 3,
        recipeAuthor: "Author3",
        user: { first_name: "Jane", last_name: "Smith" },
    },
    {
        id: 4,
        recipeAuthor: "Author4",
        user: { first_name: "Alice", last_name: "Johnson" },
    },
    {
        id: 5,
        recipeAuthor: "Author5",
        user: { first_name: "Bob", last_name: "Brown" },
    },

    {
        id: 6,
        recipeAuthor: "Author6",
        user: { first_name: "Charlie", last_name: "Davis" },
    },
    {
        id: 7,
        recipeAuthor: "Author7",
        user: { first_name: "Eve", last_name: "White" },
    },
    {
        id: 8,
        recipeAuthor: "Author8",
        user: { first_name: "Frank", last_name: "Black" },
    },
];

const mockElementTypes = ["recipe", "picture", "video"];

jest.mock("../contexts/AuthContext", () => ({
    useAuth: () => ({
        authToken: "1234",
    }),
}));

jest.mock("../hooks/useApiRequest", () => ({
    __esModule: true,
    default: () => ({
        postData: jest.fn(() => Promise.resolve(mockElements)),
        deleteData: jest.fn(() => Promise.resolve()),
        currentlyLoading: false,
    }),
}));

const mockAppendNextPage = jest.fn();
jest.mock("../hooks/useFetchPagedData", () => ({
    __esModule: true,
    default: () => ({
        data: mockElements,
        loading: false,
        idToTriggerNextFetch: mockElements[mockElements.length - 1]?.id,
        initializeData: jest.fn(),
        appendNextPage: mockAppendNextPage,
    }),
}));

const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
};

const renderElementGallery = (elementType) => {
    return render(
        <ThemeProvider>
            <MemoryRouter initialEntries={[`/${elementType}s`]}>
                <ElementGallery elementType={elementType} />
                <Routes>
                    <Route path="*" element={<LocationDisplay />} />
                </Routes>
            </MemoryRouter>
        </ThemeProvider>
    );
};
// Mock IntersectionObserver for test environment
beforeAll(() => {
    global.IntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe("ElementGallery Component", () => {
    mockElementTypes.forEach((type) => {
        it(`renders with ${type}s`, () => {
            const { getByTestId } = renderElementGallery(type);
            expect(
                screen.getByText(
                    `${type.charAt(0).toUpperCase() + type.slice(1)}s`
                )
            ).toBeInTheDocument();
            expect(screen.getByTestId("location-display")).toHaveTextContent(
                `/${type}s`
            );
            expect(getByTestId("new-element-button")).toBeInTheDocument();
            expect(getByTestId("new-element-button")).toHaveTextContent(
                `New ${type}`
            );
            if (type !== "picture") {
                fireEvent.click(getByTestId("new-element-button"));
                expect(
                    screen.getByTestId("location-display")
                ).toHaveTextContent(
                    `${type}s/new` // Check if it navigates to the new element page
                );
            }
        });
    });
    it("renders elements in the gallery", () => {
        const {getByTestId} = renderElementGallery("recipe");
        mockElements.forEach((element) => {
            expect(
                getByTestId(`recipe-${element.id}`)
            ).toBeInTheDocument();
        });
    });
});

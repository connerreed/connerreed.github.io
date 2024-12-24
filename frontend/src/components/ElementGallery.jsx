import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backendURL from "../utils/backendURL";
import useFetchPagedData from "../hooks/useFetchPagedData";
import useApiRequest from "../hooks/useApiRequest";
import ConfirmModal from "./ConfirmModal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ElementCard from "./ElementCard";

const ElementGallery = ({ elementType }) => {
    const elementsApiEndpoint = `${backendURL}/api/${elementType}s/`;
    const pageSize = 12;

    const [showModal, setShowModal] = useState(false);
    const [elementIdToDelete, setElementIdToDelete] = useState(null);
    const navigate = useNavigate();
    const {
        data,
        loading,
        idToTriggerNextFetch,
        initializeData,
        appendNextPage,
    } = useFetchPagedData(elementsApiEndpoint, pageSize);
    const { deleteData } = useApiRequest();

    useEffect(() => {
        if (!data || data.length === 0) {
            appendNextPage();
        }
    }, [appendNextPage, data]);

    useEffect(() => {
        let observers = [];
        let isFetching = false; // Flag to prevent simultaneous fetches

        const handleObservation = (entries) => {
            if (isFetching) return; // Prevent duplicate fetches
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    isFetching = true; // Lock further fetches
                    appendNextPage();
                }
            });
        };

        const setupObservers = () => {
            if (!idToTriggerNextFetch || loading) return;

            const elementsToObserve = [];
            const totalPagesLoaded = Math.ceil(data.length / pageSize);
            const startIndex = (totalPagesLoaded - 1) * pageSize; // Start of the last page
            const endIndex = data.length; // End of the full list

            const currentPage = data.slice(startIndex, endIndex);

            if (currentPage.length > 0) {
                const middleIndex = Math.floor(currentPage.length / 2);
                const middleElementId = `${elementType}-${currentPage[middleIndex]?.id}`;
                const lastElementId = `${elementType}-${
                    currentPage[currentPage.length - 1]?.id
                }`;

                const middleElement = document.getElementById(middleElementId);
                const lastElement = document.getElementById(lastElementId);

                if (middleElement) elementsToObserve.push(middleElement);
                if (lastElement) elementsToObserve.push(lastElement);

                observers = elementsToObserve.map((element) => {
                    const observer = new IntersectionObserver(
                        handleObservation,
                        {
                            threshold: 1.0, // Trigger when the element is fully in view
                        }
                    );
                    observer.observe(element);
                    return observer;
                });
            }
        };

        setupObservers();

        return () => {
            observers.forEach((observer) => observer.disconnect());
            isFetching = false;
        };
    }, [
        idToTriggerNextFetch,
        loading,
        data,
        appendNextPage,
        elementType,
        pageSize,
    ]);

    const confirmDelete = () => {
        const deleteUrl = `${elementsApiEndpoint}${elementIdToDelete}/`;
        deleteData(deleteUrl);
        handleCloseModal();
        // Wait for the delete to complete before refreshing the data
        setTimeout(() => {
            initializeData();
        }, 500);
    };

    const handleShowModal = (id) => {
        setElementIdToDelete(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setElementIdToDelete(null);
        setShowModal(false);
    };

    const RecipeCardBody = ({ recipe }) => {
        return (
            <>
                {/* <div> */}
                <Card.Title className="mb-0">
                    <h4><strong>{recipe.title}</strong></h4>
                </Card.Title>
                {/* </div> */}
                {/* <Card.Text className="mb-0">
                    {recipe.user.first_name + " " + recipe.user.last_name}
                </Card.Text> */}
            </>
        );
    };

    const PictureCardBody = ({ picture }) => {
        return (
            <>
                {/* <Card.Title className="mb-0">
                    {picture.user.first_name + " " + picture.user.last_name}
                </Card.Title> */}
            </>
        );
    };

    return (
        <Container>
            {/* TODO: Add static banner across screen to hide initial picture loading? */}
            <Row className="align-items-center mb-4">
                <Col className="d-flex justify-content-start mb-2 mb-md-0">
                    {/* Empty column to maintain spacing */}
                </Col>
                <Col className="text-center mb-2 mb-md-0">
                    <h1>
                        {elementType.charAt(0).toUpperCase() +
                            elementType.slice(1) +
                            "s"}
                    </h1>
                </Col>
                <Col className="d-flex justify-content-end mb-2 mb-md-0">
                    <Button
                        variant="success"
                        className="text-nowrap"
                        onClick={() => navigate(`/${elementType}s/new`)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-plus"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                        New {elementType}
                    </Button>
                </Col>
            </Row>
            <Row>
                {/* Content Area */}
                {!loading && data?.length === 0 && (
                    <div className="d-flex justify-content-center">
                        <h1>
                            No{" "}
                            {elementType.charAt(0).toUpperCase() +
                                elementType.slice(1) +
                                "s"}{" "}
                            Found
                        </h1>
                    </div>
                )}
                {data?.length > 0 &&
                    data.map((element) => (
                        <Col
                            id={`${elementType}-${element.id}`}
                            key={element.id}
                            lg={4}
                            xs={12}
                            className="mb-4 d-flex align-items-end justify-content-center"
                        >
                            {/* <ElementCard
                                picture={element}
                                handleShowModal={handleShowModal}
                            /> */}
                            <ElementCard
                                element={element}
                                elementType={elementType}
                                handleShowModal={handleShowModal}
                                CardBody={
                                    elementType === "picture" ? (
                                        <PictureCardBody picture={element} />
                                    ) : elementType === "recipe" ? (
                                        <RecipeCardBody recipe={element} />
                                    ) : null
                                }
                            />
                        </Col>
                    ))}
            </Row>

            <ConfirmModal
                show={showModal}
                onClose={handleCloseModal}
                onCancel={handleCloseModal}
                onConfirm={confirmDelete}
            />
        </Container>
    );
};

export default ElementGallery;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import HoverVideoPlayer from "react-hover-video-player";
import Button from "react-bootstrap/Button";
import { useAuth } from "../contexts/AuthContext";

const VideoGallery = () => {
    const [loading, setLoading] = useState(true);
    const [videoList, setVideoList] = useState([]);
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const url = "http://127.0.0.1:8000/api/videos/";

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const videosResponse = await fetch(url);
                if (!videosResponse.ok) {
                    throw new Error(
                        `Failed to fetch videos: ${videosResponse.status}`
                    );
                }
                const videos = await videosResponse.json();
                setVideoList(videos);
            } catch (error) {
                console.error("Error fetching videos", error);
            }
            setLoading(false);
        };
        fetchVideos();
    }, [authToken]);

    if (loading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (videoList.length === 0) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <h1>No videos found</h1>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="align-items-center mb-4">
                <Col className="d-flex justify-content-start mb-2 mb-md-0">
                    {/* Empty column to maintain spacing */}
                </Col>
                <Col className="text-center mb-2 mb-md-0">
                    <h1>Videos</h1>
                </Col>
                <Col className="d-flex justify-content-end mb-2 mb-md-0">
                    <Button
                        variant="success"
                        className="text-nowrap"
                        onClick={() => navigate("/videos/new")}
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
                        New video
                    </Button>
                </Col>
            </Row>
            <Row>
                {videoList.map((video) => (
                    <Col key={video.id} md={4} className="mb-4">
                        <Link
                            to={`/videos/${video.id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <Card bg="secondary">
                                <Card.Body>
                                    <div className="video-card">
                                        <HoverVideoPlayer
                                            videoSrc={video.video}
                                            pausedOverlay={
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            }
                                            loadingOverlay={
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                >
                                                    <span className="visually-hidden">
                                                        Loading...
                                                    </span>
                                                </Spinner>
                                            }
                                            playbackRangeStart={0}
                                            playbackRangeEnd={5} // Play first 5 seconds
                                            muted
                                        />
                                    </div>
                                    <Card.Title>{video.title}</Card.Title>
                                    <Card.Text>
                                        By: {video.user.first_name}{" "}
                                        {video.user.last_name}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default VideoGallery;

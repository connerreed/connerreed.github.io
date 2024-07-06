import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

const Video = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = `http://127.0.0.1:8000/api/videos/${id}/`;

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchVideo = async () => {
            setLoading(true);
            try {
                const videoResponse = await fetch(url);
                if (!videoResponse.ok) {
                    throw new Error(
                        `Failed to fetch video: ${videoResponse.status}`
                    );
                }
                const video = await videoResponse.json();
                setVideo(video);
            } catch (error) {
                console.error("Error fetching video: ", error);
            }
            setLoading(false);
        };
        fetchVideo();
    }, [id, url]);

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

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
        >
            <div>
                <h1>{video.title}</h1>
                <video className="w-75" controls>
                    <source src={video.video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default Video;

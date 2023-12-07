import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import "./Gallery.css";

function Gallery({ elementList }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    }

	return (
		<Container>
			<Row>
				{elementList.map((element) => (
					<Col md={4} sm={6} xs={12} key={element.id}>
						<Card className="position-relative custom-card" onClick={() => handleImageClick(element)}>
							<Card.Img
								variant="top"
								src={require(`${element.src}`)}
							/>
							<a
								variant="primary"
								href={require(`${element.src}`)}
								download
								className="download-button"
							>
								<FontAwesomeIcon icon={faDownload} />
							</a>
						</Card>
					</Col>
				))}
			</Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="custom-modal">
                <Modal.Body>
                    {selectedImage && (
                        <img src={require(`${selectedImage.src}`)} alt="Selected" className="img-fluid custom-modal-image"/>
                    )}
                </Modal.Body>
            </Modal>
		</Container>
	);
}

export default Gallery;

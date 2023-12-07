import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from 'react-router-dom';
import "./Gallery.css";

function Gallery({ elementList, elementType }) {
	const [selectedImage, setSelectedImage] = useState(null);
	const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

	const handleImageClick = (image) => {
		if (elementType === "pictures") {
			setSelectedImage(image);
			setShowModal(true);
		} else if (elementType === "recipes") {
            navigate(`/recipes/${image.id}`);
		}
	};

	return (
		<Container>
			<Row>
				{elementList.map((element) => (
					<Col md={4} sm={6} xs={12} key={element.id}>
						<Card
							className="position-relative custom-card"
							onClick={() => handleImageClick(element)}
						>
							<Card.Img
								variant="top"
								src={require(`${element.coverSrc}`)}
							/>
                            {elementType === "recipes" && (
                                <Card.Body>{element.title}</Card.Body>
                            )}
							{elementType === "pictures" && (
								<Button
									variant="primary"
									href={require(`${element.coverSrc}`)}
									download
									className="download-button"
								>
									<FontAwesomeIcon icon={faDownload} />
								</Button>
							)}
						</Card>
					</Col>
				))}
			</Row>

			<Modal
				show={showModal}
				onHide={() => setShowModal(false)}
				centered
				className="custom-modal"
			>
				<Modal.Body>
					{selectedImage && (
						<img
							src={require(`${selectedImage.coverSrc}`)}
							alt="Selected"
							className="img-fluid custom-modal-image"
						/>
					)}
				</Modal.Body>
			</Modal>
		</Container>
	);
}

export default Gallery;

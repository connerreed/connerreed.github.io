import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import "./Gallery.css";

function Gallery({ elementList }) {
	return (
		<Container>
			<Row>
				{elementList.map((element) => (
					<Col md={4} sm={6} xs={12} key={element.id}>
						<Card className="position-relative">
							<Card.Img
								variant="top"
								src={require(`${element.src}`)}
							/>
							<Button
								variant="primary"
								href={require(`${element.src}`)}
								download
								className="download-button"
							>
								<FontAwesomeIcon icon={faDownload} />
							</Button>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
}

export default Gallery;

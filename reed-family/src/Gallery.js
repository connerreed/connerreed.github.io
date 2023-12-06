import React from "react";
import { Container, Row, Col, Card, Button} from "react-bootstrap";

function Gallery({ elementList }) {
	return (
		<Container>
			<Row>
				{elementList.map((element) => (
					<Col md={4} sm={6} xs={12} key={element.id}>
						<Card>
							<Card.Img
								variant="top"
								src={require(`${element.src}`)}
							/>
							<Card.Footer>
								<Button
									variant="primary"
									href={require(`${element.src}`)}
									download
								>
									Download
								</Button>
							</Card.Footer>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
}

export default Gallery;

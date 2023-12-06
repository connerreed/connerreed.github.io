import React from 'react';
import { Container, Row, Col, Card} from 'react-bootstrap';

function Gallery({elementList}) {
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
							{/* Additional Card content like title or buttons */}
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
}

export default Gallery;

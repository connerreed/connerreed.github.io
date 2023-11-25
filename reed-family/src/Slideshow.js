import Carousel from 'react-bootstrap/Carousel';

// Read documentation on React Bootstrap Carousel here: https://react-bootstrap.github.io/components/carousel/
function Slideshow({elementList}) {
    const interval = 5000; // ms

  return (
    <Carousel interval={`${interval}`}>
        {elementList.map(element => (
            <Carousel.Item>
                <img className="d-block w-100" src={require(`${element.src}`)} alt="Slide" />
            </Carousel.Item>
        ))}
    </Carousel>
  );
}

export default Slideshow;
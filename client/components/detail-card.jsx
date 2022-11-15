import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Schedule from './schedule';

export default function DetailCard(props) {
  const { details, inRoulette, addToRoulette } = props;
  const { id, name, categories, display_phone: phone } = details;
  const { address1, city, state, zip_code: zipCode } = details.location;
  const { open: schedule, is_open_now: isOpen } = details.hours[0];
  const styles = {
    card: {
      color: '#FFFFFF',
      border: 0,
      borderRadius: '10px'
    },
    thumbnail: {
      background: `url(${details.image_url}) no-repeat center`,
      backgroundSize: 'cover',
      borderRadius: '10px 10px 0 0',
      height: '220px'
    },
    background: {
      background: 'rgb(0 0 0 / 80%)',
      borderRadius: '0 0 10px 10px'
    },
    open: {
      color: '#00b395'
    },
    closed: {
      color: '#b33300'
    }
  };
  const address2 = `${city}, ${state} ${zipCode}`;
  const displayPhoneIcon = phone
    ? <><Card.Text as='span' className='phone-icon fas fa-phone' /><br /></>
    : null;
  const displayAddress1 = address1
    ? <>{address1}<br /></>
    : null;
  const openNow = isOpen
    ? <span style={styles.open}>Open</span>
    : <span style={styles.closed}>Closed</span>;
  const rouletteText =
    !inRoulette.some(el => el.restaurantId === id) && !inRoulette.includes(id)
      ? 'Add to Roulette'
      : 'Remove from Roulette';
  return (
    <Card className='shadow' style={styles.card}>
      <Row className='g-0'>
        <Col style={styles.thumbnail} />
      </Row>
      <Card.Body style={styles.background}>
        <Row className='flex-nowrap'>
          <Col>
            <Card.Title className='eatery-name fw-bold' >
              {name}
            </Card.Title>
          </Col>
        </Row>
        <Row>
          <Card.Subtitle className='fst-italic'>
            {categories[0].title}
          </Card.Subtitle>
        </Row>
        <Row className='mt-2'>
          <Col xs='auto'>
            {displayPhoneIcon}
            <Card.Text
                as='span'
                className='location-icon fas fa-location-dot text-center' />
          </Col>
          <Col className='p-0'>
            <Card.Text className='m-0'>
              {phone}
            </Card.Text>
            <Card.Text className='m-0'>
              {displayAddress1}{address2}
            </Card.Text>
          </Col>
        </Row>
        <hr className='my-3' />
        <Row>
          <Col className='text-center'>
            <Card.Text className='fw-bold mb-2'>
              Hours &#40;{openNow}&#41;
            </Card.Text>
            <Schedule schedule={schedule} />
          </Col>
        </Row>
        <hr className='my-3' />
        <Row className='mb-2'>
          <Col className='text-center'>
            <Button
              id={id}
              className='roulette-link border-0 p-0'
              variant='link'
              onClick={addToRoulette} >
              {rouletteText}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

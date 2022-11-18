import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DetailCard from '../components/detail-card';
import Notification from '../components/notification';
import Map from '../components/map';

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: null,
      inRoulette: [],
      inFavorites: [],
      message: '',
      eateryGeolocation: null
    };
    this.addToRoulette = this.addToRoulette.bind(this);
    this.removeFromRoulette = this.removeFromRoulette.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
  }

  addToRoulette(event) {
    const { details, inRoulette } = this.state;
    const headers = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    };
    fetch('/roulette/add', headers)
      .then(response => response.json())
      .then(data => {
        this.setState({
          inRoulette: inRoulette.concat(data.restaurantId),
          message: `${data.details.name} was added to Roulette.`
        });
      })
      .catch(err => console.error(err));
  }

  removeFromRoulette(event) {
    const { id } = event.target;
    const { details } = this.state;
    fetch(`/roulette/remove/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        this.setState({
          inRoulette: data,
          message: `${details.name} was removed from Roulette.`
        });
      })
      .catch(err => console.error(err));
  }

  addToFavorites(event) {
    const { details, inFavorites } = this.state;
    const headers = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    };
    fetch('/favorites/add', headers)
      .then(response => response.json())
      .then(data => {
        this.setState({
          inFavorites: inFavorites.concat(data.restaurantId),
          message: `${data.details.name} was added to Favorites.`
        });
      })
      .catch(err => console.error(err));
  }

  clearMessage() {
    this.setState({ message: '' });
  }

  componentDidMount() {
    const { id } = this.props;
    const url = new URL(`/detail?id=${id}`, window.location);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const inRoulette = data.inRoulette;
        const lat = data.coordinates.latitude;
        const lng = data.coordinates.longitude;
        this.setState({
          details: data,
          inRoulette,
          eateryGeolocation: { lat, lng }
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { id } = this.props;
    const {
      details,
      inRoulette, inFavorites,
      message, eateryGeolocation
    } = this.state;
    const isInRoulette = inRoulette.includes(id);
    const isInFavorites = inFavorites.includes(id);
    const displayDetail = details
      ? (
        <DetailCard
          details={details}
          isInRoulette={isInRoulette}
          addToRoulette={this.addToRoulette}
          removeFromRoulette={this.removeFromRoulette}
          isInFavorites={isInFavorites}
          addToFavorites={this.addToFavorites} />
        )
      : null;
    const displayNotification = message
      ? <Notification message={message} clearMessage={this.clearMessage} />
      : null;
    return (
      <>
        {displayNotification}
        <Container className='shadow p-0 mb-3'>
          <Map
            data={details}
            center={eateryGeolocation} />
        </Container>
        <Container className='p-0 mb-3'>
          <Row className='align-items-center p-0'>
            <Col>
              <h2 className='fw-bold mb-0'>Details</h2>
            </Col>
            <Col xs='auto'>
              <a
                className='link fw-bold text-end'
                onClick={() => history.back()} >
                Back
              </a>
            </Col>
          </Row>
        </Container>
        <Container className='p-0 mb-3'>
          <Row>
            <Col>
              {displayDetail}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResultCard from '../components/result-card';
import Notification from '../components/notification';
import Spinner from '../components/spinner';

export default class Roulette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inRoulette: [],
      inFavorites: [],
      message: ''
    };
    this.removeFromRoulette = this.removeFromRoulette.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
  }

  removeFromRoulette(event) {
    const { id } = event.target;
    const { inRoulette } = this.state;
    const eateryData = inRoulette.find(data => data.id === id);
    fetch(`/roulette/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(
        this.setState({
          inRoulette: inRoulette.filter(item => item.id !== id),
          message: `${eateryData.name} was removed from Roulette.`
        })
      )
      .catch(err => console.error(err));
  }

  addToFavorites(event) {
    const { id } = event.target;
    const { inRoulette, inFavorites } = this.state;
    const eateryData = inRoulette.find(data => data.id === id);
    const headers = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eateryData)
    };
    fetch('/favorites', headers)
      .then(response => response.json())
      .then(data => {
        const { restaurantId, details } = data;
        this.setState({
          inFavorites: inFavorites.concat(restaurantId),
          message: `${details.name} was added to Favorites.`
        });
      })
      .catch(err => console.error(err));
  }

  removeFromFavorites(event) {
    const { id } = event.target;
    const { inRoulette } = this.state;
    const eateryData = inRoulette.find(data => data.id === id);
    fetch(`/favorites/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        this.setState({
          inFavorites: data,
          message: `${eateryData.name} was removed from Roulette.`
        });
      })
      .catch(err => console.error(err));
  }

  clearMessage() {
    this.setState({ message: '' });
  }

  componentDidMount() {
    const url = new URL('/roulette', window.location);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { inRoulette, inFavorites } = data;
        this.setState({
          inRoulette,
          inFavorites
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { inRoulette, inFavorites, message } = this.state;
    const displayNotification = message
      ? <Notification message={message} clearMessage={this.clearMessage} />
      : null;
    const rouletteItems = inRoulette.map(item => {
      return {
        image: item.image_url,
        text: item.name,
        eateryId: item.id
      };
    });
    const displayRoulette = inRoulette.length > 1
      ? <Spinner rouletteItems={rouletteItems} />
      : null;
    const eateries = inRoulette.map(eatery => {
      const isInFavorites = inFavorites.includes(eatery.id);
      return (
        <ResultCard
          key={eatery.id}
          result={eatery}
          isInRoulette={true}
          removeFromRoulette={this.removeFromRoulette}
          isInFavorites={isInFavorites}
          addToFavorites={this.addToFavorites}
          removeFromFavorites={this.removeFromFavorites} />
      );
    });
    return (
      <>
        {displayNotification}
        {displayRoulette}
        <Container className='p-0 mb-3'>
          <Row className='align-items-center p-0 my-3'>
            <Col>
              <h2 className='fw-bold mb-0'>
                Roulette
              </h2>
            </Col>
            <Col xs='auto'>
              <a
                className='back-link fw-bold text-end'
                onClick={() => history.back()} >
                Back
              </a>
            </Col>
          </Row>
        </Container>
        <Container className='p-0 mb-3'>
          <Row className='gx-3 gy-3'>
            {eateries}
          </Row>
        </Container>
      </>
    );
  }
}

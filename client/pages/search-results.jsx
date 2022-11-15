import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResultCard from '../components/result-card';
import Map from '../components/map';

export default class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      inRoulette: [],
      message: '',
      clientGeolocation: null
    };
    this.addToRoulette = this.addToRoulette.bind(this);
  }

  addToRoulette(event) {
    const { id: restaurantId } = event.target;
    const { results } = this.state;
    const eateryData = results.find(result => result.id === restaurantId);
    const headers = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eateryData)
    };
    fetch('/roulette/add', headers)
      .then(response => response.json())
      .then(data => {
        const inRouletteCopy = this.state.inRoulette;
        const newInRoulette = inRouletteCopy.concat(data.restaurantId);
        this.setState({
          inRoulette: newInRoulette,
          message: `${data.details.name} was added to Roulette.`
        });
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    const url = new URL('/search-results', window.location);
    for (const key in this.props) {
      if (this.props[key]) url.searchParams.append(key, this.props[key]);
    }
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const lat = data.region.center.latitude;
        const lng = data.region.center.longitude;
        const inRoulette = data.inRoulette;
        this.setState({
          results: data.businesses,
          clientGeolocation: { lat, lng },
          inRoulette
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { results, inRoulette, clientGeolocation } = this.state;
    const eateries = results.map(result => {
      return (
        <ResultCard
          key={result.id}
          result={result}
          inRoulette={inRoulette}
          addToRoulette={this.addToRoulette} />
      );
    });
    return (
      <>
        <Container className='shadow p-0 mb-3'>
          <Map
            data={results}
            center={clientGeolocation} />
        </Container>
        <Container className='p-0 mb-3'>
          <Row className='align-items-center p-0 my-3'>
            <Col>
              <h2 className='fw-bold mb-0'>
                Results
              </h2>
            </Col>
            <Col xs='auto'>
              <a
                className='link fw-bold text-end'
                href='#' >
                New Search
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

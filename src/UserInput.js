import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Game from './Game';

function UserInput() {
  const [source, setSource] = useState({ x: 0, y: 0 });
  const [destination, setDestination] = useState({ x: 4, y: 4 });
  const [algorithmType, setAlgorithmType] = useState('');

  const generateOptions = () => {
    const options = [];
    for (let i = 0; i <= 4; i += 2) {
      for (let j = 0; j <= 4; j += 2) {
        options.push({ x: i, y: j });
      }
    }
    return options;
  };

  const sourceOptions = generateOptions();
  const destOptions = generateOptions();

  return (
    <>
      <Form>
        <Row className="mb-3">
          <Col sm={6}>
            <Form.Label style={{ color: 'brown', fontWeight: 'bold' }}>Source Address</Form.Label>
            <Form.Control
              as="select"
              value={`${source.x},${source.y}`}
              onChange={(e) => {
                const [x, y] = e.target.value.split(',').map(Number);
                setSource({ x, y });
              }}
            >
              {sourceOptions.map((option, index) => (
                <option key={index} value={`${option.x},${option.y}`}>
                  {`${option.x},${option.y}`}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col sm={6}>
            <Form.Label style={{ color: 'brown', fontWeight: 'bold' }}>Destination Address</Form.Label>
            <Form.Control
              as="select"
              value={`${destination.x},${destination.y}`}
              onChange={(e) => {
                const [x, y] = e.target.value.split(',').map(Number);
                setDestination({ x, y });
              }}
            >
              {destOptions.map((option, index) => (
                <option key={index} value={`${option.x},${option.y}`}>
                  {`${option.x},${option.y}`}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={6}>
            <Form.Label style={{ color: 'brown', fontWeight: 'bold' }}>Algorithm Type</Form.Label>
            <Form.Control
              as="select"
              value={algorithmType}
              onChange={(e) => setAlgorithmType(e.target.value)}
            >
              <option value="">Select Algorithm</option>
              <option value="ucs">UCS</option>
              <option value="a*">A*</option>
            </Form.Control>
          </Col>
        </Row>
      </Form>
      <Game
        sourceAddress={`${source.x},${source.y}`}
        destinationAddress={`${destination.x},${destination.y}`}
        algorithmType={algorithmType}
      />
    </>
  );
}

export default UserInput;

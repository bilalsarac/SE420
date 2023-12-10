import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Game from './Game';

function UserInput() {
  const [sourceAddress, setSourceAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [algorithmType, setAlgorithmType] = useState('');

  return (
    <>
    <Form>
      <Row className="mb-3">
        <Col sm={6}>
          <Form.Label style={{color:"brown", fontWeight:'bold'}}>Source Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Source"
            value={sourceAddress}
            onChange={(e) => setSourceAddress(e.target.value)}
          />
            <Form.Text id="text" muted>
        Format Example: 0,2
      </Form.Text>
        </Col>
        <Col sm={6}>
          <Form.Label style={{color:"brown", fontWeight:'bold'}} >Destination Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Destination"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
            <Form.Text id="testt" muted>
            Format Example: 0,4
      </Form.Text>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={6}>
          <Form.Label style={{color:"brown", fontWeight:'bold'}}>Algorithm Type</Form.Label>
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
    <Game sourceAddress={sourceAddress} destinationAddress = {destinationAddress} algorithmType = {algorithmType} />
    </>
  );
}

export default UserInput;

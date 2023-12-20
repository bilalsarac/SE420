import React from 'react';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import robotImage from './images/robot.png';
import brickImage from './images/brick.png'
import roadImage from './images/road.png'

function Game({ sourceAddress, destinationAddress, algorithmType }) {
  const [path, setPath] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ cost: 0, path: [] });



  const handleRunButtonClick = () => {
    const [sourcex, sourcey] = sourceAddress.split(',').map(Number);
    const [destx, desty] = destinationAddress.split(',').map(Number);

    let answer;

    if (algorithmType === 'ucs') {
      answer = uniform_cost_search(matrixData, [sourcex, sourcey], [destx, desty]);
      console.log(answer)

    } else if (algorithmType === 'a*') {
      answer = astar(matrixData, [sourcex, sourcey], [destx, desty]);
      console.log(answer)

    } else {
      console.log("else");
      return;
    }
    setPath(answer.visitedNodes);

    setCurrentIndex(0);

    // Update modal content
    setModalContent({
      cost: answer.cost,
      path: answer.path,
      visited: answer.visitedNodes
    });


  };

  const handleCloseModal = () => {
    setShowModal(false);
  };




  useEffect(() => {
    let intervalId;

    if (path.length > 0) {
      let index = 0;
      intervalId = setInterval(() => {
        setCurrentIndex(index);
        index += 1;

        if (index >= path.length) {
          setShowModal(true);
          clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [path]);



  const handleBoxClick = (rowIndex, colIndex) => {

    const nonChangeablePoints = [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 0, col: 4 },


      { row: 2, col: 0 },
      { row: 2, col: 2 },
      { row: 2, col: 4 },



      { row: 4, col: 0 },
      { row: 4, col: 2 },
      { row: 4, col: 4 },

      // Add more points as needed
    ];

    // Check if the clicked point is non-changeable
    if (nonChangeablePoints.some(point => point.row === rowIndex && point.col === colIndex)) {
      return; // Do nothing for non-changeable points
    }

    setMatrixData((prevMatrixData) => {
      const newMatrixData = prevMatrixData.map((row, i) =>
        i === rowIndex ? row.map((col, j) => (j === colIndex ? 1 - col : col)) : row
      );
      return newMatrixData;
    });
  };


  const isBoxClicked = (rowIndex, colIndex) => {
    // Check if the box at the given coordinates has been clicked
    return clickedBoxes.some((box) => box.rowIndex === rowIndex && box.colIndex === colIndex);
  };
  const [matrixData, setMatrixData] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const rows = matrixData.length;
  const columns = matrixData[0].length;
  const [clickedBoxes, setClickedBoxes] = useState([]);



  function uniform_cost_search(matrix, start, goal, maxExpandedStates = 10) {
    const directions = [[0, 2], [0, -2], [2, 0], [-2, 0]];
    console.log("uniform cost search started");

    const openSet = new PriorityQueue();
    const closedSet = new Set();
    openSet.enqueue({ cost: 0, pos: start });
    console.log("enque cost 0");

    const cameFrom = {};
    const costSoFar = { [start]: 0 };

    // New array to store visited nodes
    const visitedNodes = [];
    let expandedStates = 0;

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue().pos;

      // Add the current node to the visited nodes array
      visitedNodes.push(current);

      if (current[0] === goal[0] && current[1] === goal[1]) {
        // Reconstruct path
        const path = [];
        let temp = current;
        while (cameFrom[temp]) {
          path.push(temp);
          temp = cameFrom[temp];
        }
        path.push(start);
        return { path: path.reverse(), cost: costSoFar[current], visitedNodes: visitedNodes };
      }

      closedSet.add(JSON.stringify(current));

      for (const dir of directions) {
        const neighbor = [current[0] + dir[0], current[1] + dir[1]];
        const moveCost = dir[0] === 0 ? 2 : 1; // Adjust cost based on direction

        if (
          neighbor[0] < 0 ||
          neighbor[0] >= matrix.length ||
          neighbor[1] < 0 ||
          neighbor[1] >= matrix[0].length ||
          matrix[neighbor[0]][neighbor[1]] === 1 ||  // Check for a wall at the neighbor position
          hasWallBetween(current, neighbor) ||      // Additional check for a wall between current and neighbor
          closedSet.has(JSON.stringify(neighbor))
        ) {
          continue;
        }
        const newCost = costSoFar[current] + moveCost;
        console.log("Costs so far: " + costSoFar[current])
        console.log("Move Cost: " + moveCost)

        if (!costSoFar[neighbor] || newCost < costSoFar[neighbor]) {
          cameFrom[neighbor] = current;
          costSoFar[neighbor] = newCost;
          openSet.enqueue({ cost: newCost, pos: neighbor });
        }
      }

      expandedStates++;
      if (expandedStates >= maxExpandedStates) {
        // Stop the search after the specified number of expanded states
        return { path: [], cost: Infinity, visitedNodes: visitedNodes };
      }
    }

    return { path: [], cost: Infinity, visitedNodes: visitedNodes }; // No path found
  }

  function hasWallBetween(position1, position2) {
    const [x1, y1] = position1;
    const [x2, y2] = position2;

    // Check if there is a wall between the two positions
    if (x1 === x2) {
      // Same row
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let y = minY + 1; y < maxY; y++) {
        if (matrixData[x1][y] === 1) {
          return true; // Wall found between positions
        }
      }
    } else if (y1 === y2) {
      // Same column
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX + 1; x < maxX; x++) {
        if (matrixData[x][y1] === 1) {
          return true; // Wall found between positions
        }
      }
    }

    return false; // No wall found between positions
  }
  // PriorityQueue implementation (useful for UCS)
  class PriorityQueue {
    constructor() {
      this.elements = [];
    }

    enqueue(element) {
      if (this.isEmpty() || element.cost >= this.elements[this.elements.length - 1].cost) {
        this.elements.push(element);
      } else {
        for (let i = 0; i < this.elements.length; i++) {
          if (element.cost < this.elements[i].cost) {
            this.elements.splice(i, 0, element);
            break;
          }
        }
      }
    }

    dequeue() {
      return this.elements.shift();
    }

    isEmpty() {
      return this.elements.length === 0;
    }
  }

  function heuristic(a, b) {
    // Hamming distance heuristic
    return (a[0] !== b[0] || a[1] !== b[1]) ? 1 : 0;
  }

  function astar(array, start, goal, maxExpandedNodes = 10) {
    const directions = [[0, 2], [0, -2], [2, 0], [-2, 0]]; // Possible movement directions: right, left, down, up

    const openSet = [];
    const closedSet = new Set();
    const visitedNodes = []; // New array to store visited nodes
    let expandedNodes = 0;
    openSet.push({ f: 0, g: 0, h: heuristic(start, goal), pos: start });
    const cameFrom = {};

    const gScore = { [start]: 0 };

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift().pos;

      // Add the current node to the visited nodes array
      visitedNodes.push(current);
      expandedNodes += 1;

      if (current[0] === goal[0] && current[1] === goal[1]) {
        // Reconstruct path
        const path = [];
        let temp = current;
        while (cameFrom[temp]) {
          path.push(temp);
          temp = cameFrom[temp];
        }
        path.push(start);
        return { path: path.reverse(), cost: gScore[current], visitedNodes: visitedNodes };
      }

      closedSet.add(JSON.stringify(current));

      for (const dir of directions) {
        const neighbor = [current[0] + dir[0], current[1] + dir[1]];
        const moveCost = dir[0] === 0 ? 2 : 1; // Adjust cost based on direction

        console.log(moveCost)
        if (
          neighbor[0] < 0 ||
          neighbor[0] >= array.length ||
          neighbor[1] < 0 ||
          neighbor[1] >= array[0].length ||
          array[neighbor[0]][neighbor[1]] === 1 ||
          hasWallBetween(current, neighbor) ||
          closedSet.has(JSON.stringify(neighbor))
        ) {
          continue;
        }

        const tentativeGScore = gScore[current] + moveCost;

        if (!gScore[neighbor] || tentativeGScore < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          const h = heuristic(neighbor, goal);
          const f = tentativeGScore + h;
          openSet.push({ f, g: tentativeGScore, h, pos: neighbor });
        }
      }

      if (expandedNodes >= maxExpandedNodes) {
        // Stop the search after the specified number of expanded nodes
        return { path: [], cost: Infinity, visitedNodes: visitedNodes };
      }
    }

    return { path: [], cost: Infinity, visitedNodes: visitedNodes }; // No path found
  }



  return (
    <Container>
      <div className="container col-6 text-center">
        <h1>Rooms</h1>
        <p><img src={brickImage} alt="Brick" width="30px" height="30px" />  represents the walls</p>
        <p><img src={roadImage} alt="Brick" width="30px" height="30px" /> represents the roads(walkable areas).</p>
        <p>Wall positions can be changed by clicking the matrix points between the letters.</p>
        <Table bordered responsive>
          <tbody>
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }, (_, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleBoxClick(rowIndex, colIndex)}
                    style={{
                      backgroundColor: isBoxClicked(rowIndex, colIndex) ? 'lightblue' : 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '16px', color: "#A22206" }}> {
                        rowIndex === 0 && colIndex === 0 ? "A" :
                          rowIndex === 0 && colIndex === 2 ? "B" :
                            rowIndex === 0 && colIndex === 4 ? "C" :
                              rowIndex === 2 && colIndex === 0 ? "D" :
                                rowIndex === 2 && colIndex === 2 ? "E" :
                                  rowIndex === 2 && colIndex === 4 ? "F" :
                                    rowIndex === 4 && colIndex === 0 ? "G" :
                                      rowIndex === 4 && colIndex === 2 ? "H" :
                                        rowIndex === 4 && colIndex === 4 ? "I" :

                                          `[${rowIndex},${colIndex}]`


                      }</span>
                    </div>
                    {matrixData[rowIndex][colIndex] === 1 ? (
                      <img src={brickImage} alt="Brick" width="30px" height="30px" />
                    ) : (
                      <img src={roadImage} alt="Brick" width="30px" height="30px" />
                    )}
                    {currentIndex < path.length && path[currentIndex][0] === rowIndex && path[currentIndex][1] === colIndex ? (
                      <img src={robotImage} alt="Robot" width="30px" height="30px" />
                    ) : null}

                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="warning" onClick={handleRunButtonClick}>
          Run
        </Button>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Path Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Cost: {modalContent.cost}</p>
            <p>Solution Path: {modalContent.path.join(' -> ')}</p>
            <p>Visited Nodes: {modalContent.visited != null ? modalContent.visited.join(' -> ') : null}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>


    </Container>

  );
}

export default Game;

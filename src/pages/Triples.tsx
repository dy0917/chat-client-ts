import { Button, Col, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

// wrap around logged-in user only routes to protect them
function Triple() {
  const row = 12;
  const col = 12;
  const mapTemplate = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const types = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

  const flattenMap = mapTemplate.flat(Infinity);
  const emptyFields = flattenMap
    .map((t, index) => (t !== 0 ? index : undefined))
    .filter((t) => t !== undefined);

  const amountOfElements = flattenMap.filter((e) => e == 0);

  const times = Math.floor(amountOfElements.length / 3 / types.length);
  const left = (amountOfElements.length / 3) % types.length;

  const getRandomElements = (elements: string[], left: number) => {
    const resultElements = [];
    for (let i = 0; i < left; i++) {
      resultElements.push(
        elements[Math.floor(Math.random() * elements.length)]
      );
    }
    return resultElements;
  };

  const getTimesOfElements = (elements: string[], times: number) => {
    let resultElements: string[] = [];
    for (let i = 0; i < times; i++) {
      resultElements = resultElements.concat(elements);
    }
    return resultElements;
  };

  const mapWithTypes = [
    ...getTimesOfElements(types, times),
    ...getRandomElements(types, left),
  ];

  const mapWithElements = shuffle([
    ...getTimesOfElements(mapWithTypes, 3),
    ...getTimesOfElements(mapWithTypes, 3),
  ]);

  const inserEmptyField = (
    emptyFields: Array<number | undefined>,
    elements: Array<string | undefined>
  ) => {
    emptyFields.forEach((element) => {
      elements.splice(element!, 0, undefined);
    });
    return elements;
  };

  function shuffle(array: string[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const [finalElementMap, setElementMap] = useState(
    inserEmptyField(emptyFields, mapWithElements)
  );

  const [seletedElements, setSelectedElements] = useState<
    Array<string | undefined>
  >([]);

  const [displayResult, setDisplayResult] = useState<Array<any>>([]);

  useEffect(() => {
    const result = seletedElements
      .sort()
      .reduce(
        (
          result: { [key: string]: Array<string | undefined> },
          e: string | undefined
        ) => {
          result[e!] = result[e!] ? [...result[e!], e] : (result[e!] = [e!]);
          if (result[e!].length === 3) {
            result[e!] = [];
          }
          return result;
        },
        {}
      );
    const elements = Object.values(result).flat(Infinity);
    setDisplayResult(elements);
    if (elements.length > 7) {
      console.log('lose');
    }
  }, [seletedElements]);

  const layerElements = (finalElementMap: any, mapSize = 144) => {
    const layerElements = [];
    for (let i = 0; i < finalElementMap.length / mapSize; i++) {
      layerElements.push(finalElementMap.slice(i * mapSize, (i + 1) * mapSize));
    }
    return layerElements;
  };

  const onClick = (index: number) => {
    const tFullElementMap = finalElementMap;
    const selectedElement = tFullElementMap[index];
    setSelectedElements([...seletedElements, selectedElement]);
    tFullElementMap[index] = undefined;
    setElementMap(tFullElementMap);
  };

  const getLayerElements = (demoMap: any, row: number, col: number) => {
    let buttons: any = [];
    layerElements(demoMap, row * col).forEach(
      (_layerElements, index) =>
        (buttons = [...buttons, ...getButtons(_layerElements, index, row, col)])
    );
    return buttons;
  };

  const buttonDisable = (
    id: number,
    layer: number,
    row: number,
    col: number
  ) => {
    const mapSize = row * col;
    if (id < mapSize) return false;
    const top = id - mapSize;

    //bottom right
    if (id % mapSize == mapSize - 1) {
      return !!finalElementMap[top];
    }
    //bottom left
    const topRight = id - mapSize + 1;
    if (id % mapSize == mapSize - row) {
      return !!finalElementMap[top] || !!finalElementMap[topRight];
    }
    //right col
    const down = id - mapSize + row;
    if (id % row == row - 1) {
      return !!finalElementMap[top] || !!finalElementMap[down];
    }
    //bottom row
    if (mapSize * (layer + 1) - row < id && id < mapSize * (layer + 1)) {
      return !!finalElementMap[top] || !!finalElementMap[topRight];
    }
    const downRight = id - mapSize + row + 1;

    return (
      !!finalElementMap[top] ||
      !!finalElementMap[topRight] ||
      !!finalElementMap[down] ||
      !!finalElementMap[downRight]
    );
  };

  const getButtons = (
    _layerElements: any,
    layer: number,
    row: number,
    col: number
  ) => {
    const buttons = [];
    const mapsize = row * col;
    const buttonWidth = 40;
    const buttonHeight = 40;

    for (let i = 0; i < _layerElements.length; i++) {
      const left = (i % row) * buttonWidth + (layer * buttonWidth) / 2 + 'px';
      const top =
        Math.floor(i / row) * buttonHeight + (layer * buttonHeight) / 2 + 'px';
      const buttonId = layer * mapsize + i;
      buttons.push(
        _layerElements[i] ? (
          <Button
            key={buttonId}
            id={buttonId.toString()}
            onClick={() => onClick(buttonId)}
            style={{
              position: 'absolute',
              left,
              top,
              zIndex: `-${layer}`,
              minWidth: `${buttonWidth}px`,
              minHeight: `${buttonHeight}px`,
            }}
            disabled={buttonDisable(buttonId, layer, row, col)}
          >{`${_layerElements[i]}`}</Button>
        ) : (
          <span
            key={buttonId}
            id={buttonId.toString()}
            style={{
              position: 'absolute',
              left,
              top,
              zIndex: `-100`,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          ></span>
        )
      );
    }
    return buttons;
  };
  return (
    <>
      <Container className="mt-2 ps-5 pt-5">
        <Row>
          <Col style={{ position: 'relative' }}>
            {getLayerElements(finalElementMap, row, col)}
          </Col>
        </Row>
      </Container>

      <Container
        className="mt-2 ps-5"
        style={{ top: 720, position: 'absolute' }}
      >
        <Row>
          <Col style={{ position: 'relative' }}>
            {displayResult.map((r, index) => (
              <Button key={index} id={index.toString()}>
                {r}
              </Button>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Triple;

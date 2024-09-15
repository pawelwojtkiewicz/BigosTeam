// const testCoords: Coords = [ 49.78162, 19.04727 ];
const getCurrentUserPosition = (setPositionCallback: (pos: [number, number]) => void) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const pos = position ?? [49.768535, 19.038870]
    // setPositionCallback(testCoords);
    setPositionCallback([pos.coords.latitude, pos.coords.longitude]);
  });
};

export default getCurrentUserPosition

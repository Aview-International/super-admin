// import React, { useRef, useState, useEffect } from 'react';

// const cornerSize = 10; // Size of the draggable corner area for resizing

// const VideoAnnotator = ({ videoUrl, addRectangle, onRectangleAdded }) => {
//   const canvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [isMoving, setIsMoving] = useState(false);
//   const [isResizing, setIsResizing] = useState(false);
//   const [selectedRectIndex, setSelectedRectIndex] = useState(null);
//   const [dragStartPoint, setDragStartPoint] = useState(null);
//   const [resizeCorner, setResizeCorner] = useState(null);
//   const [rectangles, setRectangles] = useState([]);
//   const [currentRect, setCurrentRect] = useState(null);

//   useEffect(() => {
//     if (addRectangle) {
//       // Add a new rectangle with default dimensions
//       const newRect = {
//         start: { x: 100, y: 100 }, // Example starting point
//         end: { x: 200, y: 200 }, // Example ending point
//       };

//       // Clear existing rectangles and add the new one
//       setRectangles([newRect]);
//       setCurrentRect(null);
//       onRectangleAdded(); // Notify parent that rectangle has been added
//     }
//   }, [addRectangle, onRectangleAdded]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     const drawRectangles = () => {
//       context.clearRect(0, 0, canvas.width, canvas.height);
//       rectangles.forEach((rect, index) => {
//         context.beginPath();
//         context.rect(rect.start.x, rect.start.y, rect.end.x - rect.start.x, rect.end.y - rect.start.y);
//         context.strokeStyle = selectedRectIndex === index ? 'blue' : 'green';
//         context.stroke();
//       });

//       if (currentRect) {
//         context.beginPath();
//         context.rect(currentRect.start.x, currentRect.start.y, currentRect.end.x - currentRect.start.x, currentRect.end.y - currentRect.start.y);
//         context.strokeStyle = 'red';
//         context.stroke();
//       }
//     };

//     drawRectangles();
//   }, [rectangles, currentRect, selectedRectIndex]);

//   const checkForResizeCorner = (x, y, rect) => {
//     if (!rect) return null;
//     const { start, end } = rect;

//     if (Math.abs(start.x - x) < cornerSize && Math.abs(start.y - y) < cornerSize) return 'tl';
//     if (Math.abs(end.x - x) < cornerSize && Math.abs(start.y - y) < cornerSize) return 'tr';
//     if (Math.abs(start.x - x) < cornerSize && Math.abs(end.y - y) < cornerSize) return 'bl';
//     if (Math.abs(end.x - x) < cornerSize && Math.abs(end.y - y) < cornerSize) return 'br';

//     return null;
//   };

//   const handleMouseDown = (e) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     let handled = false;

//     for (let i = 0; i < rectangles.length; i++) {
//       const corner = checkForResizeCorner(x, y, rectangles[i]);
//       if (corner) {
//         setIsResizing(true);
//         setResizeCorner(corner);
//         setSelectedRectIndex(i);
//         handled = true;
//         break;
//       }

//       if (x >= rectangles[i].start.x && x <= rectangles[i].end.x && y >= rectangles[i].start.y && y <= rectangles[i].end.y) {
//         setIsMoving(true);
//         setSelectedRectIndex(i);
//         handled = true;
//         break;
//       }
//     }

//     // if (!handled) {
//     //   setIsDrawing(true);
//     //   setCurrentRect({ start: { x, y }, end: { x, y } });
//     // }

//     setDragStartPoint({ x, y });
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing && !isMoving && !isResizing) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     if (isDrawing) {
//       setCurrentRect({ ...currentRect, end: { x, y } });
//     } else if (isMoving) {
//       const dx = x - dragStartPoint.x;
//       const dy = y - dragStartPoint.y;
//       const rect = rectangles[selectedRectIndex];
//       const updatedRect = {
//         start: { x: rect.start.x + dx, y: rect.start.y + dy },
//         end: { x: rect.end.x + dx, y: rect.end.y + dy },
//       };

//       setRectangles([
//         ...rectangles.slice(0, selectedRectIndex),
//         updatedRect,
//         ...rectangles.slice(selectedRectIndex + 1),
//       ]);
//       setDragStartPoint({ x, y });
//     } else if (isResizing) {
//       const rect = rectangles[selectedRectIndex];
//       let updatedRect = { ...rect };

//       switch (resizeCorner) {
//         case 'tl':
//           updatedRect.start = { x, y };
//           break;
//         case 'tr':
//           updatedRect.start.y = y;
//           updatedRect.end.x = x;
//           break;
//         case 'bl':
//           updatedRect.start.x = x;
//           updatedRect.end.y = y;
//           break;
//         case 'br':
//           updatedRect.end = { x, y };
//           break;
//         default:
//           break;
//       }

//       setRectangles([
//         ...rectangles.slice(0, selectedRectIndex),
//         updatedRect,
//         ...rectangles.slice(selectedRectIndex + 1),
//       ]);
//     }
//   };

//   const handleMouseUp = () => {
//     if (isDrawing && currentRect) {
//       setRectangles([...rectangles, currentRect]);
//       setCurrentRect(null);
//     }

//     setIsDrawing(false);
//     setIsMoving(false);
//     setIsResizing(false);
//     setSelectedRectIndex(null);
//     setResizeCorner(null);
//     setDragStartPoint(null);
//   };

//   return (
//     <div>
//       <video width="800" height="450" style={{ background: 'black' }} controls>
//         <source src={videoUrl} type="video/mp4" />
//       </video>
//       <canvas
//         ref={canvasRef}
//         width="800"
//         height="450"
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', zIndex: 10 }}
//       />
//     </div>
//   );
// };

// export default VideoAnnotator;

import React, { useRef, useState, useEffect } from 'react';

const cornerSize = 10; // Size of the draggable corner area for resizing

const VideoAnnotator = ({ videoUrl, addRectangle, onRectangleAdded, videoRef }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedRectIndex, setSelectedRectIndex] = useState(null);
  const [dragStartPoint, setDragStartPoint] = useState(null);
  const [resizeCorner, setResizeCorner] = useState(null);
  const [rectangles, setRectangles] = useState([]);
  const [currentRect, setCurrentRect] = useState(null);


  useEffect(() => {
    if (addRectangle) {
      // Add a new rectangle with default dimensions
      const newRect = {
        start: { x: 100, y: 100 }, // Example starting point
        end: { x: 200, y: 200 }, // Example ending point
      };

      // Clear existing rectangles and add the new one
      setRectangles([newRect]);
      setCurrentRect(null);
      onRectangleAdded(); // Notify parent that rectangle has been added
    }
  }, [addRectangle, onRectangleAdded]);

    useEffect(() => {
        if (videoRef){
            console.log(videoRef);

        }
    },[videoRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawRectangles = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      rectangles.forEach((rect, index) => {
        context.beginPath();
        context.rect(rect.start.x, rect.start.y, rect.end.x - rect.start.x, rect.end.y - rect.start.y);
        context.strokeStyle = selectedRectIndex === index ? 'blue' : 'red';
        context.stroke();
      });

      if (currentRect) {
        context.beginPath();
        context.rect(currentRect.start.x, currentRect.start.y, currentRect.end.x - currentRect.start.x, currentRect.end.y - currentRect.start.y);
        context.strokeStyle = 'red';
        context.stroke();
      }
    };

    drawRectangles();
  }, [rectangles, currentRect, selectedRectIndex]);

  const checkForResizeCorner = (x, y, rect) => {
    if (!rect) return null;
    const { start, end } = rect;

    if (Math.abs(start.x - x) < cornerSize && Math.abs(start.y - y) < cornerSize) return 'tl';
    if (Math.abs(end.x - x) < cornerSize && Math.abs(start.y - y) < cornerSize) return 'tr';
    if (Math.abs(start.x - x) < cornerSize && Math.abs(end.y - y) < cornerSize) return 'bl';
    if (Math.abs(end.x - x) < cornerSize && Math.abs(end.y - y) < cornerSize) return 'br';

    return null;
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let handled = false;

    for (let i = 0; i < rectangles.length; i++) {
      const corner = checkForResizeCorner(x, y, rectangles[i]);
      if (corner) {
        setIsResizing(true);
        setResizeCorner(corner);
        setSelectedRectIndex(i);
        handled = true;
        break;
      }

      if (x >= rectangles[i].start.x && x <= rectangles[i].end.x && y >= rectangles[i].start.y && y <= rectangles[i].end.y) {
        setIsMoving(true);
        setSelectedRectIndex(i);
        handled = true;
        break;
      }
    }

    // if (!handled) {
    //   setIsDrawing(true);
    //   setCurrentRect({ start: { x, y }, end: { x, y } });
    // }

    setDragStartPoint({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && !isMoving && !isResizing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing) {
      setCurrentRect({ ...currentRect, end: { x, y } });
    } else if (isMoving) {
      const dx = x - dragStartPoint.x;
      const dy = y - dragStartPoint.y;
      const rect = rectangles[selectedRectIndex];
      const updatedRect = {
        start: { x: rect.start.x + dx, y: rect.start.y + dy },
        end: { x: rect.end.x + dx, y: rect.end.y + dy },
      };

      setRectangles([
        ...rectangles.slice(0, selectedRectIndex),
        updatedRect,
        ...rectangles.slice(selectedRectIndex + 1),
      ]);
      setDragStartPoint({ x, y });
    } else if (isResizing) {
      const rect = rectangles[selectedRectIndex];
      let updatedRect = { ...rect };

      switch (resizeCorner) {
        case 'tl':
          updatedRect.start = { x, y };
          break;
        case 'tr':
          updatedRect.start.y = y;
          updatedRect.end.x = x;
          break;
        case 'bl':
          updatedRect.start.x = x;
          updatedRect.end.y = y;
          break;
        case 'br':
          updatedRect.end = { x, y };
          break;
        default:
          break;
      }

      setRectangles([
        ...rectangles.slice(0, selectedRectIndex),
        updatedRect,
        ...rectangles.slice(selectedRectIndex + 1),
      ]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect) {
      setRectangles([...rectangles, currentRect]);
      setCurrentRect(null);
    }

    setIsDrawing(false);
    setIsMoving(false);
    setIsResizing(false);
    setSelectedRectIndex(null);
    setResizeCorner(null);
    setDragStartPoint(null);
  };

  return (
    <div>
      <video ref={videoRef} width="800" height="450" style={{ background: 'black' }}>
        <source src={videoUrl} type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        width="800"
        height="450"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', zIndex: 10 }}
      />
    </div>
  );
};

export default VideoAnnotator;
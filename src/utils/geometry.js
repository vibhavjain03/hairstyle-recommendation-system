// geometry.js

// Calculate Euclidean distance between two points
const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const calculateBiometrics = (landmarks, box) => {
  const points = landmarks.positions;
  
  // Basic bounding box metrics
  const faceHeight = box.height;
  const faceWidth = box.width;
  
  // Cheekbone width (Points 0 and 16 in the 68-point model)
  const cheekboneWidth = getDistance(points[0], points[16]);
  
  // Jawline width (Points 4 and 12)
  const jawWidth = getDistance(points[4], points[12]);
  
  // Ratios
  const widthToHeightRatio = faceWidth / faceHeight;
  const jawToCheekRatio = jawWidth / cheekboneWidth;
  
  // Determine Face Shape
  let shape = 'Oval';
  
  if (widthToHeightRatio > 0.85) {
    if (jawToCheekRatio > 0.8) {
      shape = 'Square';
    } else {
      shape = 'Round';
    }
  } else {
    // Longer faces
    if (jawToCheekRatio > 0.8) {
      shape = 'Rectangle';
    } else if (jawToCheekRatio < 0.65) {
      shape = 'Heart / Diamond';
    } else {
      shape = 'Oval';
    }
  }
  
  return {
    faceHeight: faceHeight.toFixed(1),
    faceWidth: faceWidth.toFixed(1),
    cheekboneWidth: cheekboneWidth.toFixed(1),
    jawWidth: jawWidth.toFixed(1),
    widthToHeightRatio: widthToHeightRatio.toFixed(2),
    shape
  };
};

export const getRecommendations = (shape) => {
  const recommendations = {
    'Square': {
      styles: ['Short Back and Sides', 'Textured Comb Over', 'Buzz Cut'],
      grooming: 'Keep the sides tight to emphasize your strong jawline. A light stubble works well.'
    },
    'Round': {
      styles: ['Pompadour', 'Faux Hawk', 'Quiff'],
      grooming: 'Add volume on top to elongate the face. Keep sides short.'
    },
    'Oval': {
      styles: ['Classic Taper', 'Crew Cut', 'Push Back'],
      grooming: 'Most styles work. Avoid fringes that cover the forehead, as it can make the face look rounder.'
    },
    'Rectangle': {
      styles: ['Side Part', 'Buzz Cut', 'Fringe'],
      grooming: 'Avoid too much volume on top. A well-kept beard can add width to the jaw.'
    },
    'Heart / Diamond': {
      styles: ['Textured Fringe', 'Slicked Back', 'Messy Pomp'],
      grooming: 'Use a beard to add volume to the lower half of the face and balance the wider cheekbones.'
    }
  };
  
  return recommendations[shape] || recommendations['Oval'];
};

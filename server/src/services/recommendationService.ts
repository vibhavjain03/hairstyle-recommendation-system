import Hairstyle, { IHairstyle } from '../models/Hairstyle.js';

interface RecommendationResult {
  hairstyles: Array<{
    hairstyle: IHairstyle;
    score: number;
  }>;
  groomingTips: string;
}

const GROOMING_TIPS_MAP: Record<string, string> = {
  Square: 'Keep the sides tight to emphasize your strong jawline. A light stubble or neat beard works well.',
  Round: 'Add volume on top to elongate the face. Keep sides short and close to the head.',
  Oval: 'Most styles work great with your symmetrical structure. Avoid overly long fringes that hide your forehead.',
  Rectangle: 'Avoid excessive vertical volume on top. A side part or horizontal fringe adds balanced width.',
  Oblong: 'Avoid excessive vertical volume on top. A side part or horizontal fringe adds balanced width.',
  Heart: 'Use forward layers or a soft beard to add volume to the chin area and balance wider cheekbones.',
  Diamond: 'Add volume at the jawline or forehead with textured fringe styles to soften sharp cheekbone angles.'
};

export const generateRecommendations = async (
  faceShape: string,
  gender?: string
): Promise<RecommendationResult> => {
  // Normalize shape string (e.g., "Heart / Diamond" -> "Heart")
  const normalizedShape = faceShape.includes('Heart') ? 'Heart' : faceShape.includes('Rectangle') ? 'Oblong' : faceShape;

  const query: any = {
    faceShapesSuited: { $in: [normalizedShape, faceShape, 'Oval'] }
  };

  if (gender && gender !== 'unisex') {
    query.gender = { $in: [gender, 'unisex'] };
  }

  let matchedStyles = await Hairstyle.find(query).limit(6);

  if (matchedStyles.length === 0) {
    matchedStyles = await Hairstyle.find({}).limit(6);
  }

  const items = matchedStyles.map((style, index) => ({
    hairstyle: style,
    score: Number((1.0 - index * 0.05).toFixed(2))
  }));

  const groomingTips = GROOMING_TIPS_MAP[normalizedShape] || GROOMING_TIPS_MAP['Oval'];

  return {
    hairstyles: items,
    groomingTips
  };
};

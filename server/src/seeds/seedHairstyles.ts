import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Hairstyle from '../models/Hairstyle.js';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedHairstyles = [
  // OVAL
  {
    name: 'Classic Taper Fade',
    description: 'A clean, timeless haircut with short sides gradually fading down to the skin and a medium-length structured top.',
    faceShapesSuited: ['Oval'],
    tags: ['Classic', 'Professional', 'Short'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80'
  },
  {
    name: 'Textured Crew Cut',
    description: 'Short cropped hair on top with textured layers, low maintenance yet sharp and accentuating natural facial symmetry.',
    faceShapesSuited: ['Oval'],
    tags: ['Low Maintenance', 'Short', 'Modern'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80'
  },
  {
    name: 'Slicked Push Back',
    description: 'Medium length hair combed back smoothly using high-hold pomade, highlighting high cheekbones and balanced proportions.',
    faceShapesSuited: ['Oval', 'Round'],
    tags: ['Slick', 'Formal', 'Medium'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80'
  },
  {
    name: 'Long Layered Waves',
    description: 'Cascading soft layers that frame the oval structure effortlessly without shortening the silhouette.',
    faceShapesSuited: ['Oval', 'Heart'],
    tags: ['Long', 'Waves', 'Versatile'],
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&q=80'
  },

  // ROUND
  {
    name: 'Modern High Pompadour',
    description: 'High volume styled upwards and back, elongating round facial features and creating vertical symmetry.',
    faceShapesSuited: ['Round'],
    tags: ['High Volume', 'Trendy', 'Statement'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&q=80'
  },
  {
    name: 'Textured Faux Hawk',
    description: 'Short sides with a prominent upward central ridge that adds height and angularity to rounded contours.',
    faceShapesSuited: ['Round'],
    tags: ['Edgy', 'Volume', 'Short'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1517832606589-71574620396d?w=500&q=80'
  },
  {
    name: 'Voluminous Quiff',
    description: 'Brushed up and backwards at the front hairline to create strong vertical lines and reduce visible face width.',
    faceShapesSuited: ['Round', 'Square'],
    tags: ['Quiff', 'Volume', 'Modern'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80'
  },
  {
    name: 'Asymmetrical Bob',
    description: 'A sharp angled bob cut longer in the front to slim the cheekbones and lengthen round features.',
    faceShapesSuited: ['Round'],
    tags: ['Bob', 'Angled', 'Chic'],
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80'
  },

  // SQUARE
  {
    name: 'Short Back & Sides Fade',
    description: 'Ultra clean skin fade on the sides with short textured top, emphasizing a strong, masculine jawline.',
    faceShapesSuited: ['Square'],
    tags: ['Clean', 'Fade', 'Masculine'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&q=80'
  },
  {
    name: 'Textured Comb Over',
    description: 'Side parted hair with a natural flow across the forehead to soften sharp jaw angles while maintaining structure.',
    faceShapesSuited: ['Square'],
    tags: ['Side Part', 'Professional', 'Textured'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80'
  },
  {
    name: 'Induction Buzz Cut',
    description: 'Minimalist uniform short buzz cut that highlights a prominent square jaw and masculine facial structure.',
    faceShapesSuited: ['Square', 'Oval'],
    tags: ['Buzz Cut', 'Minimalist', 'Athletic'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&q=80'
  },
  {
    name: 'Soft Curtain Waves',
    description: 'Center parted soft waves that fall lightly around the jawline to soften angular features naturally.',
    faceShapesSuited: ['Square', 'Oblong'],
    tags: ['Curtains', 'Soft', 'Medium'],
    gender: 'unisex',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80'
  },

  // HEART
  {
    name: 'Textured Crop Fringe',
    description: 'Forward brushed crop fringe that covers wider forehead areas and balances a narrower chin.',
    faceShapesSuited: ['Heart'],
    tags: ['Crop', 'Fringe', 'Forward Brush'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80'
  },
  {
    name: 'Slicked Back Undercut',
    description: 'Disconnected undercut with slick medium hair flowing straight back, drawing focus toward eyes and cheekbones.',
    faceShapesSuited: ['Heart', 'Oval'],
    tags: ['Undercut', 'Slick', 'Bold'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=500&q=80'
  },
  {
    name: 'Messy Pompadour',
    description: 'Relaxed, textured volume on top with soft sides that soften a pointed chin and balance wider cheekbones.',
    faceShapesSuited: ['Heart'],
    tags: ['Messy', 'Casual', 'Volume'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80'
  },
  {
    name: 'Shoulder Length Shag with Bangs',
    description: 'Feathered layers with curtain bangs that add width around the jaw and lower cheek area.',
    faceShapesSuited: ['Heart'],
    tags: ['Shag', 'Bangs', 'Medium'],
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80'
  },

  // OBLONG / RECTANGLE
  {
    name: 'Classic Side Part',
    description: 'A traditional low-profile side part that adds horizontal width and breaks up vertical facial length.',
    faceShapesSuited: ['Oblong', 'Rectangle'],
    tags: ['Classic', 'Side Part', 'Low Profile'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&q=80'
  },
  {
    name: 'Textured French Crop',
    description: 'Blunt or textured horizontal fringe over the forehead to visually reduce face length.',
    faceShapesSuited: ['Oblong', 'Rectangle'],
    tags: ['French Crop', 'Fringe', 'Short'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80'
  },
  {
    name: 'Full Beard with Ivy League Cut',
    description: 'Neat top cut combined with a dense beard to add width and fullness to the lower half of an elongated face.',
    faceShapesSuited: ['Oblong', 'Rectangle'],
    tags: ['Beard', 'Ivy League', 'Fullness'],
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80'
  },
  {
    name: 'Mid-Length Layered Bob with Bangs',
    description: 'A textured chin-length bob with horizontal bangs that creates width and softens rectangular proportions.',
    faceShapesSuited: ['Oblong', 'Rectangle'],
    tags: ['Bob', 'Bangs', 'Mid-Length'],
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hairstyle_recommendation';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB');

    await Hairstyle.deleteMany({});
    console.log('[Seed Script] Existing hairstyles cleared');

    const created = await Hairstyle.insertMany(seedHairstyles);
    console.log(`[Seed Script] Successfully seeded ${created.length} hairstyles!`);

    await mongoose.disconnect();
    console.log('[Seed Script] Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedDB();

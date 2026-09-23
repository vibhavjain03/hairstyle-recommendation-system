import mongoose, { Schema, Document } from 'mongoose';

export interface IHairstyle extends Document {
  name: string;
  description: string;
  faceShapesSuited: string[];
  imageUrl: string;
  tags: string[];
  gender: 'male' | 'female' | 'unisex';
  createdAt: Date;
  updatedAt: Date;
}

const HairstyleSchema: Schema = new Schema<IHairstyle>(
  {
    name: {
      type: String,
      required: [true, 'Please provide hairstyle name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide hairstyle description']
    },
    faceShapesSuited: {
      type: [String],
      required: [true, 'Please provide suited face shapes'],
      enum: ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Rectangle', 'Diamond']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      default: 'unisex'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IHairstyle>('Hairstyle', HairstyleSchema);

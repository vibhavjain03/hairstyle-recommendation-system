import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendationItem {
  hairstyle: mongoose.Types.ObjectId;
  score: number;
}

export interface IRecommendation extends Document {
  scanId: mongoose.Types.ObjectId;
  hairstyles: IRecommendationItem[];
  groomingTips: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema = new Schema<IRecommendation>(
  {
    scanId: {
      type: Schema.Types.ObjectId,
      ref: 'Scan',
      required: true
    },
    hairstyles: [
      {
        hairstyle: {
          type: Schema.Types.ObjectId,
          ref: 'Hairstyle',
          required: true
        },
        score: {
          type: Number,
          default: 1.0
        }
      }
    ],
    groomingTips: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);

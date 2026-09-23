import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId?: mongoose.Types.ObjectId;
  recommendationId: mongoose.Types.ObjectId;
  hairstyleId?: mongoose.Types.ObjectId;
  liked: boolean;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    recommendationId: {
      type: Schema.Types.ObjectId,
      ref: 'Recommendation',
      required: true
    },
    hairstyleId: {
      type: Schema.Types.ObjectId,
      ref: 'Hairstyle',
      required: false
    },
    liked: {
      type: Boolean,
      required: true
    },
    comment: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);

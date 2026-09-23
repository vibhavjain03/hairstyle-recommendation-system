import mongoose, { Schema, Document } from 'mongoose';

export interface IScan extends Document {
  userId?: mongoose.Types.ObjectId;
  uploadedImageUrl: string;
  detectedFaceShape: string;
  landmarkData: Record<string, any>;
  metrics: {
    faceHeight?: number;
    faceWidth?: number;
    cheekboneWidth?: number;
    jawWidth?: number;
    widthToHeightRatio?: number;
    symmetryScore?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ScanSchema: Schema = new Schema<IScan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    uploadedImageUrl: {
      type: String,
      required: [true, 'Uploaded image URL is required']
    },
    detectedFaceShape: {
      type: String,
      required: [true, 'Detected face shape is required']
    },
    landmarkData: {
      type: Schema.Types.Mixed,
      default: {}
    },
    metrics: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IScan>('Scan', ScanSchema);

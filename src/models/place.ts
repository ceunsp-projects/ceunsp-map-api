import mongoose, { Schema } from 'mongoose';

export interface IPlaceModel {
  name: string,
  location: {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta:  number
  },
  mainPicture: string;
  pictures: string[];
  items: string[];
}

const PlaceSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    location: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta:  Number
    },
    mainPicture: {
      type: String
    },
    pictures: [String],
    items: [String],
  },
  {
    autoIndex: true,
    timestamps: true
  }
);

const Place = mongoose.model<IPlaceModel>('place', PlaceSchema);
export default Place;

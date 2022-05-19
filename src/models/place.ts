import mongoose, { Schema } from 'mongoose';

interface IPlaceModel {
  name: string,
  location: {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta:  number
  },
  items: string[];
}

const PlaceSchema = new Schema({
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
  items: [String]
});

const Place = mongoose.model<IPlaceModel>('place', PlaceSchema);
export default Place;

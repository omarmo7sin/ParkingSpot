import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type:{
      type: String,
    enum:['Point'],
    required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
      },   
  },
  available: {
    type: Boolean,
    default: true,
  },
  type:{
    type: String,
    default : "street",
  }
},{
    timestamps: true,
});
parkingSpotSchema.index({ location: '2dsphere' });
export const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);
export default ParkingSpot;

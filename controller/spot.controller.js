import express from 'express';
import {json} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import ParkingSpot from '../models/parkingspot.js';
dotenv.config();


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371; 

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
};
export const getAllSpots = async (req, res) => {
    try {
        const spots = await ParkingSpot.find();
        res.status(200).json(spots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSpotById = async (req, res) => {
    try{
        const spot = await ParkingSpot.findById(req.params.id)
        if(!spot) return res.status(404).json({ message: "Spot not found" });
        res.status(200).json(spot);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const createSpot = async (req, res) => {
    const { name, longitude, latitude, isAvailable } = req.body;

    // Ensure longitude and latitude are provided
    if (!longitude || !latitude) {
        return res.status(400).json({ message: "Longitude and latitude are required" });
    }

    const spot = new ParkingSpot({
        name,
        location: {
            type: "Point",
            coordinates: [longitude, latitude] // GeoJSON format: [longitude, latitude]
        },
        isAvailable: isAvailable || true // Default to true if not provided
    });

    try {
        const newSpot = await spot.save();
        res.status(201).json(newSpot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSpot = async (req, res) => {
    const { name, longitude, latitude, isAvailable } = req.body;

    try {
        
        const updateData = {};
        if (name) updateData.name = name;
        if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

        
        if (longitude && latitude) {
            updateData.location = {
                type: "Point",
                coordinates: [longitude, latitude] // GeoJSON format: [longitude, latitude]
            };
        }

        const updatedSpot = await ParkingSpot.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true } // Return the updated document and validate the update
        );

        if (!updatedSpot) {
            return res.status(404).json({ message: "Spot not found" });
        }

        res.status(200).json(updatedSpot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteSpot = async (req, res) => {
    try {
        const deletedSpot = await ParkingSpot.findByIdAndDelete(req.params.id);
        if (!deletedSpot) return res.status(404).json({ message: "Spot not found" });
        res.status(200).json({ message: "Spot deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNearbySpots = async (req, res) => {
    const { latitude, longitude } = req.query; 
    const maxDistance = 5000; 

    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    try {
        const spots = await ParkingSpot.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)] 
                    },
                    $maxDistance: maxDistance 
                }
            }
        });

        res.status(200).json(spots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getDistanceToSpot = async (req, res) => {
    const { latitude, longitude } = req.query; // User's location
    const { id } = req.params; // Parking spot ID

    try {
        const spot = await ParkingSpot.findById(id);
        if (!spot) return res.status(404).json({ message: "Spot not found" });

        const distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            spot.location.coordinates[1], // Assuming GeoJSON format [longitude, latitude]
            spot.location.coordinates[0]
        );

        res.status(200).json({ distance: `${distance.toFixed(2)} km` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import express from 'express';
import { getDistanceToSpot,getAllSpots, getSpotById, createSpot, updateSpot, deleteSpot , getNearbySpots} from '../controller/spot.controller.js';



const router = express.Router();

router.get('/', getAllSpots);
router.get('/nearby', getNearbySpots); 
router.get('/:id/distance', getDistanceToSpot);
router.get('/:id', getSpotById);
router.post('/', createSpot);
router.post('/:id', updateSpot)
router.delete('/:id', deleteSpot);



export default router;

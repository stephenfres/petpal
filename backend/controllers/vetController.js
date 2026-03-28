const { sequelize } = require('../config/db');
const DataTypes = require('sequelize').DataTypes;
const VetLocation = require('../models/VetLocation')(sequelize, DataTypes);

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

exports.getNearbyVets = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude required',
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    // Get all active vet locations
    const vets = await VetLocation.findAll({
      where: { isActive: true },
    });

    // Calculate distance for each vet and filter by radius
    const vetsWithDistance = vets.map(vet => {
      const distance = calculateDistance(
        userLat, 
        userLng, 
        vet.latitude, 
        vet.longitude
      );
      return {
        ...vet.toJSON(),
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      };
    }).filter(vet => vet.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: vetsWithDistance.length,
      data: vetsWithDistance,
    });
  } catch (error) {
    console.error('Get Nearby Vets Error:', error);
    next(error);
  }
};

exports.getAllVets = async (req, res, next) => {
  try {
    const vets = await VetLocation.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      count: vets.length,
      data: vets,
    });
  } catch (error) {
    next(error);
  }
};

exports.getVetById = async (req, res, next) => {
  try {
    const vet = await VetLocation.findByPk(req.params.id);
    
    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Vet location not found',
      });
    }

    res.json({
      success: true,
      data: vet,
    });
  } catch (error) {
    next(error);
  }
};

exports.createVet = async (req, res, next) => {
  try {
    const vet = await VetLocation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: vet,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateVet = async (req, res, next) => {
  try {
    const vet = await VetLocation.findByPk(req.params.id);
    
    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Vet location not found',
      });
    }

    await vet.update(req.body);
    
    res.json({
      success: true,
      data: vet,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVet = async (req, res, next) => {
  try {
    const vet = await VetLocation.findByPk(req.params.id);
    
    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Vet location not found',
      });
    }

    vet.isActive = false;
    await vet.save();
    
    res.json({
      success: true,
      message: 'Vet location deleted',
    });
  } catch (error) {
    next(error);
  }
};
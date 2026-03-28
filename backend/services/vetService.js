const VetLocation = require('../models/VetLocation');
const axios = require('axios');

const findNearbyVets = async (longitude, latitude, maxDistance = 10000, type = null) => {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  };

  if (type) {
    query.type = type;
  }

  return await VetLocation.find(query).limit(20);
};

const searchVetsByLocation = async (address) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    return await findNearbyVets(lng, lat);
  } catch (error) {
    throw new Error('Failed to search veterinarians');
  }
};

const addVetLocation = async (vetData) => {
  return await VetLocation.create(vetData);
};

module.exports = {
  findNearbyVets,
  searchVetsByLocation,
  addVetLocation,
};
const { sequelize } = require('../config/db');
const DataTypes = require('sequelize').DataTypes;
const VetLocation = require('../models/VetLocation')(sequelize, DataTypes);

const sampleVets = [
  {
    name: 'Nairobi Veterinary Centre',
    address: '123 Kimathi Street, Nairobi, Kenya',
    phone: '+254 20 222 3333',
    email: 'info@nairobivet.co.ke',
    website: 'https://nairobivet.co.ke',
    latitude: -1.2921,
    longitude: 36.8219,
    services: ['General Checkup', 'Surgery', 'Vaccination', 'Emergency Care', 'Dental Care'],
    hours: { open: '08:00', close: '18:00' },
    isEmergency: true,
    isActive: true,
  },
  {
    name: 'Westlands Animal Clinic',
    address: '45 Waiyaki Way, Westlands, Nairobi',
    phone: '+254 20 444 5555',
    email: 'westlands@animalclinic.co.ke',
    website: 'https://westlandsanimalclinic.co.ke',
    latitude: -1.2680,
    longitude: 36.8036,
    services: ['General Checkup', 'Pet Grooming', 'Vaccination', 'Pet Boarding'],
    hours: { open: '09:00', close: '17:00' },
    isEmergency: false,
    isActive: true,
  },
  {
    name: 'Karen Veterinary Services',
    address: '78 Karen Road, Karen, Nairobi',
    phone: '+254 20 666 7777',
    email: 'karen@vetservices.co.ke',
    website: 'https://karenvetservices.co.ke',
    latitude: -1.3167,
    longitude: 36.7167,
    services: ['General Checkup', 'Surgery', 'Vaccination', 'Farm Animal Care'],
    hours: { open: '08:30', close: '17:30' },
    isEmergency: false,
    isActive: true,
  },
  {
    name: '24/7 Pet Emergency Hospital',
    address: 'Mombasa Road, Near JKIA, Nairobi',
    phone: '+254 20 888 9999',
    email: 'emergency@petemergency.co.ke',
    website: 'https://petemergency.co.ke',
    latitude: -1.3233,
    longitude: 36.8530,
    services: ['Emergency Care', 'Critical Care', 'Surgery', 'Intensive Care'],
    hours: { open: '00:00', close: '23:59' },
    isEmergency: true,
    isActive: true,
  },
  {
    name: 'Kilimani Pet Care Centre',
    address: '12 Kilimani Road, Kilimani, Nairobi',
    phone: '+254 20 111 2222',
    email: 'info@kilimanipetcare.co.ke',
    website: 'https://kilimanipetcare.co.ke',
    latitude: -1.2895,
    longitude: 36.7920,
    services: ['General Checkup', 'Vaccination', 'Pet Grooming', 'Pet Training'],
    hours: { open: '09:00', close: '18:00' },
    isEmergency: false,
    isActive: true,
  },
  {
    name: 'Langata Vet Clinic',
    address: '34 Langata Road, Langata, Nairobi',
    phone: '+254 20 333 4444',
    email: 'langata@vetclinic.co.ke',
    website: 'https://langatavetclinic.co.ke',
    latitude: -1.3350,
    longitude: 36.7750,
    services: ['General Checkup', 'Vaccination', 'Surgery', 'Pet Boarding'],
    hours: { open: '08:00', close: '17:00' },
    isEmergency: false,
    isActive: true,
  },
  {
    name: 'Ruaraka Animal Hospital',
    address: '89 Thika Road, Ruaraka, Nairobi',
    phone: '+254 20 555 6666',
    email: 'ruaraka@animalhospital.co.ke',
    website: 'https://ruarakaanimalhospital.co.ke',
    latitude: -1.2500,
    longitude: 36.8833,
    services: ['General Checkup', 'Surgery', 'Emergency Care', 'Vaccination', 'Diagnostic Imaging'],
    hours: { open: '08:00', close: '20:00' },
    isEmergency: true,
    isActive: true,
  },
  {
    name: 'Embakasi Veterinary Clinic',
    address: '56 Embakasi Road, Embakasi, Nairobi',
    phone: '+254 20 777 8888',
    email: 'embakasi@vetclinic.co.ke',
    website: 'https://embakasivetclinic.co.ke',
    latitude: -1.3167,
    longitude: 36.9000,
    services: ['General Checkup', 'Vaccination', 'Pet Grooming'],
    hours: { open: '09:00', close: '17:00' },
    isEmergency: false,
    isActive: true,
  },
];

const seedVets = async () => {
  try {
    console.log('🌱 Seeding vet locations...');
    
    // Check if vets already exist
    const existingCount = await VetLocation.count();
    if (existingCount > 0) {
      console.log(`✅ ${existingCount} vets already exist, skipping seed`);
      return;
    }

    await VetLocation.bulkCreate(sampleVets);
    console.log(`✅ ${sampleVets.length} vet locations seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding vets:', error);
  }
};

module.exports = { seedVets };

// Run directly if called from command line
if (require.main === module) {
  seedVets().then(() => process.exit(0));
}
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const User = require('../modules/users/user.model');
const Dog = require('../modules/dogs/dog.model');
const Walk = require('../modules/walks/walk.model');
const TrackingPoint = require('../modules/tracking/tracking.model');
const Photo = require('../modules/photos/photo.model');
const Rating = require('../modules/ratings/rating.model');

const { hashPassword } = require('../utils/password');
const {
  ROLES,
  USER_STATUS,
  WALK_STATUS,
} = require('../config/constants');

const clearDatabase = async () => {
  await Promise.all([
    Rating.deleteMany({}),
    Photo.deleteMany({}),
    TrackingPoint.deleteMany({}),
    Walk.deleteMany({}),
    Dog.deleteMany({}),
    User.deleteMany({}),
  ]);
};

const seedUsers = async () => {
  const password = await hashPassword('123456');

  const users = await User.create([
    {
      name: 'Víctor Prowner',
      email: 'victor@example.com',
      phone: '9611111111',
      password,
      role: ROLES.PROWNER,
      status: USER_STATUS.ACTIVE,
    },
    {
      name: 'Laura Prowner',
      email: 'laura@example.com',
      phone: '9612222222',
      password,
      role: ROLES.PROWNER,
      status: USER_STATUS.ACTIVE,
    },
    {
      name: 'Hugo Prunner',
      email: 'hugo@example.com',
      phone: '9613333333',
      password,
      role: ROLES.PRUNNER,
      status: USER_STATUS.ACTIVE,
      serviceLocation: {
        lat: 16.7516,
        lng: -93.1029,
      },
      serviceRadiusKm: 10,
      rating: 5,
      totalRatings: 5,
      ratingsCount: 1,
    },
    {
      name: 'Carlos Prunner',
      email: 'carlos@example.com',
      phone: '4431111111',
      password,
      role: ROLES.PRUNNER,
      status: USER_STATUS.ACTIVE,
      serviceLocation: {
        lat: 19.7020,
        lng: -101.1920,
      },
      serviceRadiusKm: 10,
    },
  ]);

  return {
    victor: users[0],
    laura: users[1],
    hugo: users[2],
    carlos: users[3],
  };
};

const seedDogs = async ({ victor, laura }) => {
  const dogs = await Dog.create([
    {
      ownerId: victor._id,
      name: 'Max',
      age: 3,
      size: 'medium',
      breed: 'Mestizo',
      photo: 'https://example.com/max.jpg',
      notes: 'Energético y sociable',
    },
    {
      ownerId: victor._id,
      name: 'Luna',
      age: 5,
      size: 'small',
      breed: 'Schnauzer',
      photo: 'https://example.com/luna.jpg',
      notes: 'Prefiere paseos tranquilos',
    },
    {
      ownerId: laura._id,
      name: 'Rocky',
      age: 4,
      size: 'large',
      breed: 'Labrador',
      photo: 'https://example.com/rocky.jpg',
      notes: 'Muy amigable',
    },
  ]);

  return {
    max: dogs[0],
    luna: dogs[1],
    rocky: dogs[2],
  };
};

const seedWalks = async (users, dogs) => {
  const now = Date.now();

  const walks = await Walk.create([
    {
      prownerId: users.victor._id,
      prunnerId: null,
      dogIds: [dogs.max._id],
      type: 'individual',
      status: WALK_STATUS.REQUESTED,
      estimatedDuration: 30,
      price: 120,
      address: 'Parque de la Marimba, Tuxtla Gutiérrez',
      pickupLocation: {
        lat: 16.7520,
        lng: -93.1035,
      },
    },
    {
      prownerId: users.victor._id,
      prunnerId: users.hugo._id,
      dogIds: [dogs.luna._id],
      type: 'individual',
      status: WALK_STATUS.ACCEPTED,
      estimatedDuration: 30,
      price: 120,
      address: 'Colonia Centro, Tuxtla Gutiérrez',
      pickupLocation: {
        lat: 16.7540,
        lng: -93.1060,
      },
    },
    {
      prownerId: users.laura._id,
      prunnerId: users.carlos._id,
      dogIds: [dogs.rocky._id],
      type: 'individual',
      status: WALK_STATUS.IN_PROGRESS,
      estimatedDuration: 45,
      actualStartAt: new Date(now - 15 * 60 * 1000),
      price: 160,
      address: 'Centro Histórico, Morelia',
      pickupLocation: {
        lat: 19.7020,
        lng: -101.1920,
      },
    },
    {
      prownerId: users.victor._id,
      prunnerId: users.hugo._id,
      dogIds: [dogs.max._id],
      type: 'individual',
      status: WALK_STATUS.COMPLETED,
      estimatedDuration: 30,
      actualStartAt: new Date(now - 60 * 60 * 1000),
      actualEndAt: new Date(now - 30 * 60 * 1000),
      price: 120,
      address: 'Caña Hueca, Tuxtla Gutiérrez',
      pickupLocation: {
        lat: 16.7590,
        lng: -93.1130,
      },
      summary: 'Max caminó tranquilo, tomó agua y disfrutó el recorrido.',
    },
  ]);

  return {
    requested: walks[0],
    accepted: walks[1],
    inProgress: walks[2],
    completed: walks[3],
  };
};

const seedTracking = async (walks) => {
  await TrackingPoint.create([
    {
      walkId: walks.inProgress._id,
      lat: 19.7020,
      lng: -101.1920,
      timestamp: 1710000000,
    },
    {
      walkId: walks.inProgress._id,
      lat: 19.7025,
      lng: -101.1925,
      timestamp: 1710000060,
    },
    {
      walkId: walks.completed._id,
      lat: 16.7590,
      lng: -93.1130,
      timestamp: 1710000120,
    },
    {
      walkId: walks.completed._id,
      lat: 16.7600,
      lng: -93.1140,
      timestamp: 1710000180,
    },
  ]);
};

const seedPhotos = async (users, walks) => {
  await Photo.create([
    {
      walkId: walks.completed._id,
      uploadedBy: users.hugo._id,
      photoUrl: 'https://example.com/max-walk-1.jpg',
      caption: 'Max disfrutando el paseo',
    },
    {
      walkId: walks.completed._id,
      uploadedBy: users.hugo._id,
      photoUrl: 'https://example.com/max-walk-2.jpg',
      caption: 'Descanso después de caminar',
    },
  ]);
};

const seedRating = async (users, walks) => {
  await Rating.create({
    walkId: walks.completed._id,
    prownerId: users.victor._id,
    prunnerId: users.hugo._id,
    score: 5,
    comment: 'Excelente paseo y muy buena atención.',
  });
};

const runSeed = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing development database...');
    await clearDatabase();

    console.log('👤 Creating users...');
    const users = await seedUsers();

    console.log('🐕 Creating dogs...');
    const dogs = await seedDogs(users);

    console.log('🚶 Creating walks...');
    const walks = await seedWalks(users, dogs);

    console.log('📍 Creating tracking points...');
    await seedTracking(walks);

    console.log('📸 Creating photos...');
    await seedPhotos(users, walks);

    console.log('⭐ Creating rating...');
    await seedRating(users, walks);

    console.log('');
    console.log('✅ Prun MVP v1 seed completed');
    console.log('');
    console.log('Demo credentials:');
    console.log('PROWNER: victor@example.com / 123456');
    console.log('PROWNER: laura@example.com / 123456');
    console.log('PRUNNER: hugo@example.com / 123456');
    console.log('PRUNNER: carlos@example.com / 123456');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runSeed();

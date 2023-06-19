const Animal = require('../models/Animal');

exports.getAll = () => Animal.find({}).lean();

exports.getLastThreeAnimals = async () => {
    const animals = await this.getAll();
    const lastThree = animals.slice(-3);
    
    return lastThree;
};

exports.filterByLocation = async (location) => {
    let result = await this.getAll();
    
    if (location) {
        result = result.filter(a => a.location.toLowerCase() == location.toLowerCase());   
    }

    return result;
}

exports.getOne = (animalId) => Animal.findById(animalId).populate('owner').lean();

exports.create = async (ownerId, animalData) => {
    const { name, years, kind, image, need, location, description } = animalData;

    const animal = new Animal({
        name,
        years: Number(years),
        kind,
        image,
        need,
        location,
        description,
        owner: ownerId,
    });

    await animal.save();
};

exports.edit = async (animalId, userId, animalData) => {
    const animal = await Animal.findById(animalId);
    if (!animal) {
        throw new Error('This animal does not exist in database!')
    }
    if (animal.owner != userId) {
        throw new Error('Sorry, only the owner can modify this post for donation!')
    }

    const { name, years, kind, image, need, location, description } = animalData;
    animal.name = name;
    animal.years = Number(years);
    animal.kind = kind
    animal.image = image;
    animal.need = need;
    animal.location = location;
    animal.description = description;

    await animal.save();

    return animal._id;
};

exports.delete = async (animalId, userId) => {
    const animal = await Animal.findById(animalId);
    if (!animal) {
        throw new Error('Animal does not exist in database!')
    }
    if (animal.owner != userId) {
        throw new Error('Sorry, only the owner can delete this donation post!')
    }

    await Animal.findByIdAndDelete({ _id: animal._id });
};

exports.donate = async (userId, animalId) => {
    await Animal.findOneAndUpdate(
        { $and: [{ _id: animalId }, { donations: { $ne: userId } }] },
        { $push: { 'donations': userId } }
    );
};

exports.hasDonated = async (userId, animalId) => {
    const hasDonated = await Animal.find({
        $and: [{ _id: animalId }, { donations: { $eq: userId } }]
    });

    if (hasDonated.length > 0) {
        return true;
    }

    return false;
};


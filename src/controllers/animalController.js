const router = require('express').Router();

const animalService = require('../services/animalService');
const { getErrorMessage } = require('../utils/errorHelpers');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/dashboard', async (req, res) => {
    try {
        const animals = await animalService.getAll();

        res.render('animals/dashboard', { animals });
    } catch (err) {
        console.log(err.message);
        res.status(400).redirect('/404');
    }
});

router.get('/create', isAuth, (req, res) => {
    res.render('animals/create');
});

router.post('/create', isAuth, async (req, res) => {
    const animalData = req.body;
    const owner = req.user._id;
    try {
        const missingFields = Object.values(animalData).some(v => v == '');
        if (missingFields) {
            throw new Error('All fields are required!');
        }

        await animalService.create(owner, animalData);

        res.redirect('/animals/dashboard');
    }
    catch (err) {
        console.log(err.message);
        const { name, years, kind, image, need, location, description } = req.body;

        res.status(400).render('animals/create', {
            error: getErrorMessage(err),
            name,
            years,
            kind,
            image,
            need,
            location,
            description
        });
    }
});

router.get('/:animalId/edit', isAuth, async (req, res) => {
    try {
        const animalData = await animalService.getOne(req.params.animalId);
        if (!animalData) {
            throw new Error('Animal you are looking for doesn\'t exist!')
        }
        if (req.user._id != animalData.owner._id) {
            throw new Error('Sorry, only the owner can modify this post for donation!');
        }

        res.render('animals/edit', { ...animalData });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.post('/:animalId/edit', isAuth, async (req, res) => {
    const animalData = req.body;
    const userId = req.user._id;
    const animalId = req.params.animalId;
    try {
        const missingFields = Object.values(animalData).some(v => v == '');
        if (missingFields) {
            throw new Error('All fields are required!');
        }

        const _id = await animalService.edit(animalId, userId, animalData);

        res.redirect(`/animals/${_id}/details`);
    } catch (err) {
        req.params.animalId = animalId;
        const { name, years, kind, image, need, location, description } = req.body;

        console.log(err.message);
        res.status(400).render('animals/edit', {
            error: getErrorMessage(err),
            name,
            years,
            kind,
            image,
            need,
            location,
            description
        });
    }
});

router.get('/:animalId/delete', isAuth, async (req, res) => {
    try {
        const animal = await animalService.getOne(req.params.animalId);
        if (!animal) {
            throw new Error('Animal post you are looking for doesn\'t exist!')
        }
        if (req.user._id != animal.owner._id) {
            throw new Error('Sorry, only the owner can delete this donation post!');
        }

        await animalService.delete(req.params.animalId, req.user._id);

        res.redirect('/animals/dashboard');
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/:animalId/details', async (req, res) => {
    try {
        const animal = await animalService.getOne(req.params.animalId);

        const isOwner = req.user?._id == animal.owner._id;

        const hasDonated = await animalService.hasDonated(req.user?._id, animal._id);

        res.render('animals/details', { animal, isOwner, hasDonated });
    } catch (err) {
        console.log(err.message);
        res.status(404).redirect('/404');
    }
});

router.get('/:animalId/donate', isAuth, async (req, res) => {
    const userId = req.user._id;
    const animalId = req.params.animalId;

    try {
        await animalService.donate(userId, animalId);

        res.redirect(`/animals/${animalId}/details`);
    } catch (err) {
        console.log(err.message);
        res.status(400).redirect('/404');
    }
});

module.exports = router;

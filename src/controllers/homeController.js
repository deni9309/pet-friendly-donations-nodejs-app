const router = require('express').Router();
const animalService = require('../services/animalService');

router.get('/', async (req, res) => {
    try {
        const recentPosts = await animalService.getLastThreeAnimals();

        res.render('home', { recentPosts });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    };
});

router.get('/search', async (req, res) => {
    const { location } = req.query;
    try {
        let searchResult = await animalService.filterByLocation(location);

        res.render('search', { searchResult });
    } catch (err) {

        res.redirect('/404')
    };
});

router.get('/404', (req, res) => {
    res.render('404');
});

module.exports = router;
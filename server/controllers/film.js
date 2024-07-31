const Film = require('../models/film');
const Auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();
const User = require('../models/user');


// GET /api/films
exports.getAllFilms = async (req, res) => {
    try {
        const films = await Film.find({ user: req.user.username });
        
        res.json(films);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// GET /api/films/:id
exports.getFilmById = async (req, res) => {
    try {
        const film = await Film.findById(req.params.id);
        //If film is null or not created by this user, return message film not found
        if(film == null || film.user !== req.user.username){
            return res.status(403).json({ message: 'Film not found' });
        }
        res.json(film);

    } catch(err){
        res.status(500).json({message: err.messasge});
    }
};

// POST /api/films
exports.createFilm = async (req, res) => {
    const { name, released, genre, stars } = req.body;
    const username = req.user.username;

    //create the new film document
    const film = new Film({
        name,
        released,
        genre,
        stars,
        user: username
    });

    try {
        //find the user and update their film count
        const user = await User.findOneAndUpdate(
            { username },
            { $inc: { filmCount: 1 } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //save the new film
        const newFilm = await film.save();
        res.status(201).json(newFilm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// PUT /api/films/:id
exports.updateFilm = async (req, res) => {
    try {
        const film  = await Film.findById(req.params.id);

        if(film == null || film.user !== req.user.username){
            return res.status(403).json({ message: 'Film not found' });
        }

        if(req.body.name != null){
            film.name = req.body.name;
        }

        if(req.body.released != null){
            film.released = req.body.released;
        }

        if(req.body.genre != null){
            film.genre = req.body.genre;
        }

        if(req.body.stars != null){
            film.stars = req.body.stars;
        }

        const updateFilm = await film.save();
        
        res.json(updateFilm);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

// DELETE /api/films/:id
exports.deleteFilm = async (req, res) => {
    const username = req.user.username;

    try {
        const film = await Film.findById(req.params.id);

        //check if the film exists and if it belongs to the user
        if (!film || film.user !== username) {
            return res.status(403).json({ message: 'Film not found or you do not have permission to delete this film' });
        }

        //decrement the user's film count
        const user = await User.findOneAndUpdate(
            { username },
            { $inc: { filmCount: -1 } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //delete the film
        await Film.findByIdAndDelete(req.params.id);

        res.json({ message: 'Film deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.services");

async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      name: title,
      artist: req.user.id,
    });

    res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        name: music.name,
        artist: music.artist,
      },
    });
  } catch (error) {
    console.error("Error creating music:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createAlbum(req, res) {
  try {
    const { title, musics } = req.body;
    const album = new albumModel({
      title,
      artist: req.user.id,
      musics: musics || [],
    });
    await album.save();
    res.status(201).json({
      message: "Album created successfully",
      album: {
        id: album._id,
        title: album.title,
        artist: album.artist,
        musics: album.musics,
      },
    });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllMusics(req, res) {
  try {
    const musics = await musicModel.find().limit(10).populate("artist", "username");
    res.status(200).json({
      message: "Musics fetched successfully",
      musics,
    });
  } catch (error) {
    console.error("Error fetching musics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllAlbums(req, res) {
  try {
    const albums = await albumModel.find().select("title artist").populate("artist", "username");
    res.status(200).json({
      message: "Albums fetched successfully",
      albums,
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAlbumById(req, res) {
  try {
    const { id } = req.params;
    const album = await albumModel
      .findById(id)
      .populate("artist", "username")
      // Populate each song + the song's artist
      .populate({
        path: "musics",
        populate: { path: "artist", select: "username" },
      });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json({
      message: "Album fetched successfully",
      album,
    });
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };


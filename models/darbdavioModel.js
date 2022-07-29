const mongoose = require("mongoose");

const darbdavioSchema = new mongoose.Schema({
  imonesPav: {
    type: String,
    required: [true, "Prašome įvesti įmonės pavadinimą"],
    unique: [true, "Toks įmonės pavadinimas jau užregistruotas"],
  },
  imonesKodas: {
    type: Number,
    required: [true, "prasome ivesti įmonės kodą"],
    unique: [true, "Įmonė su tokiu įmonės kodu jau užregistruota"],
    select: false,
  },
  kontaktinisAsmuo: {
    type: String,
    required: [true, "Prašome įvesti kontaktinį asmenį"],
    unique: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // select: false,
  },
  // skelbimai: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Skelbimai",
  // },
  // userId: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Darbdavio",
  //     required: [true, "Skelbimas turi būti priskirtas darbdaviui"],
  //   },
  // ],
  // toJSON: { virtuals: true },
  // Kai duomenys yra outputinami kaip JSON
  // toObject: { virtuals: true },
  // kai duomenys yra outputinami kaip objektas
});

//users/darbdaviai/id

darbdavioSchema.virtual("skelbimai", {
  ref: "Skelbimai",
  foreignField: "imonesInfo",
  localField: "_id",
});

darbdavioSchema.set("toObject", { virtuals: true });
darbdavioSchema.set("toJSON", { virtuals: true });

const Darbdavio = mongoose.model("Darbdavio", darbdavioSchema);
module.exports = Darbdavio;

const mongoose = require("mongoose");

const skelbimuSchema = new mongoose.Schema({
  pavadinimas: {
    unique: true,
    type: String,
    required: [true, "Įvesti skelbimo pavadinimą"],
    minLength: [
      5,
      "Minimalus skelbimo pavadinimas turi sudaryti bent 5 simbolius",
    ],
  },
  imone: {
    type: String,
    required: [true, "Reikia įmonės pavadinimo"],
  },
  duration: {
    type: Number,
  },
  difficulty: {
    type: String,
    required: [true, "Tour must have difficulty"],
    enum: {
      // enum validator tik for strings
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either: easy, medium or difficult",
    },
  },
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
  imonesInfo: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Darbdavio",
    },
  ],
});

// skelbimuSchema.virtual("imonesInfo", {
//   ref: "Darbdavio",
//   foreignField: "skelbimai",
//   localField: "_id",
// });

const Skelbimai = mongoose.model("Skelbimai", skelbimuSchema);
module.exports = Skelbimai;

// Skelbime turi matytis imones pav pagal id.
// imones profili turi matytis kokius skelbimus turi sukurtus

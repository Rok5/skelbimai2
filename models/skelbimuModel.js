const mongoose = require("mongoose");

const skelbimuSchema = new mongoose.Schema(
  {
    pavadinimas: {
      unique: true,
      type: String,
      required: [true, "Įvesti skelbimo pavadinimą"],
      minLength: [
        5,
        "Minimalus skelbimo pavadinimas turi sudaryti bent 5 simbolius",
      ],
      maxlength: [
        100,
        "Maksimalus skelbimo pavadinimas gali būti 100 simbolių",
      ],
    },
    imone: {
      type: String,
      required: [true, "Reikia įmonės pavadinimo"],
    },
    atlyginimas: {
      type: Number,
      required: [true, "Prašome įvesti siūloma atlyginimą prieš mokesčius"],
    },
    miestas: {
      type: String,
      required: [true, "Prašome įvesti miestą kuriame siūlote darbą"],
    },
    darboSritis: {
      type: String,
      required: [true, "Prašome pasirinkti darbo sritį"],
    },

    createdAt: {
      type: String,
      //defaulte nustatyta sukurimo data, automatiskai parenka "dabartine data"
      default: (
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate()
      )
        .toString()
        .replace(/(^|\D)(\d)(?!\d)/g, "$10$2"),
      // type String, nes jei butu Date, tai prisidetu ir laikas + neleidzia renderinti useriui
      //
    },

    // toJSON: { virtuals: true },
    // Kai duomenys yra outputinami kaip JSON
    // toObject: { virtuals: true },
    // kai duomenys yra outputinami kaip objektas
    user: {
      type: "string",
      // required: "true",
    },
    imonesInfo: {
      type: mongoose.Schema.ObjectId,
      ref: "Darbdavio",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

skelbimuSchema.set("toObject", { virtuals: true });
skelbimuSchema.set("toJSON", { virtuals: true });

const Skelbimai = mongoose.model("Skelbimai", skelbimuSchema);
module.exports = Skelbimai;

// Skelbime turi matytis imones pav pagal id.
// imones profili turi matytis kokius skelbimus turi sukurtus

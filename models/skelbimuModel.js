const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
// mongoosePaginate.paginate.options = {
//   limit: 3, // how many records on each page
// };

const skelbimuSchema = new mongoose.Schema(
  {
    pareiguPavadinimas: {
      type: String,
      required: [true, "Įvesti pareigų pavadinimą"],
      minLength: [
        5,
        "Minimalus pareigų pavadinimas turi sudaryti bent 5 simbolius",
      ],
      maxlength: [110, "Maksimalus pareigų pavadinimas gali būti 110 simbolių"],
    },
    imone: {
      type: String,
      required: [true, "Reikia įmonės pavadinimo"],
    },
    atlyginimas: {
      type: Number,
      required: [true, "Prašome įvesti siūloma atlyginimą prieš mokesčius"],
    },
    atlyginimoTipas: {
      type: String,
      enum: ["bruto", "neto"],
      required: [
        true,
        "Prašome pasirinkti ar nurodytas atlyginimas yra brtuo ar neto",
      ],
    },
    miestas: {
      type: String,
      required: [true, "Prašome įvesti miestą kuriame siūlote darbą"],
    },
    darboSritis: {
      type: String,
      required: [true, "Prašome pasirinkti darbo sritį"],
    },
    darboPobudis: {
      type: String,
      required: [true, "Prašome aprašyti darbo pobūdį"],
    },
    reikalavimaiDarbuotojui: {
      type: String,
      required: [true, "Prašome nurodyti reikalavimus darbuotojui"],
    },
    imoneSiulo: {
      type: String,
    },
    informacijaApieImone: {
      type: String,
      required: [true, "Prašome nurodyti jūsų įmonės aprašymą"],
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
    },

    // toJSON: { virtuals: true },
    
    // toObject: { virtuals: true },
    /
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

skelbimuSchema.plugin(mongoosePaginate);

const Skelbimai = mongoose.model("Skelbimai", skelbimuSchema);

module.exports = Skelbimai;

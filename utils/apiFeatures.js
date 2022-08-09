class APIFeatures {
  // constructor funkcija pasileidzia kaskart sukurus objekta su APIFeatures klase
  // 1. query - mongoose 2.queryString - is routo (req.query)
  // 1. mongoose query dedam i funkcija, nes nenorim, kad querintu sioje klaseje
  // darom, kad klase butu galima kuo daugiau panaudoti - neutralia
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    // this.query yra lygus query, kuri gavom kaip argumenta
    /// this.queryString yra lygus queryString, kuri gavom kaip argumenta
    // this reikia priskirti, kad po to galetume naudoti siuos argumentus kitose
    // funkcijose
  }

  filter() {
    // queryObj yra req.query kopija, kopijos reikia, nes is jos reiks pasalinti
    // kai kuriuos parametrus, pvz puslapi, del kuriu filtravimas neveiktu
    // {...req.query}/{...this.queryString} kopija kuriam taip, nes tai vienintelis
    // budas sukurti tvirtai kopijai, kuri nekistu kazka istrynus is pirminio objekto
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    // loopinamm pro excludedFields su forEach(forEach tam, kad nebutu sukurta
    // nauja array, o modifikuojama esama - queryObj), jei queryObj yra loopianamas
    // elementas - el, jis bus istrintas is queryObj naudojantis funkcija delete
    excludedFields.forEach((el) => delete queryObj[el]);

    // Filtravimui naudojamas req.query parametras
    // gte ir kt. pritaikymas.
    // rankinis filtravimas atrodytu taip:
    // {difficulty: 'easy', duration: {$gte: 5}}
    // o req.query logas atrodo taip:
    // { difficulty: 'easy', duration: { gte: '5' } }
    // vadinasi prie gte reikia $ simbolio

    let queryStr = JSON.stringify(queryObj);
    // console.log(queryObj);
    // verciam js text faila i JSON

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (vienasIsSutampanciuParametru) => `$${vienasIsSutampanciuParametru}`
    );
    // console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));

    // jei this.query.find tuscias, tai bus nusiusti visi rezultatai
    return this;
  }
  // pakeitimui naudojamas regular expresion.
  // viska rasom tarp // i viduri skliaustuose surasom visus
  // parametrus kuriuos norim sumatchinti
  // \b reiskia, kad tie parametrai butu atskirti t.y.
  // nekeistu jei zodyje ir tik dalis jungtinio pvz zodyje ltu, nekeistu.
  // /g reiskia, kad keistu visus matchus, jei g nerasytume, pakeistu tik pirma pasitaikiusi

  sort() {
    if (this.queryString.sort) {
      // kai norima išsortinti pagal kelis kriterijus, linke sort=kriterijus,
      // antrasKriterijus atskiriame kableliais, taciau mongoose jie turi buti
      // atskirti tarpu todel sukuriam konstanta sortBy, kurioje splitinam
      // req.query.sort inputa per kablelius ir po to juos sujungiam atgal tarpais
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("createdAt _id");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    // __v yra mongoose sukurtas elementas, kuris vartotojui yra nereikalingas,
    // tam, kad jo nesiusti mes ji defaultu excludinam minuso zenklu - default:
    // renkames vaizduoti viska, tik ne __v
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    // const skip = page * limit - limit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

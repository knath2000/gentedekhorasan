const fs = require('fs');
const xml2js = require('xml2js');
// const { Pool } = require('pg'); // PG pool can be added later if direct DB insertion is needed from this script

console.log("Starting Quran data conversion script...");

// Path to the XML file - ensure it's in the project root or update path
const xmlFilePath = './quran-data.xml';
const edgeConfigOutputPath = './edge-config-data.json';
const sqlOutputPath = './quran_metadata_schema.sql'; // For schema and potentially insert statements

try {
  if (!fs.existsSync(xmlFilePath)) {
    console.error("Error: XML file not found at " + xmlFilePath);
    console.error("Please ensure 'quran-data.xml' is in the project root directory.");
    process.exit(1);
  }

  const xmlData = fs.readFileSync(xmlFilePath, 'utf8');
  console.log("Successfully read XML file.");

  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

  parser.parseString(xmlData, async (err, result) => {
    if (err) {
      console.error("Error parsing XML:", err);
      process.exit(1);
    }
    console.log("Successfully parsed XML data.");

    // --- Transform for Edge Config ---

    // Helper function to escape strings for SQL insertion
    function escapeForSql(str) {
      if (str === null || str === undefined) {
        return ''; // Represent as empty string for SQL TEXT fields
      }
      if (typeof str !== 'string') {
        str = String(str); // Coerce to string
      }
      return str.replace(/'/g, "''"); // Escape single quotes for SQL
    }

    const suras = result.quran.suras.sura;
    const juzs = result.quran.juzs.juz;
    const pages = result.quran.pages.page;
    // Add other metadata sections as needed (hizbs, rukus, sajdas, manzils)

    const edgeConfigData = {
      surahBasicInfo: suras.map(s => ({
        number: parseInt(s.index),
        name: s.name,
        tname: s.tname, // Transliterated name
        ename: s.ename, // English name
        ayas: parseInt(s.ayas),
        type: s.type, // Revelation type (Meccan/Medinan)
        order: parseInt(s.order), // Chronological order
        rukus: parseInt(s.rukus)
      })),
      navigationIndices: {
        juzStarts: juzs.reduce((acc, j) => {
          acc[j.index] = { surah: parseInt(j.sura), aya: parseInt(j.aya) };
          return acc;
        }, {}),
        pageStarts: pages.reduce((acc, p) => {
          acc[p.index] = { surah: parseInt(p.sura), aya: parseInt(p.aya) };
          return acc;
        }, {})
        // Add other indices like hizbStarts, rukuStarts if needed
      }
    };

    fs.writeFileSync(edgeConfigOutputPath, JSON.stringify(edgeConfigData, null, 2));
    console.log("Successfully wrote Edge Config data to " + edgeConfigOutputPath);

    // --- Generate PostgreSQL Schema and Insert Statements ---
    let sqlScript = `
-- Quran Metadata Schema for Luminous Verses

-- Disable notices for cleaner output if running in psql
SET client_min_messages TO WARNING;

-- Surahs table
DROP TABLE IF EXISTS quran_surahs CASCADE;
CREATE TABLE quran_surahs (
  number INTEGER PRIMARY KEY,
  arabic_name TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  english_name TEXT NOT NULL,
  ayas INTEGER NOT NULL,
  start_index INTEGER, -- This might be derived or from a different source if it means global ayah index
  revelation_type TEXT NOT NULL, -- 'Meccan' or 'Medinan'
  chronological_order INTEGER NOT NULL,
  rukus INTEGER NOT NULL
);
COMMENT ON TABLE quran_surahs IS 'Stores information about each Surah (chapter) of the Quran.';

-- Juzs table (stores the starting ayah of each Juz)
DROP TABLE IF EXISTS quran_juzs CASCADE;
CREATE TABLE quran_juzs (
  juz_number INTEGER PRIMARY KEY,
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(number),
  ayah_number INTEGER NOT NULL
);
COMMENT ON TABLE quran_juzs IS 'Stores the starting Surah and Ayah for each of the 30 Juzs (parts) of the Quran.';

-- Pages table (stores the starting ayah of each traditional Mushaf page)
DROP TABLE IF EXISTS quran_pages CASCADE;
CREATE TABLE quran_pages (
  page_number INTEGER PRIMARY KEY,
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(number),
  ayah_number INTEGER NOT NULL
);
COMMENT ON TABLE quran_pages IS 'Stores the starting Surah and Ayah for each page of a standard Mushaf.';

-- Rukus table (stores the starting ayah of each Ruku)
-- Note: The XML provides ruku count per surah. Detailed ruku start/end might need different parsing or data.
-- For now, let's assume we might store them if the XML structure supports it directly or if it's added.
-- If quran.rukus.ruku exists and has sura/aya attributes:
DROP TABLE IF EXISTS quran_rukus CASCADE;
CREATE TABLE quran_rukus (
  ruku_id SERIAL PRIMARY KEY, -- Or a composite key if preferred
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(number),
  ayah_number INTEGER NOT NULL,
  ruku_number_in_surah INTEGER -- Optional: if the XML provides this
);
COMMENT ON TABLE quran_rukus IS 'Stores the starting Surah and Ayah for each Ruku (section).';


-- Sajdas (Prostration verses)
DROP TABLE IF EXISTS quran_sajdas CASCADE;
CREATE TABLE quran_sajdas (
  sajda_id SERIAL PRIMARY KEY,
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(number),
  ayah_number INTEGER NOT NULL,
  type TEXT -- 'recommended' or 'obligatory' if specified
);
COMMENT ON TABLE quran_sajdas IS 'Stores information about Sajda (prostration) verses.';

-- Manzils (7 major divisions for reciting Quran in a week)
DROP TABLE IF EXISTS quran_manzils CASCADE;
CREATE TABLE quran_manzils (
  manzil_number INTEGER PRIMARY KEY,
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(number),
  ayah_number INTEGER NOT NULL
);
COMMENT ON TABLE quran_manzils IS 'Stores the starting Surah and Ayah for each of the 7 Manzils.';

-- Hizbs and Quarters (More granular divisions)
-- Hizb: 60 parts. Quarter: 240 parts.
DROP TABLE IF EXISTS quran_hizb_quarters CASCADE;
CREATE TABLE quran_hizb_quarters (
  quarter_number INTEGER PRIMARY KEY, -- 1 to 240
  hizb_number INTEGER NOT NULL, -- 1 to 60
  surah_number INTEGER NOT NULL REFERENCES quran_surahs(number),
  ayah_number INTEGER NOT NULL
);
COMMENT ON TABLE quran_hizb_quarters IS 'Stores the starting Surah and Ayah for each Hizb quarter.';

-- Insert statements will follow
`;

    // Insert data for quran_surahs
    sqlScript += "\n-- Data for quran_surahs\n";
    suras.forEach(s => {
      sqlScript += "INSERT INTO quran_surahs (number, arabic_name, transliteration, english_name, ayas, revelation_type, chronological_order, rukus) VALUES ("
        + parseInt(s.index) + ", '"
        + escapeForSql(s.name) + "', '"
        + escapeForSql(s.tname) + "', '"
        + escapeForSql(s.ename) + "', "
        + parseInt(s.ayas) + ", '"
        + escapeForSql(s.type) + "', "
        + parseInt(s.order) + ", "
        + parseInt(s.rukus) + ");\n";
    });

    // Insert data for quran_juzs
    sqlScript += "\n-- Data for quran_juzs\n";
    juzs.forEach(j => {
      sqlScript += "INSERT INTO quran_juzs (juz_number, surah_number, ayah_number) VALUES ("
        + parseInt(j.index) + ", "
        + parseInt(j.sura) + ", "
        + parseInt(j.aya) + ");\n";
    });

    // Insert data for quran_pages
    sqlScript += "\n-- Data for quran_pages\n";
    pages.forEach(p => {
      sqlScript += "INSERT INTO quran_pages (page_number, surah_number, ayah_number) VALUES ("
        + parseInt(p.index) + ", "
        + parseInt(p.sura) + ", "
        + parseInt(p.aya) + ");\n";
    });

    // Insert data for quran_sajdas
    if (result.quran.sajdas && result.quran.sajdas.sajda) {
      const sajdas = Array.isArray(result.quran.sajdas.sajda) ? result.quran.sajdas.sajda : [result.quran.sajdas.sajda];
      sqlScript += "\n-- Data for quran_sajdas\n";
      sajdas.forEach(s => {
        sqlScript += "INSERT INTO quran_sajdas (surah_number, ayah_number, type) VALUES ("
          + parseInt(s.sura) + ", "
          + parseInt(s.aya) + ", '"
          + escapeForSql(s.type) + "');\n";
      });
    }

    // Insert data for quran_manzils
    if (result.quran.manzils && result.quran.manzils.manzil) {
      const manzils = Array.isArray(result.quran.manzils.manzil) ? result.quran.manzils.manzil : [result.quran.manzils.manzil];
      sqlScript += "\n-- Data for quran_manzils\n";
      manzils.forEach(m => {
        sqlScript += "INSERT INTO quran_manzils (manzil_number, surah_number, ayah_number) VALUES ("
          + parseInt(m.index) + ", "
          + parseInt(m.sura) + ", "
          + parseInt(m.aya) + ");\n";
      });
    }

    // Insert data for quran_hizb_quarters
    if (result.quran.hizbs && result.quran.hizbs.quarter) {
        const quarters = Array.isArray(result.quran.hizbs.quarter) ? result.quran.hizbs.quarter : [result.quran.hizbs.quarter];
        sqlScript += "\n-- Data for quran_hizb_quarters\n";
        let currentHizb = 0;
        quarters.forEach(q => {
            const quarterIndex = parseInt(q.index);
            currentHizb = Math.ceil(quarterIndex / 4);
            sqlScript += "INSERT INTO quran_hizb_quarters (quarter_number, hizb_number, surah_number, ayah_number) VALUES ("
              + quarterIndex + ", "
              + currentHizb + ", "
              + parseInt(q.sura) + ", "
              + parseInt(q.aya) + ");\n";
        });
    }

    // Insert data for quran_rukus
    if (result.quran.rukus && result.quran.rukus.ruku && Array.isArray(result.quran.rukus.ruku)) {
        sqlScript += "\n-- Data for quran_rukus\n";
        result.quran.rukus.ruku.forEach((r, idx) => {
            if (r.sura && r.aya) {
                sqlScript += "INSERT INTO quran_rukus (surah_number, ayah_number) VALUES ("
                  + parseInt(r.sura) + ", "
                  + parseInt(r.aya) + ");\n";
            }
        });
    }

    sqlScript += "\nCOMMIT;\n";

    fs.writeFileSync(sqlOutputPath, sqlScript);
    console.log("Successfully wrote SQL schema and data to " + sqlOutputPath);
    console.log("--- Conversion Script Finished ---");
    console.log("Next steps:");
    console.log("1. Review the generated 'edge-config-data.json' file.");
    console.log("2. Review the generated 'quran_metadata_schema.sql' file.");
    console.log("3. Execute the SQL script against your PostgreSQL database.");
    console.log("4. Upload Edge Config data using Vercel CLI: vercel edge-config add quranMetadata ./edge-config-data.json");

  });

} catch (error) {
  console.error("An error occurred in the script:", error);
  process.exit(1);
}
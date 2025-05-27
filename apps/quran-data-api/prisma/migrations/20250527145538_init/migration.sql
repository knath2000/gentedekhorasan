-- CreateTable
CREATE TABLE "en_yusufali" (
    "index" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sura" INTEGER NOT NULL,
    "aya" INTEGER NOT NULL,
    "text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "quran_sajdas" (
    "sajda_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "surah_number" INTEGER NOT NULL,
    "ayah_number" INTEGER NOT NULL,
    "type" TEXT
);

-- CreateTable
CREATE TABLE "quran_surahs" (
    "number" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "arabic_name" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "english_name" TEXT NOT NULL,
    "ayas" INTEGER NOT NULL,
    "revelation_type" TEXT NOT NULL,
    "chronological_order" INTEGER NOT NULL,
    "rukus" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "quran_text" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sura" INTEGER NOT NULL,
    "aya" INTEGER NOT NULL,
    "text" TEXT NOT NULL
);

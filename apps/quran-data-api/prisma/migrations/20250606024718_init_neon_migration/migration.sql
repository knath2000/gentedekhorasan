-- CreateTable
CREATE TABLE "en_yusufali" (
    "index" INTEGER NOT NULL,
    "sura" INTEGER NOT NULL,
    "aya" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "en_yusufali_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "quran_sajdas" (
    "sajda_id" SERIAL NOT NULL,
    "surah_number" INTEGER NOT NULL,
    "ayah_number" INTEGER NOT NULL,
    "type" TEXT,

    CONSTRAINT "quran_sajdas_pkey" PRIMARY KEY ("sajda_id")
);

-- CreateTable
CREATE TABLE "quran_surahs" (
    "number" INTEGER NOT NULL,
    "arabic_name" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "english_name" TEXT NOT NULL,
    "ayas" INTEGER NOT NULL,
    "revelation_type" TEXT NOT NULL,
    "chronological_order" INTEGER NOT NULL,
    "rukus" INTEGER NOT NULL,
    "start_index" INTEGER,

    CONSTRAINT "quran_surahs_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "quran_text" (
    "id" SERIAL NOT NULL,
    "sura" INTEGER NOT NULL,
    "aya" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "quran_text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "verseText" TEXT NOT NULL,
    "surahName" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_bookmarks_userId_surahId_verseNumber_key" ON "user_bookmarks"("userId", "surahId", "verseNumber");

-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortUrl_key" ON "urls"("shortUrl");

-- CreateIndex
CREATE INDEX "urls_originalUrl_idx" ON "urls"("originalUrl");

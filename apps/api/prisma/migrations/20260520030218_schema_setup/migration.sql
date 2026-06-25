-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_projects" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "color_palettes" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "color_palettes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "palette_colors" (
    "id" UUID NOT NULL,
    "palette_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "hex_code" TEXT NOT NULL,
    "rgb_value" TEXT,
    "cmyk_value" TEXT,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "palette_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typographies" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "font_family" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "category" TEXT,
    "weight_min" INTEGER,
    "weight_max" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typographies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visual_assets" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "uploaded_by_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "mime_type" TEXT,
    "file_size_bytes" INTEGER,
    "checksum_sha256" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visual_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "brand_projects_slug_key" ON "brand_projects"("slug");

-- CreateIndex
CREATE INDEX "brand_projects_owner_id_idx" ON "brand_projects"("owner_id");

-- CreateIndex
CREATE INDEX "color_palettes_project_id_idx" ON "color_palettes"("project_id");

-- CreateIndex
CREATE INDEX "palette_colors_palette_id_idx" ON "palette_colors"("palette_id");

-- CreateIndex
CREATE INDEX "typographies_project_id_idx" ON "typographies"("project_id");

-- CreateIndex
CREATE INDEX "visual_assets_project_id_idx" ON "visual_assets"("project_id");

-- CreateIndex
CREATE INDEX "visual_assets_uploaded_by_id_idx" ON "visual_assets"("uploaded_by_id");

-- AddForeignKey
ALTER TABLE "brand_projects" ADD CONSTRAINT "brand_projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "color_palettes" ADD CONSTRAINT "color_palettes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "brand_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "palette_colors" ADD CONSTRAINT "palette_colors_palette_id_fkey" FOREIGN KEY ("palette_id") REFERENCES "color_palettes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typographies" ADD CONSTRAINT "typographies_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "brand_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visual_assets" ADD CONSTRAINT "visual_assets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "brand_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visual_assets" ADD CONSTRAINT "visual_assets_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

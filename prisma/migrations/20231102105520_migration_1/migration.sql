-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(42) NOT NULL,
    `name` VARCHAR(16) NOT NULL,
    `email` VARCHAR(64) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `phoneNumber` VARCHAR(16) NOT NULL,
    `role` ENUM('admin', 'umkm') NOT NULL DEFAULT 'umkm',
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `id` VARCHAR(42) NOT NULL,
    `name` VARCHAR(36) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `type` ENUM('product', 'service') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enterprises` (
    `id` VARCHAR(42) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nib` VARCHAR(16) NOT NULL,
    `name` VARCHAR(36) NOT NULL,
    `uid` VARCHAR(42) NOT NULL,
    `type` ENUM('product', 'service', 'both') NOT NULL,
    `categories` JSON NOT NULL,
    `keywords` TEXT NULL,
    `description` TEXT NULL,
    `shortDescription` VARCHAR(36) NULL,
    `logoUrl` VARCHAR(48) NULL,
    `storeUrl` TEXT NULL,
    `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending',
    `inactiveReason` TEXT NULL,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Enterprises_nib_key`(`nib`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Catalogs` (
    `id` VARCHAR(42) NOT NULL,
    `enterpriseId` VARCHAR(191) NOT NULL,
    `categories` JSON NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `uid` VARCHAR(124) NOT NULL,
    `description` TEXT NOT NULL,
    `image1Url` VARCHAR(132) NOT NULL,
    `image2Url` VARCHAR(132) NULL,
    `image3Url` VARCHAR(132) NULL,
    `catalogUrl` TEXT NOT NULL,
    `type` ENUM('product', 'service') NOT NULL,
    `keywords` TEXT NOT NULL,
    `status` ENUM('show', 'hidden', 'suspend') NOT NULL,
    `suspendReason` TEXT NULL,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportTypes` (
    `id` VARCHAR(42) NOT NULL,
    `reportType` VARCHAR(48) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reports` (
    `id` VARCHAR(42) NOT NULL,
    `enterpriseId` VARCHAR(191) NOT NULL,
    `catalogId` VARCHAR(191) NULL,
    `reportTypeId` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `ipAddress` VARCHAR(18) NOT NULL,
    `status` ENUM('pending', 'solved', 'rejected') NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` VARCHAR(42) NOT NULL,
    `name` VARCHAR(24) NOT NULL,
    `value` TEXT NOT NULL,

    UNIQUE INDEX `Settings_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enterprises` ADD CONSTRAINT `Enterprises_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Catalogs` ADD CONSTRAINT `Catalogs_enterpriseId_fkey` FOREIGN KEY (`enterpriseId`) REFERENCES `Enterprises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_enterpriseId_fkey` FOREIGN KEY (`enterpriseId`) REFERENCES `Enterprises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_catalogId_fkey` FOREIGN KEY (`catalogId`) REFERENCES `Catalogs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_reportTypeId_fkey` FOREIGN KEY (`reportTypeId`) REFERENCES `ReportTypes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

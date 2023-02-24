-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `description` VARCHAR(45) NULL,
    `video` VARCHAR(45) NULL,
    `images` VARCHAR(45) NULL,
    `documents` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `email` VARCHAR(45) NULL,
    `password` INTEGER NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

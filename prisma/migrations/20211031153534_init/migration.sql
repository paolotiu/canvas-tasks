-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(256) NOT NULL,
    `provider` VARCHAR(256) NOT NULL,
    `providerAccountId` VARCHAR(256) NOT NULL,
    `refresh_token` VARCHAR(256) NULL,
    `access_token` VARCHAR(256) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(256) NULL,
    `scope` VARCHAR(256) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(256) NULL,
    `oauth_token_secret` VARCHAR(256) NULL,
    `oauth_token` VARCHAR(256) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Credential` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `key` JSON NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Credential_id_userId_key`(`id`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConnectedGoogleTask` (
    `id` VARCHAR(191) NOT NULL,
    `integrationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `includeDiscussionTopics` BOOLEAN NOT NULL DEFAULT true,
    `includeAssignments` BOOLEAN NOT NULL DEFAULT true,
    `includeQuizzes` BOOLEAN NOT NULL DEFAULT true,
    `connectedTaskId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ConnectedGoogleTask_integrationId_key`(`integrationId`),
    UNIQUE INDEX `ConnectedGoogleTask_userId_integrationId_key`(`userId`, `integrationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlannerItem` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `canvasToken` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ConnectedGoogleTaskToPlannerItem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ConnectedGoogleTaskToPlannerItem_AB_unique`(`A`, `B`),
    INDEX `_ConnectedGoogleTaskToPlannerItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

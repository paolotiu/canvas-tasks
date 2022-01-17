-- CreateTable
CREATE TABLE "Credential" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "key" JSONB NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectedGoogleTask" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "integrationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "includeDiscussionTopics" BOOLEAN NOT NULL DEFAULT true,
    "includeAssignments" BOOLEAN NOT NULL DEFAULT true,
    "includeQuizzes" BOOLEAN NOT NULL DEFAULT true,
    "connectedTaskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectedGoogleTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannerItemOnConnGoogleTask" (
    "googleTaskId" TEXT NOT NULL,
    "plannerItemId" TEXT NOT NULL,
    "connectedGoogleTaskId" UUID NOT NULL,

    CONSTRAINT "PlannerItemOnConnGoogleTask_pkey" PRIMARY KEY ("plannerItemId","connectedGoogleTaskId")
);

-- CreateTable
CREATE TABLE "PlannerItem" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannerItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "canvasToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credential_id_userId_key" ON "Credential"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectedGoogleTask_integrationId_key" ON "ConnectedGoogleTask"("integrationId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectedGoogleTask_userId_integrationId_key" ON "ConnectedGoogleTask"("userId", "integrationId");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectedGoogleTask" ADD CONSTRAINT "ConnectedGoogleTask_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectedGoogleTask" ADD CONSTRAINT "ConnectedGoogleTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerItemOnConnGoogleTask" ADD CONSTRAINT "PlannerItemOnConnGoogleTask_plannerItemId_fkey" FOREIGN KEY ("plannerItemId") REFERENCES "PlannerItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerItemOnConnGoogleTask" ADD CONSTRAINT "PlannerItemOnConnGoogleTask_connectedGoogleTaskId_fkey" FOREIGN KEY ("connectedGoogleTaskId") REFERENCES "ConnectedGoogleTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

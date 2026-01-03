-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

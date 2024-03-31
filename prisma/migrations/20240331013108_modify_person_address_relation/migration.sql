/*
  Warnings:

  - You are about to drop the column `adressId` on the `mnt_persona` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personId]` on the table `mnt_direccion` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_persona] DROP CONSTRAINT [mnt_persona_adressId_fkey];

-- DropIndex
ALTER TABLE [dbo].[mnt_persona] DROP CONSTRAINT [mnt_persona_adressId_key];

-- AlterTable
ALTER TABLE [dbo].[mnt_direccion] ADD [personId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[mnt_persona] DROP COLUMN [adressId];

-- CreateIndex
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_personId_key] UNIQUE NONCLUSTERED ([personId]);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[mnt_persona]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

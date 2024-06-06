/*
  Warnings:

  - You are about to drop the column `personId` on the `mnt_direccion` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_direccion] DROP CONSTRAINT [mnt_direccion_personId_fkey];

-- DropIndex
ALTER TABLE [dbo].[mnt_direccion] DROP CONSTRAINT [mnt_direccion_personId_key];

-- AlterTable
ALTER TABLE [dbo].[mnt_direccion] DROP COLUMN [personId];

-- AlterTable
ALTER TABLE [dbo].[mnt_persona] ADD [addressId] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[mnt_direccion]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

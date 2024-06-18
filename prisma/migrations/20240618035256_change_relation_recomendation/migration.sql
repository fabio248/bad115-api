/*
  Warnings:

  - You are about to drop the column `recomendationId` on the `mnt_usuario` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_usuario] DROP CONSTRAINT [mnt_usuario_recomendationId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_recomendacion] ADD [userId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[mnt_usuario] DROP COLUMN [recomendationId];

-- AddForeignKey
ALTER TABLE [dbo].[mnt_recomendacion] ADD CONSTRAINT [mnt_recomendacion_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[mnt_usuario]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

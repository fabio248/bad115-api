/*
  Warnings:

  - You are about to drop the column `url_archivo` on the `mnt_prueba` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_prueba] DROP COLUMN [url_archivo];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

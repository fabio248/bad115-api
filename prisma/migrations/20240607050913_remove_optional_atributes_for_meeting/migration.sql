/*
  Warnings:

  - Made the column `fecha_de_ejecucion` on table `mnt_reunion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enlace_reunion` on table `mnt_reunion` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_reunion] ALTER COLUMN [fecha_de_ejecucion] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[mnt_reunion] ALTER COLUMN [enlace_reunion] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

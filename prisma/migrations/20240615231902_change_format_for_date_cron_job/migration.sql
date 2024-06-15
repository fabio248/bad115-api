/*
  Warnings:

  - You are about to alter the column `fecha_de_tarea_programadas` on the `mnt_tarea_programada` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `DateTime2`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_tarea_programada] ALTER COLUMN [fecha_de_tarea_programadas] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

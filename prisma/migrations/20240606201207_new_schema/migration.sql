BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_reunion] ALTER COLUMN [fecha_de_ejecucion] DATETIME2 NULL;
ALTER TABLE [dbo].[mnt_reunion] ALTER COLUMN [enlace_reunion] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

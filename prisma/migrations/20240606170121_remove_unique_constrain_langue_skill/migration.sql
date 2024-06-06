BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] DROP CONSTRAINT [mnt_habilidad_lenguaje_languageId_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

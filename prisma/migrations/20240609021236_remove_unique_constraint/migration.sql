BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] DROP CONSTRAINT [mnt_aplicacion_puesto_trabajo_id_puesto_trabajo_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

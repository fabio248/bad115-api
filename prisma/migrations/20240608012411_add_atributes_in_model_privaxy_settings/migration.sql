BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_configuracion_de_privacidad] ADD [direccion] BIT CONSTRAINT [mnt_configuracion_de_privacidad_direccion_df] DEFAULT 0,
[documentos] BIT CONSTRAINT [mnt_configuracion_de_privacidad_documentos_df] DEFAULT 0,
[red_social] BIT CONSTRAINT [mnt_configuracion_de_privacidad_red_social_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[mnt_solicitud_desbloqueo] (
    [id] NVARCHAR(1000) NOT NULL,
    [estado] NVARCHAR(1000) NOT NULL,
    [razon] NVARCHAR(1000),
    [usuario_id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_solicitud_desbloqueo_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_solicitud_desbloqueo_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_solicitud_desbloqueo] ADD CONSTRAINT [mnt_solicitud_desbloqueo_usuario_id_fkey] FOREIGN KEY ([usuario_id]) REFERENCES [dbo].[mnt_usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[mnt_tarea_programada] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_tarea_programada] NVARCHAR(1000) NOT NULL,
    [fecha_de_tarea_programadas] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_tarea_programada_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_tarea_programada_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

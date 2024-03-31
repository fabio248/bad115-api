/*
  Warnings:

  - You are about to drop the `mtn_recomendacion` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mtn_recomendacion] DROP CONSTRAINT [mtn_recomendacion_candidateId_fkey];

-- DropTable
DROP TABLE [dbo].[mtn_recomendacion];

-- CreateTable
CREATE TABLE [dbo].[mnt_recomendacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_del_recomendado] NVARCHAR(1000) NOT NULL,
    [apellido_del_recomendado] NVARCHAR(1000) NOT NULL,
    [correo_del_recomendado] NVARCHAR(1000) NOT NULL,
    [telefono_del_recomendado] NVARCHAR(1000),
    [tipo] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_recomendacion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_recomendacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_recomendacion] ADD CONSTRAINT [mnt_recomendacion_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

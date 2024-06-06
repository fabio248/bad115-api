/*
  Warnings:

  - Added the required column `estado_aplicacion_puesto` to the `mnt_aplicacion_puesto_trabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recomendacion_aplicacion_puesto` to the `mnt_aplicacion_puesto_trabajo` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD [estado_aplicacion_puesto] NVARCHAR(1000) NOT NULL,
[recomendacion_aplicacion_puesto] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Meeting] (
    [id] NVARCHAR(1000) NOT NULL,
    [fecha_de_ejecucion] DATETIME2 NOT NULL,
    [link] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [Meeting_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [jobAplicationId] NVARCHAR(1000),
    CONSTRAINT [Meeting_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Meeting] ADD CONSTRAINT [Meeting_jobAplicationId_fkey] FOREIGN KEY ([jobAplicationId]) REFERENCES [dbo].[mnt_aplicacion_puesto_trabajo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

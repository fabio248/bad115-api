/*
  Warnings:

  - You are about to drop the `mnt_meeting` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_meeting] DROP CONSTRAINT [mnt_meeting_jobAplicationId_fkey];

-- DropTable
DROP TABLE [dbo].[mnt_meeting];

-- CreateTable
CREATE TABLE [dbo].[mnt_reunion] (
    [id] NVARCHAR(1000) NOT NULL,
    [fecha_de_ejecucion] DATETIME2 NOT NULL,
    [link] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_reunion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [jobAplicationId] NVARCHAR(1000),
    CONSTRAINT [mnt_reunion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_reunion] ADD CONSTRAINT [mnt_reunion_jobAplicationId_fkey] FOREIGN KEY ([jobAplicationId]) REFERENCES [dbo].[mnt_aplicacion_puesto_trabajo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

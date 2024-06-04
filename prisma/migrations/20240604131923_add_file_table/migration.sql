/*
  Warnings:

  - Added the required column `fileId` to the `mnt_prueba` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_prueba] ADD [fileId] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[mnt_archivo] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_archivo] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_archivo_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_archivo_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_prueba] ADD CONSTRAINT [mnt_prueba_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[mnt_archivo]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

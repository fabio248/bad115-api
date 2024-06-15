/*
  Warnings:

  - Added the required column `id_reunion` to the `mnt_tarea_programada` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_tarea_programada] ADD [id_reunion] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_tarea_programada] ADD CONSTRAINT [mnt_tarea_programada_id_reunion_fkey] FOREIGN KEY ([id_reunion]) REFERENCES [dbo].[mnt_reunion]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

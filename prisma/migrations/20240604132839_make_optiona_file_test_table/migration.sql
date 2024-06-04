BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_prueba] DROP CONSTRAINT [mnt_prueba_fileId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_prueba] ALTER COLUMN [fileId] NVARCHAR(1000) NULL;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_prueba] ADD CONSTRAINT [mnt_prueba_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[mnt_archivo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

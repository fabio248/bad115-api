BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_direccion] DROP CONSTRAINT [mnt_direccion_municipalityId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_direccion] ALTER COLUMN [departmentId] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[mnt_direccion] ALTER COLUMN [municipalityId] NVARCHAR(1000) NULL;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_municipalityId_fkey] FOREIGN KEY ([municipalityId]) REFERENCES [dbo].[ctl_municipio]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

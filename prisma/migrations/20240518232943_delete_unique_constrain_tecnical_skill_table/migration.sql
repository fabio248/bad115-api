BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[ctl_habilidad_tecnica] DROP CONSTRAINT [ctl_habilidad_tecnica_categoryTechnicalSkillId_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

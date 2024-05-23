BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_persona] DROP CONSTRAINT [mnt_persona_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_usuario] ADD [recomendationId] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_usuario] ADD CONSTRAINT [mnt_usuario_recomendationId_fkey] FOREIGN KEY ([recomendationId]) REFERENCES [dbo].[mnt_recomendacion]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[mnt_usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

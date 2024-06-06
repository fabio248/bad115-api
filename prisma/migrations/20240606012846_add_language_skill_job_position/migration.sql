/*
  Warnings:

  - You are about to drop the `_JobPositionToLanguage` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_JobPositionToLanguage] DROP CONSTRAINT [_JobPositionToLanguage_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_JobPositionToLanguage] DROP CONSTRAINT [_JobPositionToLanguage_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] DROP CONSTRAINT [mnt_habilidad_lenguaje_candidateId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] DROP CONSTRAINT [mnt_habilidad_lenguaje_languageId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] ALTER COLUMN [candidateId] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] ADD [jobPositionId] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[_JobPositionToLanguage];

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] ADD CONSTRAINT [mnt_habilidad_lenguaje_languageId_fkey] FOREIGN KEY ([languageId]) REFERENCES [dbo].[ctl_idioma]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] ADD CONSTRAINT [mnt_habilidad_lenguaje_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] ADD CONSTRAINT [mnt_habilidad_lenguaje_jobPositionId_fkey] FOREIGN KEY ([jobPositionId]) REFERENCES [dbo].[mnt_puesto_de_trabajo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

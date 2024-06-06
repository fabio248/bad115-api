/*
  Warnings:

  - You are about to drop the `_JobPositionToTechnicalSkill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fecha_cierre` to the `mnt_puesto_de_trabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivel_experiencias` to the `mnt_puesto_de_trabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_contrato` to the `mnt_puesto_de_trabajo` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_JobPositionToTechnicalSkill] DROP CONSTRAINT [_JobPositionToTechnicalSkill_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_JobPositionToTechnicalSkill] DROP CONSTRAINT [_JobPositionToTechnicalSkill_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] DROP CONSTRAINT [mnt_habilidad_tecnica_candidato_candidateId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] DROP CONSTRAINT [mnt_habilidad_tecnica_candidato_technicalSkillId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD [fileId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] ALTER COLUMN [candidateId] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] ADD [jobPositionId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD [estado] NVARCHAR(1000) NOT NULL CONSTRAINT [mnt_puesto_de_trabajo_estado_df] DEFAULT 'Activo',
[fecha_cierre] DATETIME2 NOT NULL,
[nivel_experiencias] NVARCHAR(1000) NOT NULL,
[technicalSkillId] NVARCHAR(1000),
[tipo_contrato] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[_JobPositionToTechnicalSkill];

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] ADD CONSTRAINT [mnt_habilidad_tecnica_candidato_technicalSkillId_fkey] FOREIGN KEY ([technicalSkillId]) REFERENCES [dbo].[ctl_habilidad_tecnica]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] ADD CONSTRAINT [mnt_habilidad_tecnica_candidato_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] ADD CONSTRAINT [mnt_habilidad_tecnica_candidato_jobPositionId_fkey] FOREIGN KEY ([jobPositionId]) REFERENCES [dbo].[mnt_puesto_de_trabajo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD CONSTRAINT [mnt_puesto_de_trabajo_technicalSkillId_fkey] FOREIGN KEY ([technicalSkillId]) REFERENCES [dbo].[ctl_habilidad_tecnica]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD CONSTRAINT [mnt_aplicacion_puesto_trabajo_fileId_fkey] FOREIGN KEY ([fileId]) REFERENCES [dbo].[mnt_archivo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

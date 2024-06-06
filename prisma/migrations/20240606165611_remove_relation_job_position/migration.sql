/*
  Warnings:

  - You are about to drop the column `technicalSkillId` on the `mnt_puesto_de_trabajo` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] DROP CONSTRAINT [mnt_puesto_de_trabajo_technicalSkillId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] DROP COLUMN [technicalSkillId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

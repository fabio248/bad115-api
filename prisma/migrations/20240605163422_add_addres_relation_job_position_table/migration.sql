/*
  Warnings:

  - You are about to drop the column `ubicacion` on the `mnt_puesto_de_trabajo` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_direccion] DROP CONSTRAINT [mnt_direccion_municipalityId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_direccion] DROP CONSTRAINT [mnt_direccion_personId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] DROP CONSTRAINT [mnt_puesto_de_trabajo_companyId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] DROP CONSTRAINT [mnt_puesto_de_trabajo_recruiterId_fkey];

-- AlterTable
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ALTER COLUMN [recruiterId] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] DROP COLUMN [ubicacion];
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD [addressId] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[mnt_persona]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_municipalityId_fkey] FOREIGN KEY ([municipalityId]) REFERENCES [dbo].[ctl_municipio]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD CONSTRAINT [mnt_puesto_de_trabajo_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[mnt_direccion]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD CONSTRAINT [mnt_puesto_de_trabajo_recruiterId_fkey] FOREIGN KEY ([recruiterId]) REFERENCES [dbo].[mnt_reclutador]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD CONSTRAINT [mnt_puesto_de_trabajo_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[mnt_empresa]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

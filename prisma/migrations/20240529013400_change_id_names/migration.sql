/*
  Warnings:

  - You are about to drop the column `companyId` on the `empresa_usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `recruiterId` on the `empresa_usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `candidateId` on the `mnt_aplicacion_puesto_trabajo` table. All the data in the column will be lost.
  - You are about to drop the column `jobPositionId` on the `mnt_aplicacion_puesto_trabajo` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `mnt_empresa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_puesto_trabajo]` on the table `mnt_aplicacion_puesto_trabajo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_usuario]` on the table `mnt_empresa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_empresa` to the `empresa_usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_reclutador` to the `empresa_usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_puesto_trabajo` to the `mnt_aplicacion_puesto_trabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_usuario` to the `mnt_empresa` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[empresa_usuarios] DROP CONSTRAINT [empresa_usuarios_companyId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[empresa_usuarios] DROP CONSTRAINT [empresa_usuarios_recruiterId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] DROP CONSTRAINT [mnt_aplicacion_puesto_trabajo_candidateId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] DROP CONSTRAINT [mnt_aplicacion_puesto_trabajo_jobPositionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[mnt_empresa] DROP CONSTRAINT [mnt_empresa_userId_fkey];

-- DropIndex
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] DROP CONSTRAINT [mnt_aplicacion_puesto_trabajo_jobPositionId_key];

-- DropIndex
ALTER TABLE [dbo].[mnt_empresa] DROP CONSTRAINT [mnt_empresa_userId_key];

-- AlterTable
ALTER TABLE [dbo].[empresa_usuarios] DROP COLUMN [companyId],
[recruiterId];
ALTER TABLE [dbo].[empresa_usuarios] ADD [id_empresa] NVARCHAR(1000) NOT NULL,
[id_reclutador] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] DROP COLUMN [candidateId],
[jobPositionId];
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD [id_candidato] NVARCHAR(1000),
[id_puesto_trabajo] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[mnt_empresa] DROP COLUMN [userId];
ALTER TABLE [dbo].[mnt_empresa] ADD [id_usuario] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD CONSTRAINT [mnt_aplicacion_puesto_trabajo_id_puesto_trabajo_key] UNIQUE NONCLUSTERED ([id_puesto_trabajo]);

-- CreateIndex
ALTER TABLE [dbo].[mnt_empresa] ADD CONSTRAINT [mnt_empresa_id_usuario_key] UNIQUE NONCLUSTERED ([id_usuario]);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD CONSTRAINT [mnt_aplicacion_puesto_trabajo_id_puesto_trabajo_fkey] FOREIGN KEY ([id_puesto_trabajo]) REFERENCES [dbo].[mnt_puesto_de_trabajo]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD CONSTRAINT [mnt_aplicacion_puesto_trabajo_id_candidato_fkey] FOREIGN KEY ([id_candidato]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_empresa] ADD CONSTRAINT [mnt_empresa_id_usuario_fkey] FOREIGN KEY ([id_usuario]) REFERENCES [dbo].[mnt_usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[empresa_usuarios] ADD CONSTRAINT [empresa_usuarios_id_empresa_fkey] FOREIGN KEY ([id_empresa]) REFERENCES [dbo].[mnt_empresa]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[empresa_usuarios] ADD CONSTRAINT [empresa_usuarios_id_reclutador_fkey] FOREIGN KEY ([id_reclutador]) REFERENCES [dbo].[mnt_reclutador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

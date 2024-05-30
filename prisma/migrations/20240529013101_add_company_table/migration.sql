/*
  Warnings:

  - You are about to drop the column `empresa` on the `mnt_puesto_de_trabajo` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `mnt_puesto_de_trabajo` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] DROP CONSTRAINT [mnt_aplicacion_puesto_trabajo_candidateId_fkey];

-- DropIndex
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] DROP CONSTRAINT [mnt_aplicacion_puesto_trabajo_candidateId_key];

-- AlterTable
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ALTER COLUMN [candidateId] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] DROP COLUMN [empresa];
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD [companyId] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[mnt_empresa] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_empresa] NVARCHAR(1000) NOT NULL,
    [descripcion_empresa] NVARCHAR(max),
    [sector] NVARCHAR(1000),
    [tamanio] NVARCHAR(1000) NOT NULL,
    [sitio_web] NVARCHAR(1000),
    [telefono_contacto] NVARCHAR(1000),
    [logo_empresa] NVARCHAR(1000),
    [tipo_empresa] NVARCHAR(1000),
    [usuarios_asignados] INT CONSTRAINT [mnt_empresa_usuarios_asignados_df] DEFAULT 0,
    [userId] NVARCHAR(1000) NOT NULL,
    [id_pais] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_empresa_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_empresa_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_empresa_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[empresa_usuarios] (
    [id] NVARCHAR(1000) NOT NULL,
    [companyId] NVARCHAR(1000) NOT NULL,
    [recruiterId] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [empresa_usuarios_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [empresa_usuarios_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD CONSTRAINT [mnt_puesto_de_trabajo_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[mnt_empresa]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD CONSTRAINT [mnt_aplicacion_puesto_trabajo_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_empresa] ADD CONSTRAINT [mnt_empresa_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[mnt_usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_empresa] ADD CONSTRAINT [mnt_empresa_id_pais_fkey] FOREIGN KEY ([id_pais]) REFERENCES [dbo].[ctl_pais]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[empresa_usuarios] ADD CONSTRAINT [empresa_usuarios_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[mnt_empresa]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[empresa_usuarios] ADD CONSTRAINT [empresa_usuarios_recruiterId_fkey] FOREIGN KEY ([recruiterId]) REFERENCES [dbo].[mnt_reclutador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

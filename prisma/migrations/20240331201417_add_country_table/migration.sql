/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `ctl_departamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `ctl_municipio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `ctl_departamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `ctl_municipio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `mnt_direccion` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ctl_departamento] ADD [codigo] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[ctl_municipio] ADD [codigo] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[mnt_direccion] ADD [countryId] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[ctl_pais] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [codigo] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_pais_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_pais_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ctl_pais_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateIndex
ALTER TABLE [dbo].[ctl_departamento] ADD CONSTRAINT [ctl_departamento_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[ctl_municipio] ADD CONSTRAINT [ctl_municipio_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[ctl_pais]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

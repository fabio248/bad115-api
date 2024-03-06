/*
  Warnings:

  - You are about to drop the `permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rol_permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario_rol` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[rol_permiso] DROP CONSTRAINT [rol_permiso_permiso_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[rol_permiso] DROP CONSTRAINT [rol_permiso_rol_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[usuario_rol] DROP CONSTRAINT [usuario_rol_rol_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[usuario_rol] DROP CONSTRAINT [usuario_rol_usuario_id_fkey];

-- DropTable
DROP TABLE [dbo].[permiso];

-- DropTable
DROP TABLE [dbo].[rol];

-- DropTable
DROP TABLE [dbo].[rol_permiso];

-- DropTable
DROP TABLE [dbo].[usuario];

-- DropTable
DROP TABLE [dbo].[usuario_rol];

-- CreateTable
CREATE TABLE [dbo].[mnt_usuario] (
    [id] NVARCHAR(1000) NOT NULL,
    [correo] NVARCHAR(1000) NOT NULL,
    [contrasena] NVARCHAR(1000) NOT NULL,
    [esta_activo] BIT NOT NULL CONSTRAINT [mnt_usuario_esta_activo_df] DEFAULT 1,
    [intentos_login] INT NOT NULL CONSTRAINT [mnt_usuario_intentos_login_df] DEFAULT 0,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_usuario_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_usuario_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_usuario_correo_key] UNIQUE NONCLUSTERED ([correo])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_usuario_rol] (
    [usuario_id] NVARCHAR(1000) NOT NULL,
    [rol_id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_usuario_rol_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_usuario_rol_pkey] PRIMARY KEY CLUSTERED ([rol_id],[usuario_id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_rol] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_rol_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_rol_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_rol_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_rol_permiso] (
    [rol_id] NVARCHAR(1000) NOT NULL,
    [permiso_id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_rol_permiso_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_rol_permiso_pkey] PRIMARY KEY CLUSTERED ([rol_id],[permiso_id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_permiso] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_permiso_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_permiso_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_permiso_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_usuario_rol] ADD CONSTRAINT [mnt_usuario_rol_usuario_id_fkey] FOREIGN KEY ([usuario_id]) REFERENCES [dbo].[mnt_usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_usuario_rol] ADD CONSTRAINT [mnt_usuario_rol_rol_id_fkey] FOREIGN KEY ([rol_id]) REFERENCES [dbo].[mnt_rol]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_rol_permiso] ADD CONSTRAINT [mnt_rol_permiso_rol_id_fkey] FOREIGN KEY ([rol_id]) REFERENCES [dbo].[mnt_rol]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_rol_permiso] ADD CONSTRAINT [mnt_rol_permiso_permiso_id_fkey] FOREIGN KEY ([permiso_id]) REFERENCES [dbo].[mnt_permiso]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

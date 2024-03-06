BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[usuario_rol] (
    [usuario_id] NVARCHAR(1000) NOT NULL,
    [rol_id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [usuario_rol_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [usuario_rol_pkey] PRIMARY KEY CLUSTERED ([rol_id],[usuario_id])
);

-- CreateTable
CREATE TABLE [dbo].[rol] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [rol_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [rol_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [rol_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[rol_permiso] (
    [rol_id] NVARCHAR(1000) NOT NULL,
    [permiso_id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [rol_permiso_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [rol_permiso_pkey] PRIMARY KEY CLUSTERED ([rol_id],[permiso_id])
);

-- CreateTable
CREATE TABLE [dbo].[permiso] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [permiso_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [permiso_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [permiso_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- AddForeignKey
ALTER TABLE [dbo].[usuario_rol] ADD CONSTRAINT [usuario_rol_usuario_id_fkey] FOREIGN KEY ([usuario_id]) REFERENCES [dbo].[usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[usuario_rol] ADD CONSTRAINT [usuario_rol_rol_id_fkey] FOREIGN KEY ([rol_id]) REFERENCES [dbo].[rol]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[rol_permiso] ADD CONSTRAINT [rol_permiso_rol_id_fkey] FOREIGN KEY ([rol_id]) REFERENCES [dbo].[rol]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[rol_permiso] ADD CONSTRAINT [rol_permiso_permiso_id_fkey] FOREIGN KEY ([permiso_id]) REFERENCES [dbo].[permiso]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

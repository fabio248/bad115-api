/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[usuario] (
    [id] NVARCHAR(1000) NOT NULL,
    [correo] NVARCHAR(1000) NOT NULL,
    [contrasena] NVARCHAR(1000) NOT NULL,
    [esta_activo] BIT NOT NULL CONSTRAINT [usuario_esta_activo_df] DEFAULT 1,
    [intentos_login] INT NOT NULL CONSTRAINT [usuario_intentos_login_df] DEFAULT 0,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [usuario_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [usuario_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [usuario_correo_key] UNIQUE NONCLUSTERED ([correo])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

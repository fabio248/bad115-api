/*
  Warnings:

  - A unique constraint covering the columns `[privacySettingsId]` on the table `mnt_persona` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_persona] ADD [privacySettingsId] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[mnt_configuracion_de_privacidad] (
    [id] NVARCHAR(1000) NOT NULL,
    [experiencia_laboral] BIT CONSTRAINT [mnt_configuracion_de_privacidad_experiencia_laboral_df] DEFAULT 0,
    [conocimiento_academico] BIT CONSTRAINT [mnt_configuracion_de_privacidad_conocimiento_academico_df] DEFAULT 0,
    [certificaciones] BIT CONSTRAINT [mnt_configuracion_de_privacidad_certificaciones_df] DEFAULT 0,
    [habilidad_tecnica] BIT CONSTRAINT [mnt_configuracion_de_privacidad_habilidad_tecnica_df] DEFAULT 0,
    [habilidad_lenguaje] BIT CONSTRAINT [mnt_configuracion_de_privacidad_habilidad_lenguaje_df] DEFAULT 0,
    [reconocimiento] BIT CONSTRAINT [mnt_configuracion_de_privacidad_reconocimiento_df] DEFAULT 0,
    [publicacione] BIT CONSTRAINT [mnt_configuracion_de_privacidad_publicacione_df] DEFAULT 0,
    [participacione] BIT CONSTRAINT [mnt_configuracion_de_privacidad_participacione_df] DEFAULT 0,
    [prueba] BIT CONSTRAINT [mnt_configuracion_de_privacidad_prueba_df] DEFAULT 0,
    [recomendacion] BIT CONSTRAINT [mnt_configuracion_de_privacidad_recomendacion_df] DEFAULT 0,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_configuracion_de_privacidad_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_configuracion_de_privacidad_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_privacySettingsId_key] UNIQUE NONCLUSTERED ([privacySettingsId]);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_privacySettingsId_fkey] FOREIGN KEY ([privacySettingsId]) REFERENCES [dbo].[mnt_configuracion_de_privacidad]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `ctl_departamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `ctl_municipio` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[ctl_departamento] ADD CONSTRAINT [ctl_departamento_codigo_key] UNIQUE NONCLUSTERED ([codigo]);

-- CreateIndex
ALTER TABLE [dbo].[ctl_municipio] ADD CONSTRAINT [ctl_municipio_codigo_key] UNIQUE NONCLUSTERED ([codigo]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

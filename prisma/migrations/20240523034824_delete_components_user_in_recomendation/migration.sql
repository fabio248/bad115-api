/*
  Warnings:

  - You are about to drop the column `apellido_del_recomendado` on the `mnt_recomendacion` table. All the data in the column will be lost.
  - You are about to drop the column `correo_del_recomendado` on the `mnt_recomendacion` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_del_recomendado` on the `mnt_recomendacion` table. All the data in the column will be lost.
  - You are about to drop the column `telefono_del_recomendado` on the `mnt_recomendacion` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_recomendacion] DROP COLUMN [apellido_del_recomendado],
[correo_del_recomendado],
[nombre_del_recomendado],
[telefono_del_recomendado];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

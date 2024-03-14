/*
  Warnings:

  - Added the required column `codigo` to the `mnt_permiso` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[mnt_permiso] DROP CONSTRAINT [mnt_permiso_nombre_key];

-- AlterTable
ALTER TABLE [dbo].[mnt_permiso] ADD [codigo] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

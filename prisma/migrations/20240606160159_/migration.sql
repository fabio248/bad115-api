/*
  Warnings:

  - You are about to drop the column `link` on the `mnt_reunion` table. All the data in the column will be lost.
  - Added the required column `enlace_reunion` to the `mnt_reunion` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_reunion] DROP COLUMN [link];
ALTER TABLE [dbo].[mnt_reunion] ADD [enlace_reunion] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

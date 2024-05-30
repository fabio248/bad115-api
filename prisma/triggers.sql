/*
    Este trigger se encarga de aumentar o disminuir la cantidad de reclutadores asignados a una empresa
*/
CREATE OR ALTER TRIGGER trg_aumentar_disminuir_reclutadores_empresa
    ON empresa_usuarios
    AFTER INSERT, UPDATE
    AS
BEGIN
    DECLARE @id_empresa VARCHAR(1000);
    DECLARE @cantidad_reclutadores INT;

    -- Si es una inserción
    IF EXISTS (SELECT 1 FROM inserted)
        BEGIN
            SELECT @id_empresa = id_empresa FROM inserted;
            SELECT @cantidad_reclutadores = COUNT(*)
            FROM empresa_usuarios
            WHERE id_empresa = @id_empresa
              AND eliminado_en IS NULL;
            UPDATE mnt_empresa SET usuarios_asignados = @cantidad_reclutadores WHERE id = @id_empresa;
        END;

    -- Si es una actualización y se le asignó un valor a eliminado_en
    IF EXISTS (SELECT 1 FROM deleted)
        BEGIN
            SELECT @id_empresa = id_empresa FROM deleted;
            IF EXISTS (SELECT 1 FROM inserted WHERE eliminado_en IS NOT NULL)
                BEGIN
                    SELECT @cantidad_reclutadores = COUNT(*)
                    FROM empresa_usuarios
                    WHERE id_empresa = @id_empresa
                      AND eliminado_en IS NULL;
                    UPDATE mnt_empresa SET usuarios_asignados = @cantidad_reclutadores WHERE id = @id_empresa;
                END;
        END;
END;
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

CREATE OR ALTER TRIGGER trg_block_user
    ON mnt_usuario
    AFTER UPDATE
                              AS
BEGIN
    DECLARE @id_usuario VARCHAR(1000);
    DECLARE @intentos_login INT;

    -- Si es una actualización
    IF EXISTS (SELECT 1 FROM inserted)
        BEGIN
            SELECT @id_usuario = id FROM inserted;
            SELECT @intentos_login = intentos_login FROM inserted;
            IF @intentos_login >= 3
            BEGIN
            UPDATE mnt_usuario SET mnt_usuario.esta_activo = 0 WHERE id = @id_usuario;
        END;
    END;
END;


-- validate date in update information meeting
CREATE OR ALTER TRIGGER trg_update_fecha
ON mnt_reunion
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @nuevaFecha DATE;
    DECLARE @idReunion NVARCHAR(36);

    SELECT @nuevaFecha = DATEADD(DAY, -1, i.fecha_de_ejecucion),
           @idReunion = i.id
    FROM inserted i;

    UPDATE mnt_tarea_programada
    SET mnt_tarea_programada.fecha_de_tarea_programadas = @nuevaFecha
    WHERE id_Reunion = @idReunion;
END;
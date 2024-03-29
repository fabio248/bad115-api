BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[mnt_usuario] ADD [avatar] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[mnt_persona] (
    [id] NVARCHAR(1000) NOT NULL,
    [fecha_nacimiento] DATETIME2 NOT NULL,
    [primer_nombre] NVARCHAR(1000) NOT NULL,
    [segundo_nombre] NVARCHAR(1000),
    [primer_apellido] NVARCHAR(1000) NOT NULL,
    [segundo_apellido] NVARCHAR(1000),
    [genero] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000),
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_persona_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [userId] NVARCHAR(1000) NOT NULL,
    [candidateId] NVARCHAR(1000),
    [recruiterId] NVARCHAR(1000),
    [adressId] NVARCHAR(1000),
    CONSTRAINT [mnt_persona_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_persona_userId_key] UNIQUE NONCLUSTERED ([userId]),
    CONSTRAINT [mnt_persona_candidateId_key] UNIQUE NONCLUSTERED ([candidateId]),
    CONSTRAINT [mnt_persona_recruiterId_key] UNIQUE NONCLUSTERED ([recruiterId]),
    CONSTRAINT [mnt_persona_adressId_key] UNIQUE NONCLUSTERED ([adressId])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_documento] (
    [id] NVARCHAR(1000) NOT NULL,
    [tipo] NVARCHAR(1000) NOT NULL,
    [numero] NVARCHAR(1000) NOT NULL,
    [persona_id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_documento_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_documento_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_direccion] (
    [id] NVARCHAR(1000) NOT NULL,
    [calle] NVARCHAR(1000) NOT NULL,
    [numero_casa] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_direccion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [departmentId] NVARCHAR(1000) NOT NULL,
    [municipalityId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_direccion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_departamento] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_departamento_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_departamento_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_municipio] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_municipio_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [departmentId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ctl_municipio_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_persona_red_social] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_usuario] NVARCHAR(1000) NOT NULL,
    [direccion_url] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_persona_red_social_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [personId] NVARCHAR(1000) NOT NULL,
    [typeSocialNetworkId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_persona_red_social_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_tipo_red_social] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_tipo_red_social_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_tipo_red_social_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_cantidato] (
    [id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_cantidato_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_cantidato_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_experiencia_laboral] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_puesto] NVARCHAR(1000) NOT NULL,
    [nombre_organizacion] NVARCHAR(1000) NOT NULL,
    [fecha_de_inicio] DATETIME2 NOT NULL,
    [fecha_de_finalizacion] DATETIME2,
    [trabajo_actual] BIT NOT NULL,
    [funciones_desempeñadas] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_experiencia_laboral_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [candidateId] NVARCHAR(1000) NOT NULL,
    [organizationContactId] NVARCHAR(1000),
    CONSTRAINT [mnt_experiencia_laboral_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_experiencia_laboral_organizationContactId_key] UNIQUE NONCLUSTERED ([organizationContactId])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_contacto_organizacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [telefono_organizacion] NVARCHAR(1000),
    [correo_organizacion] NVARCHAR(1000),
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_contacto_organizacion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_contacto_organizacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_conocimiento_academico] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_conocimiento] NVARCHAR(1000) NOT NULL,
    [tipo_conocimiento_academico] NVARCHAR(1000) NOT NULL,
    [fecha_de_inicio] DATETIME2 NOT NULL,
    [fecha_de_finalizacion] DATETIME2,
    [nombre_institucion] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_conocimiento_academico_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_conocimiento_academico_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_certificacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [fecha_de_inicio] DATETIME2 NOT NULL,
    [fecha_de_finalizacion] DATETIME2 NOT NULL,
    [nombre_certificacion] NVARCHAR(1000) NOT NULL,
    [tipo_certificacion] NVARCHAR(1000) NOT NULL,
    [codigo_certificacion] INT,
    [nombre_organizacion] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_certificacion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_certificacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_habilidad_tecnica_candidato] (
    [id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_habilidad_tecnica_candidato_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [technicalSkillId] NVARCHAR(1000) NOT NULL,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_habilidad_tecnica_candidato_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_habilidad_tecnica_candidato_technicalSkillId_key] UNIQUE NONCLUSTERED ([technicalSkillId])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_habilidad_tecnica] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_habilidad_tecnica] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_habilidad_tecnica_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [categoryTechnicalSkillId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ctl_habilidad_tecnica_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ctl_habilidad_tecnica_categoryTechnicalSkillId_key] UNIQUE NONCLUSTERED ([categoryTechnicalSkillId])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_categoria] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_categoria_habilidad_tecnica] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_categoria_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_categoria_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_habilidad_lenguaje] (
    [id] NVARCHAR(1000) NOT NULL,
    [habilidad_lenguaje] NVARCHAR(1000) NOT NULL,
    [nivel_lenguaje] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_habilidad_lenguaje_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [languageId] NVARCHAR(1000) NOT NULL,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_habilidad_lenguaje_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_habilidad_lenguaje_languageId_key] UNIQUE NONCLUSTERED ([languageId])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_idioma] (
    [id] NVARCHAR(1000) NOT NULL,
    [idioma] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_idioma_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_idioma_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_reconocimiento] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_reconocimiento] NVARCHAR(1000) NOT NULL,
    [fecha_finalizacion] DATETIME2 NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_reconocimiento_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [recognitionTypeId] NVARCHAR(1000) NOT NULL,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_reconocimiento_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_reconocimiento_recognitionTypeId_key] UNIQUE NONCLUSTERED ([recognitionTypeId])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_tipo_reconocimiento] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_tipo_reconocimiento] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_tipo_reconocimiento_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_tipo_reconocimiento_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_publicacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_publicacion] NVARCHAR(1000) NOT NULL,
    [lugar_publicacion] NVARCHAR(1000) NOT NULL,
    [tipo_publicacion] NVARCHAR(1000) NOT NULL,
    [edicion] NVARCHAR(1000),
    [isbn] NVARCHAR(1000),
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_publicacion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_publicacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_participacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [fecha_participacion] DATETIME2 NOT NULL,
    [lugar_participacion] NVARCHAR(1000) NOT NULL,
    [pais_participacion] NVARCHAR(1000) NOT NULL,
    [anfitrion_evento] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_participacion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [participationTypeId] NVARCHAR(1000) NOT NULL,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_participacion_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_participacion_participationTypeId_key] UNIQUE NONCLUSTERED ([participationTypeId])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_tipo_participacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_tipo_participacion] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_tipo_participacion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_tipo_participacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_prueba] (
    [id] NVARCHAR(1000) NOT NULL,
    [resultado] BIT NOT NULL,
    [url_archivo] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_prueba_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [testTypeId] NVARCHAR(1000) NOT NULL,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_prueba_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_prueba_testTypeId_key] UNIQUE NONCLUSTERED ([testTypeId])
);

-- CreateTable
CREATE TABLE [dbo].[ctl_tipo_prueba] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_tipo_prueba] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [ctl_tipo_prueba_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [ctl_tipo_prueba_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mtn_recomendacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre_del_recomendado] NVARCHAR(1000) NOT NULL,
    [apellido_del_recomendado] NVARCHAR(1000) NOT NULL,
    [correo_del_recomendado] NVARCHAR(1000) NOT NULL,
    [telefono_del_recomendado] NVARCHAR(1000),
    [tipo] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mtn_recomendacion_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mtn_recomendacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_reclutador] (
    [id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_reclutador_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    CONSTRAINT [mnt_reclutador_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_puesto_de_trabajo] (
    [id] NVARCHAR(1000) NOT NULL,
    [rango_salarial] NVARCHAR(1000) NOT NULL,
    [modalidad] NVARCHAR(1000) NOT NULL,
    [ubicacion] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_puesto_de_trabajo_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [recruiterId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_puesto_de_trabajo_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_requisito] (
    [id] NVARCHAR(1000) NOT NULL,
    [descripcion_requisito] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_requisito_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [jobPositionId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_requisito_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[mnt_aplicacion_puesto_trabajo] (
    [id] NVARCHAR(1000) NOT NULL,
    [creado_en] DATETIME2 NOT NULL CONSTRAINT [mnt_aplicacion_puesto_trabajo_creado_en_df] DEFAULT CURRENT_TIMESTAMP,
    [modificado_en] DATETIME2 NOT NULL,
    [eliminado_en] DATETIME2,
    [jobPositionId] NVARCHAR(1000) NOT NULL,
    [candidateId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [mnt_aplicacion_puesto_trabajo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [mnt_aplicacion_puesto_trabajo_jobPositionId_key] UNIQUE NONCLUSTERED ([jobPositionId]),
    CONSTRAINT [mnt_aplicacion_puesto_trabajo_candidateId_key] UNIQUE NONCLUSTERED ([candidateId])
);

-- CreateTable
CREATE TABLE [dbo].[_JobPositionToLanguage] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_JobPositionToLanguage_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_JobPositionToTechnicalSkill] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_JobPositionToTechnicalSkill_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_JobPositionToLanguage_B_index] ON [dbo].[_JobPositionToLanguage]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_JobPositionToTechnicalSkill_B_index] ON [dbo].[_JobPositionToTechnicalSkill]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[mnt_usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_recruiterId_fkey] FOREIGN KEY ([recruiterId]) REFERENCES [dbo].[mnt_reclutador]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona] ADD CONSTRAINT [mnt_persona_adressId_fkey] FOREIGN KEY ([adressId]) REFERENCES [dbo].[mnt_direccion]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_documento] ADD CONSTRAINT [mnt_documento_persona_id_fkey] FOREIGN KEY ([persona_id]) REFERENCES [dbo].[mnt_persona]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_departmentId_fkey] FOREIGN KEY ([departmentId]) REFERENCES [dbo].[ctl_departamento]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_direccion] ADD CONSTRAINT [mnt_direccion_municipalityId_fkey] FOREIGN KEY ([municipalityId]) REFERENCES [dbo].[ctl_municipio]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ctl_municipio] ADD CONSTRAINT [ctl_municipio_departmentId_fkey] FOREIGN KEY ([departmentId]) REFERENCES [dbo].[ctl_departamento]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona_red_social] ADD CONSTRAINT [mnt_persona_red_social_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[mnt_persona]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_persona_red_social] ADD CONSTRAINT [mnt_persona_red_social_typeSocialNetworkId_fkey] FOREIGN KEY ([typeSocialNetworkId]) REFERENCES [dbo].[ctl_tipo_red_social]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_experiencia_laboral] ADD CONSTRAINT [mnt_experiencia_laboral_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_experiencia_laboral] ADD CONSTRAINT [mnt_experiencia_laboral_organizationContactId_fkey] FOREIGN KEY ([organizationContactId]) REFERENCES [dbo].[mnt_contacto_organizacion]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_conocimiento_academico] ADD CONSTRAINT [mnt_conocimiento_academico_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_certificacion] ADD CONSTRAINT [mnt_certificacion_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] ADD CONSTRAINT [mnt_habilidad_tecnica_candidato_technicalSkillId_fkey] FOREIGN KEY ([technicalSkillId]) REFERENCES [dbo].[ctl_habilidad_tecnica]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_tecnica_candidato] ADD CONSTRAINT [mnt_habilidad_tecnica_candidato_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ctl_habilidad_tecnica] ADD CONSTRAINT [ctl_habilidad_tecnica_categoryTechnicalSkillId_fkey] FOREIGN KEY ([categoryTechnicalSkillId]) REFERENCES [dbo].[ctl_categoria]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] ADD CONSTRAINT [mnt_habilidad_lenguaje_languageId_fkey] FOREIGN KEY ([languageId]) REFERENCES [dbo].[ctl_idioma]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_habilidad_lenguaje] ADD CONSTRAINT [mnt_habilidad_lenguaje_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_reconocimiento] ADD CONSTRAINT [mnt_reconocimiento_recognitionTypeId_fkey] FOREIGN KEY ([recognitionTypeId]) REFERENCES [dbo].[ctl_tipo_reconocimiento]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_reconocimiento] ADD CONSTRAINT [mnt_reconocimiento_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_publicacion] ADD CONSTRAINT [mnt_publicacion_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_participacion] ADD CONSTRAINT [mnt_participacion_participationTypeId_fkey] FOREIGN KEY ([participationTypeId]) REFERENCES [dbo].[ctl_tipo_participacion]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_participacion] ADD CONSTRAINT [mnt_participacion_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_prueba] ADD CONSTRAINT [mnt_prueba_testTypeId_fkey] FOREIGN KEY ([testTypeId]) REFERENCES [dbo].[ctl_tipo_prueba]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_prueba] ADD CONSTRAINT [mnt_prueba_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mtn_recomendacion] ADD CONSTRAINT [mtn_recomendacion_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_puesto_de_trabajo] ADD CONSTRAINT [mnt_puesto_de_trabajo_recruiterId_fkey] FOREIGN KEY ([recruiterId]) REFERENCES [dbo].[mnt_reclutador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_requisito] ADD CONSTRAINT [mnt_requisito_jobPositionId_fkey] FOREIGN KEY ([jobPositionId]) REFERENCES [dbo].[mnt_puesto_de_trabajo]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD CONSTRAINT [mnt_aplicacion_puesto_trabajo_jobPositionId_fkey] FOREIGN KEY ([jobPositionId]) REFERENCES [dbo].[mnt_puesto_de_trabajo]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[mnt_aplicacion_puesto_trabajo] ADD CONSTRAINT [mnt_aplicacion_puesto_trabajo_candidateId_fkey] FOREIGN KEY ([candidateId]) REFERENCES [dbo].[mnt_cantidato]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_JobPositionToLanguage] ADD CONSTRAINT [_JobPositionToLanguage_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[mnt_puesto_de_trabajo]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_JobPositionToLanguage] ADD CONSTRAINT [_JobPositionToLanguage_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[ctl_idioma]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_JobPositionToTechnicalSkill] ADD CONSTRAINT [_JobPositionToTechnicalSkill_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[mnt_puesto_de_trabajo]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_JobPositionToTechnicalSkill] ADD CONSTRAINT [_JobPositionToTechnicalSkill_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[ctl_habilidad_tecnica]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

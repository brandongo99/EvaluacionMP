USE [DICRI]
GO
/****** Object:  Table [dbo].[Expediente]    Script Date: 19/11/2025 19:50:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Expediente](
	[id_expediente] [int] IDENTITY(1,1) NOT NULL,
	[numero_expediente] [varchar](50) NOT NULL,
	[fecha_registro] [datetime] NOT NULL,
	[estado] [varchar](20) NOT NULL,
	[justificacion_rechazo] [varchar](500) NULL,
	[id_tecnico] [int] NOT NULL,
	[fecha_envio] [datetime] NULL,
	[id_enviado_por] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_expediente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Indicio]    Script Date: 19/11/2025 19:50:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Indicio](
	[id_indicio] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](255) NOT NULL,
	[color] [varchar](50) NULL,
	[tamano] [varchar](50) NULL,
	[peso] [decimal](10, 2) NULL,
	[ubicacion] [varchar](255) NULL,
	[fecha_registro] [datetime] NOT NULL,
	[id_expediente] [int] NOT NULL,
	[id_tecnico] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_indicio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Revision]    Script Date: 19/11/2025 19:50:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Revision](
	[id_revision] [int] IDENTITY(1,1) NOT NULL,
	[id_expediente] [int] NOT NULL,
	[id_coordinador] [int] NOT NULL,
	[fecha_revision] [datetime] NOT NULL,
	[resultado] [bit] NOT NULL,
	[justificacion] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_revision] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rol]    Script Date: 19/11/2025 19:50:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rol](
	[id_rol] [int] IDENTITY(1,1) NOT NULL,
	[nombre_rol] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[nombre_rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 19/11/2025 19:50:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[id_usuario] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[correo] [varchar](100) NOT NULL,
	[contrasena] [varchar](255) NOT NULL,
	[id_rol] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[correo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Expediente] ADD  DEFAULT (getdate()) FOR [fecha_registro]
GO
ALTER TABLE [dbo].[Indicio] ADD  DEFAULT (getdate()) FOR [fecha_registro]
GO
ALTER TABLE [dbo].[Revision] ADD  DEFAULT (getdate()) FOR [fecha_revision]
GO
ALTER TABLE [dbo].[Expediente]  WITH CHECK ADD FOREIGN KEY([id_enviado_por])
REFERENCES [dbo].[Usuario] ([id_usuario])
GO
ALTER TABLE [dbo].[Expediente]  WITH CHECK ADD FOREIGN KEY([id_tecnico])
REFERENCES [dbo].[Usuario] ([id_usuario])
GO
ALTER TABLE [dbo].[Indicio]  WITH CHECK ADD FOREIGN KEY([id_expediente])
REFERENCES [dbo].[Expediente] ([id_expediente])
GO
ALTER TABLE [dbo].[Indicio]  WITH CHECK ADD FOREIGN KEY([id_tecnico])
REFERENCES [dbo].[Usuario] ([id_usuario])
GO
ALTER TABLE [dbo].[Revision]  WITH CHECK ADD FOREIGN KEY([id_coordinador])
REFERENCES [dbo].[Usuario] ([id_usuario])
GO
ALTER TABLE [dbo].[Revision]  WITH CHECK ADD FOREIGN KEY([id_expediente])
REFERENCES [dbo].[Expediente] ([id_expediente])
GO
ALTER TABLE [dbo].[Usuario]  WITH CHECK ADD FOREIGN KEY([id_rol])
REFERENCES [dbo].[Rol] ([id_rol])
GO

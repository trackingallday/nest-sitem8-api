USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[Worker]    Script Date: 18/09/2019 8:47:07 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Worker](
	[WorkerId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Mobile] [varchar](20) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[PayrollId] [varchar](50) NOT NULL,
	[Supervisor] [int] NULL,
	[MobileNotifications] [bit] NOT NULL,
	[EmailNotifications] [bit] NOT NULL,
	[IsEnabled] [bit] NOT NULL,
	[IsWorker] [bit] NOT NULL,
	[IsSupervisor] [bit] NOT NULL,
	[IsAdministrator] [bit] NOT NULL,
	[DeviceID] [varchar](50) NOT NULL,
	[CompanyId] [int] NOT NULL,
	[AuthId] [nchar](50) NULL,
	[Base64Image] [nvarchar](max) NULL,
	[isSuperAdministrator] [bit] NOT NULL,
 CONSTRAINT [PK__Worker__077C882663504D9B] PRIMARY KEY CLUSTERED 
(
	[WorkerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Worker] ADD  CONSTRAINT [DF__Worker__MobileNo__12FDD1B2]  DEFAULT ((0)) FOR [MobileNotifications]
GO

ALTER TABLE [dbo].[Worker] ADD  CONSTRAINT [DF__Worker__EmailNot__13F1F5EB]  DEFAULT ((0)) FOR [EmailNotifications]
GO

ALTER TABLE [dbo].[Worker] ADD  CONSTRAINT [DF__Worker__IsEnable__14E61A24]  DEFAULT ((0)) FOR [IsEnabled]
GO

ALTER TABLE [dbo].[Worker] ADD  CONSTRAINT [DF__Worker__IsWorker__15DA3E5D]  DEFAULT ((0)) FOR [IsWorker]
GO

ALTER TABLE [dbo].[Worker] ADD  CONSTRAINT [DF__Worker__IsSuperv__16CE6296]  DEFAULT ((0)) FOR [IsSupervisor]
GO

ALTER TABLE [dbo].[Worker] ADD  CONSTRAINT [DF__Worker__IsAdmini__17C286CF]  DEFAULT ((0)) FOR [IsAdministrator]
GO

ALTER TABLE [dbo].[Worker] ADD  CONSTRAINT [DF_Worker_isSuperAdministrator]  DEFAULT ((0)) FOR [isSuperAdministrator]
GO

ALTER TABLE [dbo].[Worker]  WITH CHECK ADD  CONSTRAINT [FK_Worker_Company] FOREIGN KEY([CompanyId])
REFERENCES [dbo].[Company] ([CompanyId])
GO

ALTER TABLE [dbo].[Worker] CHECK CONSTRAINT [FK_Worker_Company]
GO

ALTER TABLE [dbo].[Worker]  WITH CHECK ADD  CONSTRAINT [FK_Worker_Worker] FOREIGN KEY([WorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

ALTER TABLE [dbo].[Worker] CHECK CONSTRAINT [FK_Worker_Worker]
GO


USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[Site]    Script Date: 18/09/2019 8:39:20 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Site](
	[SiteId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Geom] [geography] NULL,
	[Active] [bit] NOT NULL,
	[CompanyId] [int] NOT NULL,
	[SitePayrollId] [varchar](50) NULL,
 CONSTRAINT [PK__Site__B9DCB963F1488976] PRIMARY KEY CLUSTERED 
(
	[SiteId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Site] ADD  CONSTRAINT [DF_Site_Active]  DEFAULT ((0)) FOR [Active]
GO

ALTER TABLE [dbo].[Site]  WITH CHECK ADD  CONSTRAINT [FK_Site_Company] FOREIGN KEY([CompanyId])
REFERENCES [dbo].[Company] ([CompanyId])
GO

ALTER TABLE [dbo].[Site] CHECK CONSTRAINT [FK_Site_Company]
GO


USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[LocationTimestamp]    Script Date: 18/09/2019 8:38:42 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[LocationTimestamp](
	[LocationTimestampId] [int] IDENTITY(1,1) NOT NULL,
	[DeviceID] [varchar](50) NOT NULL,
	[WorkerId] [int] NULL,
	[CreationDateTime] [datetime] NOT NULL,
	[Latitude] [numeric](20, 6) NULL,
	[Longitude] [numeric](20, 6) NULL,
	[Battery] [int] NOT NULL,
	[ClosestSiteId] [int] NULL,
	[ClosestSiteDistance] [decimal](18, 0) NULL,
	[LocationDateTime] [datetime] NOT NULL,
	[RawData] [varchar](150) NOT NULL,
	[Charging] [bit] NOT NULL,
	[SosButton] [bit] NOT NULL,
	[SignalStrength] [int] NOT NULL,
	[Altitude] [numeric](20, 6) NULL,
	[CompanyId] [int] NOT NULL,
	[Geom] [geography] NULL,
 CONSTRAINT [PK__Location__64889FF488D56F22] PRIMARY KEY CLUSTERED 
(
	[LocationTimestampId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[LocationTimestamp] ADD  CONSTRAINT [DF__LocationT__Creat__09A971A2]  DEFAULT (getdate()) FOR [CreationDateTime]
GO

ALTER TABLE [dbo].[LocationTimestamp]  WITH NOCHECK ADD  CONSTRAINT [FK__LocationT__Worke__0D7A0286] FOREIGN KEY([WorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
NOT FOR REPLICATION 
GO

ALTER TABLE [dbo].[LocationTimestamp] NOCHECK CONSTRAINT [FK__LocationT__Worke__0D7A0286]
GO

ALTER TABLE [dbo].[LocationTimestamp]  WITH CHECK ADD  CONSTRAINT [FK_LocationTimestamp_Company] FOREIGN KEY([CompanyId])
REFERENCES [dbo].[Company] ([CompanyId])
GO

ALTER TABLE [dbo].[LocationTimestamp] CHECK CONSTRAINT [FK_LocationTimestamp_Company]
GO

ALTER TABLE [dbo].[LocationTimestamp]  WITH CHECK ADD  CONSTRAINT [FK_LocationTimestamp_Site] FOREIGN KEY([ClosestSiteId])
REFERENCES [dbo].[Site] ([SiteId])
GO

ALTER TABLE [dbo].[LocationTimestamp] CHECK CONSTRAINT [FK_LocationTimestamp_Site]
GO


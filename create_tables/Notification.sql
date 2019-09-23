USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[Notification]    Script Date: 18/09/2019 8:39:00 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Notification](
	[NotificationID] [int] IDENTITY(1,1) NOT NULL,
	[WorkerId] [int] NOT NULL,
	[CreationDateTime] [datetime] NOT NULL,
	[SmsSentDateTime] [datetime] NULL,
	[EmailSentDateTime] [datetime] NULL,
	[Category] [varchar](50) NOT NULL,
	[Description] [varchar](255) NOT NULL,
	[SmsStatus] [int] NOT NULL,
	[EmailStatus] [int] NOT NULL,
	[MobileNumber] [varchar](50) NOT NULL,
	[EmailAddress] [varchar](50) NOT NULL,
 CONSTRAINT [PK__Notifica__20CF2E327696D1A9] PRIMARY KEY CLUSTERED 
(
	[NotificationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Notification] ADD  CONSTRAINT [DF__Notificat__Creat__634EBE90]  DEFAULT (getdate()) FOR [CreationDateTime]
GO

ALTER TABLE [dbo].[Notification]  WITH CHECK ADD  CONSTRAINT [FK__Notificat__Email__681373AD] FOREIGN KEY([WorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

ALTER TABLE [dbo].[Notification] CHECK CONSTRAINT [FK__Notificat__Email__681373AD]
GO


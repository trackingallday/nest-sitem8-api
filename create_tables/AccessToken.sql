USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[AccessToken]    Script Date: 18/09/2019 8:35:41 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[AccessToken](
	[WorkerId] [int] NOT NULL,
	[CreationDateTime] [datetime] NOT NULL,
	[AccessTokenId] [nchar](10) NOT NULL,
 CONSTRAINT [PK_AccessToken] PRIMARY KEY CLUSTERED 
(
	[AccessTokenId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[AccessToken]  WITH CHECK ADD  CONSTRAINT [FK_AccessToken_Worker] FOREIGN KEY([WorkerId])
REFERENCES [dbo].[Worker] ([WorkerId])
GO

ALTER TABLE [dbo].[AccessToken] CHECK CONSTRAINT [FK_AccessToken_Worker]
GO


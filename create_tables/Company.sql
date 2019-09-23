USE [SiteM8-Test1]
GO

/****** Object:  Table [dbo].[Company]    Script Date: 18/09/2019 8:36:25 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Company](
	[CompanyId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[NextProcessingTime] [datetime] NOT NULL,
	[StartDayOfWeek] [int] NOT NULL,
	[NextApprovalReminderTime] [datetime] NOT NULL,
	[MinimumWorkingDayDuration] [time](7) NOT NULL,
	[WorkingDayEarliestStart] [time](7) NOT NULL,
	[WorkingDayDefaultStart] [time](7) NOT NULL,
	[WorkingDayLatestFinish] [time](7) NOT NULL,
	[WorkingDayDefaultFinish] [time](7) NOT NULL,
	[MinimumLunchStart] [time](7) NOT NULL,
	[DefaultLunchStart] [time](7) NOT NULL,
	[DefaultLunchEnd] [time](7) NOT NULL,
	[MaximumLunchEnd] [time](7) NOT NULL,
	[GlitchRemovalPeriod] [time](7) NOT NULL,
	[MinimumWorkingTimeToRemoveLunchBreak] [time](7) NOT NULL,
	[PrivateModeStart] [time](7) NOT NULL,
	[PrivateModeFinish] [time](7) NOT NULL,
	[DailyTimesheetProcessing] [time](7) NOT NULL,
	[DailyApprovalReminder] [time](7) NOT NULL,
	[DemoCount] [int] NOT NULL,
	[CustomSettings] [varchar](max) NULL,
 CONSTRAINT [PK_Company] PRIMARY KEY CLUSTERED 
(
	[CompanyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Company] ADD  CONSTRAINT [DF_Company_DemoCount]  DEFAULT ((0)) FOR [DemoCount]
GO


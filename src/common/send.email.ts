import * as nodemailer from 'nodemailer';
import * as base64Img from 'base64-img';
import constants from '../constants';

const { gmail } = constants;

export class Email {
  transporter: any;
  messageTemplate = `<table ><tbody>
   <tr><td><table align=\'center\'><tr><td><img style=\'display: block; margin-left: auto; margin-right: auto;\' src=\'{logoSource}\' />
   </td></tr></table></td></tr>
   <tr style=\'height: 25px\'><td></td></tr>
   <tr><td style=\'width: 100%; text-align: center;\'><span style=\'font-family: helvetica; font-size: 20pt;\'>{message}</span></td></tr>
   <tr style=\'height: 50px\'><td></td></tr>
   <tr><td style=\'width: 100%; text-align: center;\'><span style=\'font-family: helvetica; font-size: 8pt;\'>
   This email has been sent by SiteM8 on behalf of {company}.</span></td></tr>
   <tr><td style=\'width: 100%; text-align: center;\'><span style=\'font-size: 8pt;\'><span style=\'font-family: helvetica;\'>
   Please contact your SiteM8 administrator at {company} if you require your notification settings to be changed.</span>
   <span style=\'font-family: helvetica;\'><br /></span></span></td></tr>
   </tbody></table>`;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.googlemail.com', // Gmail Host
      port: 587, // Port
      secure: true,
      auth: {
        user: gmail.username,
        pass: gmail.password,
      },
    });
  }

  async sendMail(message: string, emailAddress: string, category: string, companyName: string) {
    const mailOptions: MailOptions = new MailOptions();
    // Adding logo as attachment
    const attachment = base64Img.base64Sync('../assets/images/logo.png');
     // mailOptions.attachments.push({ // use URL as an attachment
    //   filename: 'emaillogo.png',
    //   path: 'assets/images/emaillogo.png',
    // });
    mailOptions.subject = `${category} Notification from SiteM8`;
    mailOptions.html = this.messageTemplate.replace('{company}', companyName).replace('{message}', message)
    .replace('{logoSource}', attachment);

    this.transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return {info: err, code: 400};
      } else {
        return {info, code: 200};
      }
   });
  }
}

// tslint:disable-next-line:max-classes-per-file
export class MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments: any[];
}

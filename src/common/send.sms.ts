import * as Twilio from 'twilio';
import axios from 'axios';
import constants from '../constants';

const { twilio_sms } = constants;
const client: any = new (Twilio as any)(twilio_sms.accountSid, twilio_sms.authToken);

// start sending message
export async function sendSMS(phoneNumber: string, messageBody: string) {
  // Sending msgs in chunks if it's long.
  const messageChucks = messageBody.split(/(.{160})/).filter(O => O);
  try {
    let response;
    messageChucks.forEach(async (msg) => {
      const textContent = {
        body: messageBody,
        to: phoneNumber,
        from: twilio_sms.twilioSenderNumber,
        provideFeedback: true,
      };
      response = await client.messages.create(textContent);
    });
    return { info: response, code: 200 };
  } catch (error) {
    return { info: error, code: 400 };
  }
}

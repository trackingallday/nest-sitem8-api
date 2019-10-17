export default {
  auth0_m2m_api: { // for the sitem8 test auth0 acc
    client_secret: '2d4LxsCIurle9tmt3bTHFIgr4ad00OZf7Z8W7uSD0lcBr-Q4qN6HxB_qZNKbhKth',
    client_id: 'cVEE6C92WgEw0z7UCGWY3ngCpvkCqSq6',
    domain: 'sitem8.au.auth0.com',
    audience: 'https://sitem8.au.auth0.com/api/v2/',
    connection: 'Username-Password-Authentication',
    callback_url: 'https://test.app.sitem8.com',
  },
  auth0_clientside: {
    domain: 'sitem8.au.auth0.com',
    client_id: 'Wklj110vB6fxBQ4FnUDHBtQtWPEXkoHY',
    client_secret: 'V8h199upY_tRxUu_gaRO6op2c54G1rgw9K11mVGZy1i3_H8yTsD_JBkamk8SrlLB',
  },
  twilio_sms: {
    accountSid: 'AC93f4fe567250a98ffdbb494b0117f4c8',
    authToken: 'ace68afe2978da39b38c5a96f366dcf5',
    twilioSenderNumber: '+644354564',
    balance_url: 'https://api.twilio.com/2010-04-01/Accounts/AC93f4fe567250a98ffdbb494b0117f4c8/Balance.json',
    basicAuth: {withCredentials: true, headers: { Authorization:  'Basic '
    + Buffer.from('AC93f4fe567250a98ffdbb494b0117f4c8:ace68afe2978da39b38c5a96f366dcf5').toString('base64')} },
  },
  gmail: {
    username: 'xxx',
    password: 'xxx',
  },
  repositories: {
    items: 'ITEMS_REPOSITORY',
  },
};

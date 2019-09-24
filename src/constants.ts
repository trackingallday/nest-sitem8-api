export default {
  auth0_m2m_api: {
    client_secret: '2d4LxsCIurle9tmt3bTHFIgr4ad00OZf7Z8W7uSD0lcBr-Q4qN6HxB_qZNKbhKth',
    client_id: 'cVEE6C92WgEw0z7UCGWY3ngCpvkCqSq6',
    domain: 'sitem8.au.auth0.com',
    api_id: 'https://sitem8.au.auth0.com/api/v2/',
  },
  auth0_clientside: {
    domain: 'sitem8.au.auth0.com',
    client_id: 'Wklj110vB6fxBQ4FnUDHBtQtWPEXkoHY',
    client_secret: 'V8h199upY_tRxUu_gaRO6op2c54G1rgw9K11mVGZy1i3_H8yTsD_JBkamk8SrlLB',
  },
  db: {
    dev: {
      provide: 'SEQUELIZE',
      dialect: 'postgres',
      host: 'localhost',
      port: 5342,
      username: 'site-m8',
      password: 'sitemateapi',
      database: 'sitem8-api',
    },
  },
  repositories: {
    items: 'ITEMS_REPOSITORY',
  }
}

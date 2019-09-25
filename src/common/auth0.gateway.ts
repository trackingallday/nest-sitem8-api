import axios from 'axios';
import * as passwordGenerator from 'generate-password';
import constants from '../constants';

const { auth0_m2m_api } = constants;

const baseUrl = "https://sitem8.au.auth0.com/";

const tokenCredentials =  {
  grant_type: "client_credentials",
  client_id: auth0_m2m_api.client_id,
  client_secret: auth0_m2m_api.client_secret,
  audience: auth0_m2m_api.audience,
};


export default class Auth0Gateway {

  async getTokenFromAuth0() {
    const headers = { 'content-type': 'application/json' };
    const { data } = await axios.post(`${baseUrl}oauth/token`, tokenCredentials, { headers });
    const { access_token } = data;
    return access_token;
  }

  getHeaders(access_token: string): any {
    return {
      'content-type': 'application/json',
      'authorization': `Bearer ${access_token}`,
    }
  }

  async createUser(email: string) {
    const token = await this.getTokenFromAuth0();
    const password = passwordGenerator.generate({ length: 12, numbers: true });
    const params = { email, password, connection: auth0_m2m_api.connection };
    const headers = this.getHeaders(token);
    const { data } = await axios.post(`${baseUrl}api/v2/users`, params, { headers });
    return data;
  }

  async updateUser(dbuser: any) {
    const { email, authId } = dbuser;
    const token = await this.getTokenFromAuth0();
    const params = { email, connection: auth0_m2m_api.connection };
    const headers = this.getHeaders(token);
    const { data } = await axios.patch(`${baseUrl}api/v2/users/${authId}`, params, { headers });
    return data;
  }

  async resetUserPassword(authId: string) {
    const token = await this.getTokenFromAuth0();
    const headers = this.getHeaders(token);
    const params = { result_url: auth0_m2m_api.callback_url, user_id: authId, mark_email_as_verified: true };
    const { data } = await axios.post(`${baseUrl}api/v2/tickets/password-change`, params, { headers });
    return data.ticket;
  }

  async deleteUser(authId: string) {
    const token = await this.getTokenFromAuth0();
    const headers = this.getHeaders(token);
    const{ data } = await axios.delete(`${baseUrl}api/v2/users/${authId}`, { headers });
    return data;
  }
}



import Auth0Gateway, { baseUrl } from '../src/common/auth0.gateway';
import axios from 'axios';

const email = Math.random() + 'rimu.aw23.lol@chickens.org';
const email2 = Math.random() + 'dave.aw3s.lol@chickens.org';

jest.mock('axios');
axios.patch.mockResolvedValue({ data: { ticket: 'a', access_token: 'c' }});
axios.post.mockResolvedValue({ data: { ticket: 'a', access_token: 'c' }});
axios.delete.mockResolvedValue({ data: { ticket: 'a', access_token: 'c' }})


describe('auth0 user methods', () => {
  let authId = "";
  const gway = new Auth0Gateway();
  it('creates a user', async () => {
    const data = await gway.createUser(email);
    expect(axios.post).toBeCalledTimes(2);
  });
  it('resets user password', async () => {
    const data = await gway.resetUserPassword(authId);
    expect(axios.post).toBeCalledTimes(4);
  });
  it('updates a user', async () => {
    const data = await gway.updateUser({ email: email2, authId });
    expect(axios.patch).toBeCalledTimes(1);
    expect(axios.post).toBeCalledTimes(5);
  });
  it('deletes a user', async () => {
    const data = await gway.deleteUser(authId);
    expect(axios.delete).toBeCalledTimes(1);
    expect(axios.post).toBeCalledTimes(6);
  });
});

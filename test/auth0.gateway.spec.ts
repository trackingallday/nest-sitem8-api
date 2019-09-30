
import Auth0Gateway from '../src/common/auth0.gateway';


const email = Math.random() + 'rimu.aw23.lol@chickens.org';
const email2 = Math.random() + 'dave.aw3s.lol@chickens.org';


describe('auth0 user methods', () => {
  let authId = "";
  const gway = new Auth0Gateway();
  it('creates a user', async () => {
    const data = await gway.createUser(email);
    authId = data.user_id;
    expect(authId).not.toBe(undefined);
    expect(data.email).toBe(email);
  });
  it('resets user password', async () => {
    const data = await gway.resetUserPassword(authId);
    expect(data).toContain('reset?ticket');
  });
  it('updates a user', async () => {
    const data = await gway.updateUser({ email: email2, authId });
    expect(data.email).toBe(email2);
  });
  it('deletes a user', async () => {
    const data = gway.deleteUser(authId);
    expect(typeof data).toBe('object');
  });
});

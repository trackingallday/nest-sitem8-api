import generator = require('generate-password');

export async function createPassword(pwdLength: number): Promise<string> {

  return  generator.generate({
    length: pwdLength,
    uppercase: true,
    numbers: true,
  });

}

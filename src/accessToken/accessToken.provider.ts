
import { AccessToken } from './accessToken.entity';


export const AccessTokenProvider = [
  {
    provide: 'ACCESSTOKEN_REPOSITORY',
    useValue: AccessToken,
  },
];


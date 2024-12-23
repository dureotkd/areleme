import { Service } from 'typedi';
import request from 'request-promise-native';

import config from '../config';

/**
 * https://developers.kakao.com/docs/latest/ko/local/dev-guide
 */
@Service()
export default class KaKaoService {
  constructor() {}

  public async searchLocation(lat: number, lng: number) {
    const { address } = await request('https://dapi.kakao.com/v2/local/geo/coord2address', {
      qs: {
        x: lng,
        y: lat,
      },
      headers: {
        Authorization: `KakaoAK ${config.kakao.rest_api_key}`,
      },
    }).then((res) => {
      const { documents } = JSON.parse(res);
      return documents[0];
    });

    return address;
  }

  public async login() {}
}

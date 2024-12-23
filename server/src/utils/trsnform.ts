type NaverData = {
  cortarNo: string;
  centerLat: number;
  centerLon: number;
  cortarName: string;
};

type DabangData = {
  code: string;
  location: { lat: number; lng: number };
  name: string;
};

type CommonLocalData = {
  code: string;
  lat: number;
  lng: number;
  name: string;
  type: 'naver' | 'dabang' | 'zigbang';
};

type CommonRegionData = CommonLocalData & {
  localCode: string;
};

type CommonDongData = CommonLocalData & {
  localCode: string;
  regionCode: string;
};

export const transformNaverLocal = (data: NaverData[]): CommonLocalData[] => {
  return data.map((item) => ({
    code: item.cortarNo,
    lat: item.centerLat,
    lng: item.centerLon,
    name: item.cortarName,
    type: 'naver',
  }));
};

export const transformNaverRegion = (data: any[]): any[] => {
  const res = data.map((item) => {
    return {
      code: item.cortarNo,
      lat: item.centerLat,
      lng: item.centerLon,
      name: item.cortarName,
      type: 'naver',
      localCode: item.localCode,
    };
  });

  return res;
};

export const transformNaverDong = (data: any[]): any[] => {
  const res = data.map((item) => {
    return {
      code: item.cortarNo,
      lat: item.centerLat,
      lng: item.centerLon,
      name: item.cortarName,
      type: 'naver',
      localCode: item.localCode,
      regionCode: item.regionCode,
    };
  });

  return res;
};

export const transformDabangLocal = (data: DabangData[]): CommonLocalData[] => {
  return data.map((item) => ({
    code: item.code,
    lat: item.location.lat,
    lng: item.location.lng,
    name: item.name,
    type: 'dabang',
  }));
};

export const transformDabangRegion = (data: Record<string, any[]>): Record<string, CommonLocalData[]> => {
  const res: Record<string, any> = {};

  for (const [localCode, regions] of Object.entries(data)) {
    const regionList = regions.map((item) => {
      return {
        code: item.code,
        lat: item.location.lat,
        lng: item.location.lng,
        name: item.name,
        type: 'dabang',
      };
    });

    res[localCode] = regionList;
  }

  return res;
};

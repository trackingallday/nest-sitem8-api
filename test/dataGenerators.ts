

export function genLocationTimestamp(deviceId: string, lat: number, lon: number, index) {
  const date = new Date();
  date.setMinutes(new Date().getMinutes() - (index + 10))
  return {
     deviceId: deviceId,
     creationDateTime: date,
     latitude: lat,
     longitude: lon,
     battery: 25,
     locationDateTime: date,
     rawData: `MT;6;${deviceId};R13;190507225204+00:83:8a:8a:20:71,-221,bb:2d:78:8a:20:71,-221+5,422275,28151,530,29059+3+4219+184`,
     charging: false,
     sosButton: false,
     altitude: 10,
     geom: {
      type: 'Point',
      coordinates: [
          lon,
          lat,
      ],
    },
    companyId: 1,
    closestSiteId: undefined,
    closestSiteDistance: undefined,
    workerId: undefined,
  }
}


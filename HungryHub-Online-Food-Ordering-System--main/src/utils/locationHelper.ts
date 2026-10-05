import { Restaurant } from '../types';

export function getLocalizedRestaurants(restaurants: Restaurant[], selectedLocation: string): Restaurant[] {
  const areaName = selectedLocation.split(',')[0]?.trim() || selectedLocation;
  const cityName = selectedLocation.split(',')[1]?.trim() || 'Hyderabad';

  return restaurants.map((r) => {
    let localizedAddress = `${areaName} Main Branch, ${cityName}`;
    let distanceStr = '1.2 km';

    if (r.id === 'rest-1') {
      localizedAddress = `Cyber Towers Junction, ${areaName}, ${cityName}`;
      distanceStr = '1.2 km';
    } else if (r.id === 'rest-2') {
      localizedAddress = `Food Street, ${areaName}, ${cityName}`;
      distanceStr = '1.8 km';
    } else if (r.id === 'rest-3') {
      localizedAddress = `5th Block Main Rd, ${areaName}, ${cityName}`;
      distanceStr = '0.9 km';
    } else if (r.id === 'rest-4') {
      localizedAddress = `Royal Plaza, ${areaName}, ${cityName}`;
      distanceStr = '2.4 km';
    } else if (r.id === 'rest-5') {
      localizedAddress = `Kondapur X-Roads, ${areaName}, ${cityName}`;
      distanceStr = '1.5 km';
    } else if (r.id === 'rest-6') {
      localizedAddress = `Cloud Kitchen Hub, ${areaName}, ${cityName}`;
      distanceStr = '0.8 km';
    }

    return {
      ...r,
      address: localizedAddress,
      distance: distanceStr,
    };
  });
}

export type OfferType = {
  city: CityType;
  bedrooms: number;
  description: string;
  goods: string[];
  host: HostType;
  id: number;
  images: string[];
  isFavorite: boolean;
  isPremium: boolean;
  location: LocationType;
  maxAdults: number;
  previewImage: string;
  price: number;
  rating: number;
  title: string;
  type: string;
};

type LocationType = {
    latitude: number;
    longitude: number;
    zoom: number;
}

type CityType = {
    location: LocationType;
    name: string;
}

export type HostType = {
  avatarUrl: string;
  id:number;
  isPro: boolean;
  name: string;
}

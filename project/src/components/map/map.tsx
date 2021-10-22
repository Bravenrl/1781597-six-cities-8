import { useEffect, useRef } from 'react';
import useMap from '../../hooks/useMap';
import { MapStyleType, OfferType } from '../../types/offer';
import 'leaflet/dist/leaflet.css';
import { Icon, Marker } from 'leaflet';
import { useHistory } from 'react-router';
import { AppRoute, PageType } from '../../const';


type MapProrsType = {
  offers : OfferType[];
  city: string;
  selectedId: number;
  className: string;
}

const CustomIcon = {
  DEFAULT: 'img/pin.svg',
  CURRENT: 'img/pin-active.svg',
};

const defaultCustomIcon = new Icon({
  iconUrl: CustomIcon.DEFAULT,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const currentCustomIcon = new Icon({
  iconUrl: CustomIcon.CURRENT,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const getStyleByClassName = (className:string) : MapStyleType| Omit<MapStyleType, 'margin'> => {
  switch (className) {
    case PageType.Main:
      return {height: '550px', width: '512px'};
    default:
      return {height: '579px', width: '1144px', margin:'auto'};
  }
};

function Map({offers, city, selectedId, className} :  MapProrsType) : JSX.Element {

  const currentCity = offers[0].city;
  const mapRef = useRef(null);
  const map = useMap(mapRef, currentCity);
  const history = useHistory();

  useEffect(() => {
    let markers: Marker[] = [];
    if (map) {
      markers = offers.map((offer) => {
        const marker = new Marker({
          lat: offer.location.latitude,
          lng: offer.location.longitude,
        });

        const onMarkerClickHandler = () : void => {
          history.push(`${AppRoute.RoomProprety.slice(0, -3)}${offer.id}`);
        };

        marker.addEventListener('click' , onMarkerClickHandler);
        marker
          .setIcon(
            selectedId !== undefined && offer.id === selectedId
              ? currentCustomIcon
              : defaultCustomIcon,
          );
        marker.addTo(map);
        return marker;
      });
    }
    return () => markers.forEach((marker) => marker.remove());
  }, [map, offers, selectedId, history]);

  useEffect(() => {
    const {latitude, longitude, zoom} = currentCity.location;
    if (map) {
      map.flyTo([latitude, longitude], zoom);
    }
  }, [currentCity, map]);

  return (
    <section className={`${className}__map map`}
      style={getStyleByClassName(className)}
      ref = {mapRef}
    >
    </section>
  );
}

export default Map;
import { useEffect, useRef } from 'react';
import useMap from '../../hooks/use-map';
import { CityType, MapStyleType, OfferType } from '../../types/offer';
import 'leaflet/dist/leaflet.css';
import { Icon, LayerGroup, Marker } from 'leaflet';
import { AppRoute, Cities, PageType, TestID } from '../../const';
import { generatePath, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentId } from '../../store/user-process/selectors';
import { getCurrentOffer } from '../../store/app-data/selectors';
import { MapClass } from '../../class-const';


type MapProrsType = {
  offers: OfferType[];
  pageType: string;
  city: string;
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

const getStyleByPageName = (pageType: string): MapStyleType | Omit<MapStyleType, 'margin'> => {
  switch (pageType) {
    case PageType.Main:
      return { height: '550px', width: '512px' };
    default:
      return { height: '579px', width: '1144px', margin: 'auto' };
  }
};

function Map({ offers, pageType, city }: MapProrsType): JSX.Element {
  const selectedId = useSelector(getCurrentId);
  const currentOffer = useSelector(getCurrentOffer);
  const currentPin = currentOffer.id ?? selectedId;
  const currentCity = Cities.get(city) as CityType;
  const mapRef = useRef(null);
  const map = useMap(mapRef, currentCity);
  const history = useHistory();

  useEffect(() => {
    const markersGroup = new LayerGroup();
    if (map) {
      offers.forEach((offer) => {
        const marker = new Marker({
          lat: offer.location.latitude,
          lng: offer.location.longitude,
        });

        const onMarkerClickHandler = (): void => {
          const linkPath = generatePath(AppRoute.RoomProprety, { id: offer.id });
          history.push(linkPath);
        };

        marker.addEventListener('click', onMarkerClickHandler);
        marker
          .setIcon(
            offer.id === currentPin
              ? currentCustomIcon
              : defaultCustomIcon,
          );
        markersGroup.addLayer(marker);
      });
      markersGroup.addTo(map);
    }
    return () => {
      markersGroup.remove();
    };
  }, [map, offers, currentPin, history]);

  useEffect(() => {
    const { latitude, longitude, zoom } = currentCity.location;
    if (map) {
      map.flyTo([latitude, longitude], zoom);
    }
  }, [currentCity, map]);

  return (
    <section className={`${(pageType===PageType.Main) ? MapClass.Main : MapClass.Property} map`}
      style={getStyleByPageName(pageType)}
      ref={mapRef}
      data-testid= {TestID.MapSection}
    >
    </section>
  );
}

export default Map;

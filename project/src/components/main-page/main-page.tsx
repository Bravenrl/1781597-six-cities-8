import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { PageType } from '../../const';
import { State } from '../../types/state';
import HeaderLogo from '../header-logo/header-logo';
import HeaderNav from '../header-nav/header-nav';
import Map from '../map/map';
import OfferList from '../offer-list/offer-list';
import CityList from '../city-list/city-list';
import { getCurrentOffers } from '../../utils';
import PlacesOption from '../places-option/places-options';


type MainPagePropsType = {
}

type PropsFromReduxType = ConnectedProps<typeof connector>
type ConnectedComponentPropsType = PropsFromReduxType & MainPagePropsType;

const mapStateToProps = ({city, offers}: State) => ({
  city,
  offers,
});


const connector = connect(mapStateToProps);


function MainPage (props : ConnectedComponentPropsType): JSX.Element {
  const {city, offers} = props;

  const [activeOfferId, setActiveOfferId] = useState(0);

  const handleActiveOffer = (id:number):void => {
    setActiveOfferId(id);
  };


  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <HeaderLogo />
            <HeaderNav />
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CityList />
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{getCurrentOffers(offers, city).length} places to stay in {city}</b>
              <PlacesOption />
              <OfferList offers={offers} pageType={PageType.Main} handleActiveOffer={handleActiveOffer} city={city}/>
            </section>
            <div className="cities__right-section">
              <Map offers = {offers} selectedId={activeOfferId} className='cities' city={city}/>
            </div>
          </div>
        </div>
      </main>
    </div>);
}

export {MainPage};
export default connector(MainPage);

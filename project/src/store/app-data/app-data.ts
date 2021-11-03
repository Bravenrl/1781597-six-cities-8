import { createReducer } from '@reduxjs/toolkit';
import { EmptyComment } from '../../const';
import { OfferType } from '../../types/offer';
import { AppData } from '../../types/state';
import { addComent, addComentRating, addUserEmail, loadCurrentOffer, loadNearbyOffers, loadOffers, loadReviews } from '../action';

const initialState: AppData = {
  offers: [],
  userEmail: '',
  currentOffer: {} as OfferType,
  nearbyOffers: [],
  reviews: [],
  comment: EmptyComment.comment,
  commentRating: EmptyComment.rating,
};

const appData = createReducer(initialState, (builder) => {
  builder
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(addUserEmail, (state, action) => {
      state.userEmail = action.payload;
    })
    .addCase(loadCurrentOffer, (state, action) => {
      state.currentOffer = action.payload;
    })
    .addCase(loadNearbyOffers, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(loadReviews, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(addComent, (state, action) => {
      state.comment = action.payload;
    })
    .addCase(addComentRating, (state, action) => {
      state.commentRating = action.payload;
    });
});


export { appData };
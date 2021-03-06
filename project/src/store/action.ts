import { createAction } from '@reduxjs/toolkit';
import { AppRoute, AuthorizationStatus, SortType } from '../const';
import { ActionType } from '../types/action';
import { OfferType } from '../types/offer';
import { ReviewType } from '../types/review';

export const changeCity = createAction(
  ActionType.ChangeCity,
  (cityName: string) => ({ payload: cityName }));

export const loadOffers = createAction(
  ActionType.LoadOffers,
  (offers: OfferType[]) => ({ payload: offers }));

export const changeSorting = createAction(
  ActionType.ChangeSorting,
  (option: SortType) => ({ payload: option }));

export const toggleIsLoading = createAction(
  ActionType.isLoading,
  (isLoading: boolean) => ({ payload: isLoading }));

export const requireAuthorization = createAction(
  ActionType.RequireAuthorization,
  (status: AuthorizationStatus) => ({ payload: status }));

export const requireLogout = createAction(
  ActionType.RequireLogout,
  () => ({ payload: AuthorizationStatus.NoAuth }));

export const addUserEmail = createAction(
  ActionType.UserEmail,
  (email: string) => ({ payload: email }));

export const redirectToRoute = createAction(
  ActionType.RedirectToRoute,
  (url: AppRoute) => ({ payload: url }));

export const loadCurrentOffer = createAction(
  ActionType.LoadCurrentOffer,
  (offer: OfferType) => ({ payload: offer }));

export const loadNearbyOffers = createAction(
  ActionType.LoadNearbyOffers,
  (offers: OfferType[]) => ({ payload: offers }));

export const loadReviews = createAction(
  ActionType.LoadReviews,
  (reviews: ReviewType[]) => ({ payload: reviews }));

export const historyBack = createAction(ActionType.HistoryBack);

export const toggleIsPosting = createAction(
  ActionType.isPosting,
  (isPosting: boolean) => ({ payload: isPosting }));

export const addComment = createAction(
  ActionType.AddComment,
  (comment: string) => ({ payload: comment }));

export const addComentRating = createAction(
  ActionType.AddCommentRating,
  (rating: number) => ({ payload: rating }));

export const setCurrentId = createAction(
  ActionType.SetCurrentId,
  (id: number | null) => ({ payload: id }));

export const loadFavoriteOffers = createAction(
  ActionType.LoadFavoriteOffers,
  (offers: OfferType[]) => ({ payload: offers }));

export const changeIsFavorite = createAction(
  ActionType.ChangeIsFavorite,
  (offer: OfferType) => ({ payload: offer }));

export const toggleIsFavorite = createAction(
  ActionType.ToggleIsFavorite,
  (isFavorite: boolean | null, id: number) => ({ payload: { isFavorite, id } }));

export const removeCurrentOffer = createAction(ActionType.RemoveCurrentOffer);

export const removeFavoriteOffers = createAction(ActionType.RemoveFavoriteOffers);

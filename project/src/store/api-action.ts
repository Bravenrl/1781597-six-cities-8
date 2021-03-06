import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { AppRoute, AuthorizationStatus, EmptyComment, Status } from '../const';
import { adaptAuthInfoToClient, adaptOfferToCient, adaptReviewToCient } from '../services/adapter';
import { ApiRoute, HttpCode, ToastMessage } from '../services/const';
import { createToast } from '../services/toast';
import { removeToken, setToken } from '../services/token';
import { ThunkActionResult } from '../types/action';
import { ServerOfferType } from '../types/offer';
import { CommentType, ServerAurhInfo, ServerReviewType, User } from '../types/review';
import { toggleIsLoading, loadOffers, requireAuthorization, addUserEmail, requireLogout, redirectToRoute, loadCurrentOffer, loadNearbyOffers, loadReviews, historyBack, toggleIsPosting, addComment, addComentRating, changeIsFavorite, loadFavoriteOffers, toggleIsFavorite } from './action';

export const loadOffersAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    dispatch(toggleIsLoading(true));
    try {
      const { data } = await api.get<ServerOfferType[]>(ApiRoute.Offers);
      const offers = data.map(adaptOfferToCient);
      dispatch(loadOffers(offers));
    } catch {
      toast.warning(ToastMessage.LoadFiail);
    }
    dispatch(toggleIsLoading(false));
  };

export const checkAuthStatusAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    await api.get<ServerAurhInfo>(ApiRoute.Login)
      .then((response) => {
        const author = adaptAuthInfoToClient(response.data);
        setToken(author.token);
        dispatch(requireAuthorization(AuthorizationStatus.Auth));
        dispatch(addUserEmail(author.email));
      })
      .catch((err: AxiosError) => createToast(err.response?.status));
  };

export const loginAction = (user: User): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    dispatch(toggleIsLoading(true));
    await api.post<ServerAurhInfo>(ApiRoute.Login, user)
      .then((response) => {
        const author = adaptAuthInfoToClient(response.data);
        setToken(author.token);
        dispatch(requireAuthorization(AuthorizationStatus.Auth));
        dispatch(addUserEmail(author.email));
        dispatch(historyBack());
      })
      .catch((err: AxiosError) => createToast(err.response?.status));
    dispatch(toggleIsLoading(false));
  };

export const logoutAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    await api.delete(ApiRoute.Logout)
      .then(() => {
        removeToken();
        dispatch(requireLogout());
        dispatch(addUserEmail(''));
      })
      .catch((err: AxiosError) => createToast(err.response?.status));
  };

export const loadPropertyOffersAction = (id: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    dispatch(toggleIsLoading(true));
    await axios.all<AxiosResponse>([
      api.get<ServerOfferType>(`${ApiRoute.Offers}/${id}`),
      api.get<ServerOfferType[]>(`${ApiRoute.Offers}/${id}${ApiRoute.NearbyOffers}`),
      api.get<ServerReviewType[]>(`${ApiRoute.Reviews}/${id}`)])
      .then(axios.spread((current, nearby, reviews) => {
        const offer = adaptOfferToCient(current.data);
        const offers = nearby.data.map(adaptOfferToCient);
        const comments = reviews.data.map(adaptReviewToCient);
        dispatch(loadNearbyOffers(offers));
        dispatch(loadCurrentOffer(offer));
        dispatch(loadReviews(comments));
        dispatch(toggleIsFavorite(offer.isFavorite, offer.id));
      }))
      .catch((err: AxiosError) => {
        createToast(err.response?.status);
        if (err.response?.status === HttpCode.NotFound) {
          dispatch(redirectToRoute(AppRoute.NotFound));
        }
      });
    dispatch(toggleIsLoading(false));
  };

export const postCommentAction = (comment: CommentType, id: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    dispatch(toggleIsPosting(true));
    await api.post<ServerReviewType[]>(`${ApiRoute.Reviews}/${id}`, comment)
      .then((response) => {
        const comments = response.data.map(adaptReviewToCient);
        dispatch(addComment(EmptyComment.comment));
        dispatch(addComentRating(EmptyComment.rating));
        dispatch(loadReviews(comments));
      })
      .catch((err: AxiosError) => createToast(err.response?.status));
    dispatch(toggleIsPosting(false));
  };

export const postFavoriteAction = (status: Status, id: string): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    dispatch(toggleIsPosting(true));
    await api.post<ServerOfferType>(`${ApiRoute.Favorite}/${id}/${status}`)
      .then((response) => {
        const offer = adaptOfferToCient(response.data);
        dispatch(changeIsFavorite(offer));
        dispatch(toggleIsFavorite(offer.isFavorite, offer.id));
      })
      .catch((err: AxiosError) => createToast(err.response?.status));
    dispatch(toggleIsPosting(false));
  };

export const loadFavoriteOffersAction = (): ThunkActionResult =>
  async (dispatch, _getState, api): Promise<void> => {
    dispatch(toggleIsLoading(true));
    try {
      const { data } = await api.get<ServerOfferType[]>(ApiRoute.Favorite);
      const offers = data.map(adaptOfferToCient);
      dispatch(loadFavoriteOffers(offers));
    } catch {
      toast.warning(ToastMessage.LoadFiail);
    }
    dispatch(toggleIsLoading(false));
  };

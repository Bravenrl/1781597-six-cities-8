
import { ChangeEvent, Dispatch, FormEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { postCommentAction } from '../../store/api-action';
import { Actions, ThunkAppDispatch } from '../../types/action';
import { State } from '../../types/state';
import withPreloader from '../../hocs/with-preloader/with-preloader';
import CommentStar from '../comment-star/comment-star';
import { Star } from '../../const';
import { addComent, addComentRating } from '../../store/action';

type CommentFormPropsType = {
}

type PropsFromReduxType = ConnectedProps<typeof connector>;
type ConnectedComponentPropsType = PropsFromReduxType & CommentFormPropsType;

const mapStateToPrors = ({ isDataLoading, currentOffer, comment, commentRating}: State) => ({
  currentOffer,
  isDataLoading,
  comment,
  commentRating,
});
const mapDispatchToProps = (dispatch: ThunkAppDispatch & Dispatch<Actions>) => ({
  onCommentChange(comment:string) {dispatch(addComent(comment));},
  onRatingChange(rating: number) {dispatch(addComentRating(rating));},
  onSubmit(comment: string, rating: number, id: string) {
    const newComment = { comment, rating };
    dispatch(postCommentAction(newComment, id));
  },
});

const connector = connect(mapStateToPrors, mapDispatchToProps);

function CommentForm(props: ConnectedComponentPropsType): JSX.Element {
  const { isDataLoading, currentOffer, onSubmit, comment, commentRating, onCommentChange, onRatingChange } = props;

  const isButonDisable = !((comment.length >= 50 && comment.length <= 300 && commentRating > 0));

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit(comment, commentRating, currentOffer.id.toString());
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <fieldset disabled={isDataLoading}>
        <label className="reviews__label form__label" htmlFor="review">Your review</label>
        <div className="reviews__rating-form form__rating" onChange={(evt: ChangeEvent<HTMLInputElement>) => onRatingChange(+evt.target.value)}>
          {[...Star.entries()].map(([element, discription]) => (<CommentStar key={element} rating={commentRating} element={element} discription={discription} />))}
        </div>
        <textarea onChange={(evt: ChangeEvent<HTMLTextAreaElement>) => onCommentChange(evt.target.value)}
          className="reviews__textarea form__textarea" id="review" name="review"
          placeholder="Tell how was your stay, what you like and what can be improved"
          value={comment}
        >
        </textarea>
        <div className="reviews__button-wrapper">
          <p className="reviews__help">
            To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
          </p>
          <button className="reviews__submit form__submit button" type="submit" disabled={isButonDisable}>Submit</button>
        </div>
      </fieldset>
    </form>
  );
}
export { CommentForm };
export default withPreloader(connector(CommentForm));

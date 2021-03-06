import { GenerateFakeOffer } from '../../mock/mock';
import { Provider } from 'react-redux';
import * as Redux from 'react-redux';
import CommentForm from './comment-form';
import { EmptyComment, Star } from '../../const';
import { fireEvent, render, screen } from '@testing-library/react';
import { configureMockStore, MockStore } from '@jedmao/redux-mock-store';
import { ActionType } from '../../types/action';

const VALID_COMMENT = 'i'.repeat(100);
const MESSAGE = 'hi';

const mockStore = configureMockStore();


let state = {
  DATA: {
    commentRating: EmptyComment.rating,
    currentOffer: { ...GenerateFakeOffer(), id: 1 },
    comment: EmptyComment.comment,
  },
  APP: {
    isLoading: false,
    isPosting: false,
  },
};

const renderComponent = (store: MockStore) =>
  render(
    <Provider store={store}>
      < CommentForm />
    </Provider>);


describe('Component: CommentForm', () => {
  beforeEach(() => {
    state = {
      DATA: {
        commentRating: EmptyComment.rating,
        currentOffer: { ...GenerateFakeOffer(), id: 1 },
        comment: EmptyComment.comment,
      },
      APP: {
        isLoading: false,
        isPosting: false,
      },
    };
  });

  it('should render correctly', () => {
    state.DATA.comment = MESSAGE;
    const store = mockStore(state);
    renderComponent(store);
    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
    expect(screen.queryByDisplayValue(MESSAGE)).toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBe([...Star.entries()].length);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('group')).not.toBeDisabled();
  });

  it('should dispatch AddComment value', () => {
    const dispatch = jest.fn();
    const useDispatch = jest.spyOn(Redux, 'useDispatch');
    useDispatch.mockReturnValue(dispatch);
    const store = mockStore(state);
    renderComponent(store);
    const textbox = screen.getByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'i' } });
    expect(dispatch).toBeCalledWith({
      payload: 'i',
      type: ActionType.AddComment,
    });
  });

  it('should fieldset disable if isPosting = true', () => {
    state.APP.isPosting = true;
    const store = mockStore(state);
    renderComponent(store);
    expect(screen.getByRole('group')).toBeDisabled();
  });


  it('should button enabled if comment is valid & rating !== 0', () => {
    state.DATA.comment = VALID_COMMENT;
    state.DATA.commentRating = 4;
    state.APP.isPosting = false;
    const store = mockStore(state);
    renderComponent(store);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

});


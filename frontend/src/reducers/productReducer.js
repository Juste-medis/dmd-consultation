/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-case-declarations */
export const productReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SORT_PRODUCT':
      return {
        ...state,
        products: [...state.products].sort((a, b) => {
          if (payload.sortBy === 'review') {
            if (payload.order === 'asc') {
              return a.reviews.length - b.reviews.length;
            } else {
              return b.reviews.length - a.reviews.length;
            }
          } else {
            if (payload.order === 'asc') {
              return a[payload.sortBy] - b[payload.sortBy];
            } else {
              return b[payload.sortBy] - a[payload.sortBy];
            }
          }
        })
      };
    case 'SET_PRODUCT':
      return {
        ...state,
        products: [...payload.offers]
      };
    case 'SET_USERS':
      return {
        ...state,
        users: [...payload.users]
      };
    case 'ADD_TO_SAVED':
      return {
        ...state,
        savedItems: [...state.savedItems, payload.product],
        cartModal: {
          show: true,
          product: payload.product
        }
      };
    case 'REMOVE_FROM_SAVED':
      return {
        ...state,
        savedItems: state.savedItems.filter(
          product => product.ID !== payload.product.ID
        ),
        cartModal: {
          show: true,
          product: payload.product,
          type: 'remove'
        }
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.ID === payload.product.ID ? payload.product : item
        ),
        cartModal: {
          show: payload.showModal,
          product: payload.product,
          quantity: payload.quantity
        }
      };
    case 'UPDATE_STATUS':
      return {
        ...state,
        products: state.products.map(product =>
          product.ID === payload.product.ID
            ? { ...product, favorite: product.favorite + 1 }
            : product
        )
      };
    case 'TOGGLE_CART_MODAL':
      return {
        ...state,
        cartModal: {
          ...state.cartModal,
          show: !state.cartModal.show
        }
      };
    case 'CLEAN_SAVED': {
      return {
        ...state,
        savedItems: [],
        promo: null
      };
    }
    case 'RESET':
      return {
        ...state
      };
    default:
      return state;
  }
};

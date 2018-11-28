import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import rootSaga from './sagas';
import reducers from './reducers';

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = applyMiddleware(sagaMiddleware);

  const configuredState = initialState;

  let enhancer = middleware;
  if (
    typeof window === 'object'
    && typeof window.devToolsExtension !== 'undefined'
  ) {
    enhancer = compose(middleware, window.devToolsExtension());
  }

  const store = createStore(reducers, configuredState, enhancer);
  sagaMiddleware.run(rootSaga);

  return { store };
}

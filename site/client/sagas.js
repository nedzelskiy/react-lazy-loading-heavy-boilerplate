/* eslint-disable no-console */
import 'regenerator-runtime/runtime';
import { all } from 'redux-saga/effects';
import appSaga from './components/App/saga';

export default function* rootSaga() {
  try {
    const sagas = []
      .concat(appSaga);
    yield all(sagas);
  } catch (e) {
    console.log('rootSaga error:', e);
    throw e;
  }
}

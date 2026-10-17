import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
const defaultMiddlewareConfig = {
  serializableCheck: false,
};
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(defaultMiddlewareConfig),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

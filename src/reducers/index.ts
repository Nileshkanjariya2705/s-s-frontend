import { combineReducers } from "@reduxjs/toolkit";
import accountReducer from "./account.reducer";
import tokenReducer from "./token.reducer";
import languageReducer from "./language.reducer";
import ownershipReducer from "./ownership.reducer";
import sidebarReducer from "./sidebar.reducer";
import socketReducer from "./socket.reducer";

export const rootReducer = combineReducers({
  account: accountReducer,
  token: tokenReducer,
  language: languageReducer,
  ownership: ownershipReducer,
  sidebar: sidebarReducer,
  socket: socketReducer,
});

//redux imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabs: "1",
  searchInput: "",
  navToggle: false,
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    tabsHandler: (state, action) => {
      state.tabs = action.payload;
    },
    searchInputHandler: (state, action) => {
      state.searchInput = action.payload;
    },
    openNav: (state) => {
      state.navToggle = true;
    },
    closeNav: (state) => {
      state.navToggle = false;
    },
  },
});

export const {
  tabsHandler,
  searchInputHandler,
  closeNav,
  openNav,
} = tabsSlice.actions;

export default tabsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "prjcts",
  initialState: {
    items: [],
    isLoaded: false,
    myPaginatonData: {}, 
  },
  reducers: {
    setPrjcts: (state, action) => {
      state.items = action.payload;
      state.isLoaded = true;
    },

    removePrjct: (state, action) => {
      state.items = state.items.filter(
        (project) => project.id !== action.payload
      );
    },

    updateMyPaginatonData: (state, action) => {
      const { data, page } = action.payload;
      state.myPaginatonData = {
        ...state.myPaginatonData,
        [page]: data, 
      };
    },
  },
});
export const { setPrjcts, removePrjct, updateMyPaginatonData } = dashboardSlice.actions;
export default dashboardSlice.reducer;

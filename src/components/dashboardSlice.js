import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "prjcts",
  initialState: {
    items: [],
    isLoaded: false,
    myPaginatonData: {}, 
    totalPages: 0, 
  },
  reducers: {
    setToPages: (state, action) => {
      state.totalPages = action.payload;
    },
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
    removeProjectFromPage: (state, action) => {
      const { page, projectId } = action.payload;
      if (state.myPaginatonData[page]) {
        state.myPaginatonData[page] = state.myPaginatonData[page].filter(
          (project) => project.id !== projectId
        );
      }
    },
  },
});
export const { setPrjcts, removePrjct, updateMyPaginatonData,removeProjectFromPage ,setToPages} = dashboardSlice.actions;
export default dashboardSlice.reducer;

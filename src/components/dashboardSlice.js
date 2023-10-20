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
      const { data, page, projectsPerPage, totalPages } = action.payload;
    
      if (!state.myPaginatonData[projectsPerPage]) {
        state.myPaginatonData[projectsPerPage] = {};
      }
    
      state.myPaginatonData[projectsPerPage][page] = data;
      state.myPaginatonData[projectsPerPage].totalPages = totalPages;
    },
    


    removeProjectFromPage: (state, action) => {
      const { page, projectId, projectsPerPage } = action.payload;
      console.log(action.payload,"action.payload")
      if (state.myPaginatonData[projectsPerPage] && state.myPaginatonData[projectsPerPage][page]) {
        state.myPaginatonData[projectsPerPage][page] = state.myPaginatonData[projectsPerPage][page].filter(
          (project) => project.id !== projectId
        );
        console.log(state.myPaginatonData[projectsPerPage][page],"state.myPaginatonData[projectsPerPage][page]")
      }
      state.items = state.items.filter((project) => project.id !== projectId);
    },

  },
});
export const { setPrjcts, removePrjct, updateMyPaginatonData,removeProjectFromPage ,setToPages} = dashboardSlice.actions;
export default dashboardSlice.reducer;

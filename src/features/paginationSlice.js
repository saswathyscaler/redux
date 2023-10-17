import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
  name: "pagination",
  // initialState: {
  //   currentPage: 1,
  //   projectsPerPage: 20, 
  // },

  initialState: {   
    items2: [],
    isLoaded2: false, 
  },
  reducers: {
    // setCurrentPage: (state, action) => {
    //   state.currentPage = action.payload;
    // },
    // setProjectsPerPage: (state, action) => {
    //   state.projectsPerPage = action.payload;
    // },
    setProjectsInAPage: (state, action) => {
      state.items2 = action.payload;
      state.isLoaded2 = true;
    }
  },
});

export const { setProjectsInAPage } = paginationSlice.actions;
export default paginationSlice.reducer;

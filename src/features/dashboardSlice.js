import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "prjcts",
  initialState: {   
    items: [],
    isLoaded: false, 
  },
  reducers: {
    setPrjcts: (state, action) => {
      state.items = action.payload;
      state.isLoaded = true;
    }
  },
});

export const { setPrjcts, addPrjct } = dashboardSlice.actions;
export default dashboardSlice.reducer;




 

// const dashboardSlice = createSlice({
//   name: "prjcts",
//   initialState: {   
//     items: [],
//     isLoaded: false,
//     allProjects: [],
//     showComplete: "",
//   },
//   reducers: {
//     setPrjcts: (state, action) => {
//       state.items = action.payload;
//       state.isLoaded = true;
//     },

//     setAllProjects: (state, action) => {
//       state.allProjects = action.payload;
//     },

//     setShowComplete: (state, action) => {
//       state.showComplete = action.payload;
//     },

//     addPrjct: (state, action) => {
//       state.items.push(action.payload);
//     },
//   },
// });

// export const { setPrjcts, addPrjct, setAllProjects, setShowComplete } = dashboardSlice.actions;

// export default dashboardSlice.reducer;











import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "prjcts",
  initialState: {
    items: [],
    paginate: [],
    isLoaded: false,
  },
  reducers: {
    setPrjcts: (state, action) => {
      state.items = action.payload;

      const totalProjects = action.payload.length;
      // console.log(totalProjects, "total projects ");
      const numOfPages = Math.ceil(totalProjects / 20);
      // console.log("🚀 numOfPages:", numOfPages);

      state.paginate = Array.from({ length: numOfPages }, (_, i) => {
        const start = i * 20;
        const end = (i + 1) * 20;
        const projectSlice = action.payload.slice(start, end);
        return projectSlice;
      });

      // console.log(state.paginate[0], "paginateee");

      state.isLoaded = true;
    },

    removePrjct: (state, action) => {
      state.items = state.items.filter(
        (project) => project.id !== action.payload
      );
    },
  },
});

export const { setPrjcts, removePrjct } = dashboardSlice.actions;
export default dashboardSlice.reducer;

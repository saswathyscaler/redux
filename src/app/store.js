import { configureStore } from "@reduxjs/toolkit";

import dashboardSlice from "dashboard/features/dashboardSlice";
import userSlice from "dashboard/features/userSlice";

const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
    users : userSlice
  },
});
export default store;

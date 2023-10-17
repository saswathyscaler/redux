import { configureStore } from "@reduxjs/toolkit";

import dashboardSlice from "dashboard/features/dashboardSlice";

const store = configureStore({
    reducer:{
        dashboard:dashboardSlice
    },
});
export default store;




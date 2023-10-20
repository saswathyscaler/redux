import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    items: {},
  },
  reducers: {
    setUsersR: (state, action) => {
      state.items = action.payload;
      state.isLoaded = true;
    },
    removeUser: (state, action) => {
      const userIdToDelete = action.payload;
      state.items = state.items.filter(user => user.id !== userIdToDelete);
    },
  },
});

export const {setUsersR,removeUser} = userSlice.actions;

export default userSlice.reducer;

import React, { useState, useEffect, useContext } from 'react';
import { FeedbackContext  } from '../../shared/contexts/FeedbackContext';
import { get, post, put,$delete} from '../../util/axios';
import {  useSelector,useDispatch } from "react-redux";
import { setUsersR,removeUsers, removeUser } from 'dashboard/features/userSlice';


export const UsersContext = React.createContext({
  users: [],
  roles: [],
  userProjects: [],
  projectInfos: [],
  submitNewUser: () => {},
  submitEditUser: () => {},
  submitProjectSharesUpdate: () => {},
  deleteUsers:()=>{},
  refreshData:()=>{}
});

export const UsersContextProvider = ({ children }) => {
  const { showErrorToast,showSuccessToast } = useContext(FeedbackContext);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [projectInfos, setProjectInfos] = useState([]);

  let UsersR = useSelector((state) => state.users.items);
  const dispatch = useDispatch()
  const [flag, setFlag] = useState(false);
  const refreshData = (callback) => {
    if (UsersR?.users?.length && !flag) {
      setUsers(UsersR.users);
      setRoles(UsersR.userRoles);
      setUserProjects(UsersR.userProjects);
      setProjectInfos(UsersR.projectInfos); 
      setFlag(true)


    } else {
    const onSuccess = data => {
      dispatch(setUsersR(data))
      setUsers(data.users);
      setRoles(data.userRoles);
      setUserProjects(data.userProjects);
      setProjectInfos(data.projectInfos);
      setFlag(true)
    };
    const onError = err => showErrorToast(err);
    get(`/api/admin/users`, onSuccess, onError);
  }
}

  useEffect(() => { refreshData(); }, []);

  const submitNewUser = (newUserInfo, callback) => {
    const onSuccess = newUser => {
      setUsers(prev => [...prev, newUser]);
      dispatch(setUsersR(prev => [...prev, newUser]))

      if (callback) callback();
    };
    const onError = err => {
      showErrorToast(err);
      // if (callback) callback();
    }
    post(`/api/admin/invite-user`, newUserInfo, onSuccess, onError);
  }

  const submitEditUser = (info, callback) => {
    const onSuccess = data => {
      setUsers(prev => [...prev].map(u => u.id === info.id ? { ...u, ...data.user } : u));
      dispatch(setUsersR(prev => [...prev].map(u => u.id === info.id ? { ...u, ...data.user } : u)))
      if (callback) callback();
    };
    const onError = err => {
      showErrorToast(err);
      if (callback) callback();
    }
    put(`/api/admin/users/` + info.id, info, onSuccess, onError);
  }

  const submitProjectSharesUpdate = (user, projectIds, callback) => {
    const onSuccess = data => {
      // wait a second for data to be updated
      setFlag(true)
      setTimeout(() => refreshData(), 2000);

      if (callback) callback();
    };
    const onError = err => {
      showErrorToast(err);
      if (callback) callback();
    }
    put(`/api/admin/users/` + user.id + '/project_shares', { projectIds }, onSuccess, onError);
  }



  const deleteUsers=(users,callback)=>{
    const onSuccess = newUser => {
      showSuccessToast("Deleted Sucessfully") 
      dispatch(removeUser(users)); 
      if (callback) callback();
    };
    const onError = err => {
      showErrorToast(err);
      if (callback) callback();
    }
    $delete("/api/admin/users/delete", users,onSuccess,onError);
    refreshData()
  }

  const contextVal = {
    users,
    roles,
    userProjects,
    projectInfos,
    submitNewUser,
    submitEditUser,
    submitProjectSharesUpdate,
    deleteUsers,
    refreshData
  };

  return (
    <UsersContext.Provider value={contextVal}>
      {children}
    </UsersContext.Provider>
  );
}
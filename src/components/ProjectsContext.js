import React, { useState, useEffect, useContext } from "react";
import { FeedbackContext } from "../../shared/contexts/FeedbackContext";

import { get, post, $delete } from "../../util/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setPrjcts,
  removePrjct,
  updateMyPaginatonData,
  removeProjectFromPage,setToPages
} from "dashboard/features/dashboardSlice";

export const ProjectsContext = React.createContext({
  allProjects: [],
  projects: [],
  loading: true,
  load: true,
  totalPages: 0,
  currentPage: 1,
  projectsPerPage: "",
  showComplete: "",
  submitNewProject: () => {},
  deleteProject: () => {},
  refreshData: () => {},
  getAllProject: () => {},
});

export const ProjectsContextProvider = ({ children }) => {
  const { showErrorToast } = useContext(FeedbackContext);

  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState("20"); 
  
  const [showComplete, setShowComplete] = useState("");
  const [allProjects, setAllProjects] = useState([]);

  const dispatch = useDispatch();
  const dashboardData = useSelector((state) => state.dashboard.items);
  let myPaginateData = useSelector((state) => state.dashboard.myPaginatonData);
  let TotPages = useSelector((state) => state.dashboard.myPaginatonData);
  



  const refreshData = (page = 1) => {
    const existingPageData = myPaginateData[projectsPerPage]?.[page];
    if (existingPageData?.length ) {
      setProjects(existingPageData);
      setTotalPages(TotPages[projectsPerPage]?.totalPages);
      setCurrentPage(page > totalPages ? 1 : page);
      setLoading(false);

    } else {

      const onSuccess = (response) => {
        const { data, totalPages } = response;
        setProjects(data);
        setTotalPages(totalPages);
        setCurrentPage(page > totalPages ? 1 : page);
        dispatch(updateMyPaginatonData({ data, page, projectsPerPage ,totalPages:totalPages}));
        setLoading(false);
      };
      const onError = (err) => {
        showErrorToast(err);
        setLoading(false);
      };
      if (projectsPerPage === "All") {
       console.log(dashboardData,"dashboardData")
        setProjects(dashboardData)
        if(!dashboardData.length){
            get(
          `/api/projects?projectsPerPage=${projectsPerPage}&complete=${showComplete}`,
          onSuccess,
          onError
        ); 
        }

      } 
      else {
        get(
          `/api/projects?page=${page}&projectsPerPage=${
            projectsPerPage === "" ? 20 : projectsPerPage
          }&complete=${showComplete}`,
          onSuccess,
          onError
        );
      }
    }
  };

  const getAllProject = () => {
    if (dashboardData?.length) {
      setAllProjects(dashboardData)
      setLoad(false);
    } else {
    setLoad(true);
    const onSuccess = (projects) => {
      setAllProjects(projects.data);
      dispatch(setPrjcts(projects.data));
      setLoad(false);
    };
    const onError = (err) => {
      showErrorToast(err);
      setLoad(false);
    };
    get(
      `/api/projects?projectsPerPage=All&complete=${showComplete}`,
      onSuccess,
      onError
    );
  };
    }
  useEffect(() => {
    getAllProject();
    refreshData(currentPage);
  }, [showComplete,currentPage]);

  const submitNewProject = (newProjectData, callback) => {
    const onSuccess = (newProject) => {
      dispatch(setPrjcts([...dashboardData, newProject]));
      if (callback) callback();
    };
    const onError = (err) => {
      showErrorToast(err);
      if (callback) callback();
    };

    post(`/api/projects`, newProjectData, onSuccess, onError);
    setTimeout(() => refreshData(), 1000);
  };


  const deleteProject = (projects, callback) => {
    console.log(projectsPerPage,"projectcts per page ")
    
    console.log(myPaginateData[projectsPerPage]?.[currentPage])
    const onSuccess = (newProject) => {

      dispatch(removeProjectFromPage({ page: currentPage, projectId: projects, projectsPerPage }));
      setProjects(myPaginateData[projectsPerPage]?.[currentPage]);

      if (callback) {callback()
      console.log("printfeef")
      };
    };
  
    const onError = (err) => {  
      showErrorToast(err);
      if (callback) callback();
    };
  
    $delete(
      `/api/admin/project/archive`,
      { data: projects },
      onSuccess,
      onError
    );
    refreshData(currentPage)

  };
  

  const contextVal = {
    allProjects,
    projects,
    loading,
    load,
    totalPages,
    currentPage,
    projectsPerPage,
    showComplete,
    setShowComplete,
    setTotalPages,
    setProjectsPerPage,
    submitNewProject,
    deleteProject,
    refreshData,
    getAllProject,
  };

  return (
    <ProjectsContext.Provider value={contextVal}>
      {children}
    </ProjectsContext.Provider>
  );
};

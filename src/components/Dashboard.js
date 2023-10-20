import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { objSort, formatDate } from "gmi-utils";
import { ArchiveIcon } from "@heroicons/react/outline";
import { ProjectsContext } from "../contexts/ProjectsContext";
import { AuthContext } from "../../shared/contexts/AuthContext";
import Subheader from "./Subheader";
import NewProjectModal from "./NewProjectModal";
import ArchivedModal from "./ArchivedModal";
import { Table, Row, Cell } from "../../shared/components/Table/Table";
import Pagination from "./Pagination";
import {  useSelector } from "react-redux";


const Dashboard = () => {
  const history = useHistory();
  const { projects, allProjects, loading, load, totalPages, currentPage, projectsPerPage, deleteProject, refreshData, getAllProject} = useContext(ProjectsContext);
  const { user } = useContext(AuthContext);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [sortedBy, setSortedBy] = useState({ key: "name", asc: true });
  const [projectId, setProjectId] = useState("");
  const clearSearch = () => setSearchQuery("");


  let dashboardData = useSelector((state) => state.dashboard.items);  

  const columnConfig = [
    { key: "hasNewEvents", displayName: "", width: "0%" },
    { key: "num", displayName: "Project Code", width: "14%", sortable: true },
    { key: "name", displayName: "Name", width: "32%", sortable: true },
    // { key: "userProjectRole", displayName: "Permissions", width: "12%" },
    { key: "sheetCount", displayName: "Sheets",width: "12%", sortable: true },
    { key: "teamSize", displayName: "Team", width: "12%", sortable: true },
    { key: "status", displayName: "Status", width: "12%", sortable: true },
    { key: "updatedAt", displayName: "Last Updated", width: "17%", sortable: true },
  ];

  if (user.humanizedRole === "Super Admin") {
    columnConfig.push({ key: "archived", displayName: "Archive", width: "12%" });
  }

  const columnFormatters = {
    hasNewEvents: (hasNewEvents) =>
      hasNewEvents ? (
        <div className="relative h-full w-0">
          <div className="absolute top-2 right-1 bg-blue-400 h-2 w-2 flex items-center justify-center rounded-full" />{" "}
        </div>
      ) : (
        ""
      ),
    userProjectRole: (str) => (
      <span className="capitalize">
        {str === "project admin" ? "Admin" : str}
      </span>
    ),
    updatedAt: (date) => <span>{formatDate(date)}</span>,
    default: (val) => (
      <span className="block truncate">{val === 0 || val ? val : "-"}</span>
    ),
  };

  let filteredProjects = projects.map((p) => ({
    id: p.id,
    num: p.num,
    name: p.name,
    sheetCount: (p.Sheets || []).length ,
    teamSize: (p.userCount || []),
    status: p.status,
    updatedAt: p.updatedAt || Date.now(), // Date.now() is temp fix, p.updatedAt doesn't exist when new project is added
    hasNewEvents: p.lastVersionSeen < p.latestVersion,
  }));

  columnConfig.forEach((col) => (col.sortBy = col.key === sortedBy.key));

  const onClickSort = (colKey) => {
    if (sortedBy.key === colKey)
      return setSortedBy((prev) => ({ ...prev, asc: !prev.asc }));
    return setSortedBy({ key: colKey, asc: true });
  };

  const toggleShowNewProjectModal = () => {
    setShowNewProjectModal(!showNewProjectModal);
  };

  useEffect(() => {
    getAllProject();
  }, []);

  let allProjectsData = allProjects.map((p) => ({
    id: p.id,
    num: p.num,
    name: p.name,
    sheetCount: (p.Sheets || []).length,
    teamSize: (p.Users || []).length,
    status: p.status,
    updatedAt: p.updatedAt || Date.now(),
    hasNewEvents: p.lastVersionSeen < p.latestVersion,
  }));

  const q = searchQuery.trim().toLowerCase();
  if (!!q) {
    filteredProjects = allProjectsData.filter((p) =>
      [p.name, p.num].some((_p) => (_p || "").toLowerCase().includes(q))
    );
  }
  const sortedProjects = filteredProjects.sort(
    objSort(sortedBy.key, sortedBy.asc)
  );

  const noMatches = !filteredProjects.length && !!projects.length;

  useEffect(() => {
    refreshData();
  }, [projectsPerPage]);

  const handleDeleteProject = () => {
    const callback = () => {
      setShowArchivedModal(false);
    };
    deleteProject(projectId, callback);
    if (projects.length === 1 && currentPage > 1) {
      goToPage(currentPage - 1);
    } else {
      refreshData(currentPage);
      getAllProject(allProjects);
    }
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToPage = (page) => {
    refreshData(page);
  };
  const onChangeShow=()=>{
    setShowCompletedProjects(!showCompletedProjects)
  }


  return (
    <>
      <Subheader
        searchValue={searchQuery}
        projects={dashboardData}
        clearSearch={clearSearch}
        onSearch={(e) => { setSearchQuery(e.target.value) }}
        onClickNewProject={toggleShowNewProjectModal}
      />
      <main className="min-h-screen p-1 md:p-4 lg:p-5 bg-blueGray-100">
        <section className="overflow-x-auto bg-blueGray-100 shadow-sm">
          {loading ? (

            <LoadingPhantomTable />
          ) : (
            <Table
              columnHeaderDetails={columnConfig}
              onClickSort={onClickSort}
              ascending={sortedBy.asc}
            >
             {  sortedProjects.map((project) => (
              <Row
                  key={project.id}
                  className="bg-white cursor-pointer hover:bg-blueGray-50"
                  onClick={() => {
                    history.push(`/projects/${project.id}/dashboard/sheets`);
                    setProjectId(project.id);
                  }}
                >
                
                  {columnConfig.map((col) => {
                    if (col.key === "name")
                      return (
                        <Cell
                          key={col.key}
                          width={col.width}
                          className="text-gray-500"
                        >
                          <div className="w-full">
                            <div className="font-semibold">{project.name}</div>
                            {project.formattedAddress && (
                              <div className="pr-1 mt-1 text-sm font-normal truncate">
                                {project.formattedAddress}
                              </div>
                            )}
                          </div>
                        </Cell>
                      );
                    if (col.key === "archived") {
                      return (
                        <Cell
                          key={col.key}
                          width={col.width}
                          className="text-gray-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowArchivedModal(true);
                            setProjectId(project.id);
                          }}
                        >
                          {/* {user.humanizedRole === "Super Admin" && ( */}

                          <button>
                            <ArchiveIcon className="hover:text-red-700 w-5 h-5 mr-1.5" />
                          </button>
                          {/* )} */}
                        </Cell>
                      );
                    }
                    return (
                      <Cell
                        key={col.key}
                        width={col.width}
                        className="text-sm font-normal text-gray-500"
                      >
                        {columnFormatters[col.key]
                          ? columnFormatters[col.key](project[col.key])
                          : columnFormatters.default(project[col.key])}
                      </Cell>
                    );
                  })}
                </Row>
              ))}
              {noMatches ? (
                load ? (
                  <LoadingPhantomTable />
                ) : (
                  <Row className="bg-white">
                    <div className="py-2 px-12 text-sm font-medium text-gray-500 tracking-wide">
                      No Matches
                    </div>
                  </Row>
                )
              ) : null}
            </Table>
          )}
        </section>

        {projectsPerPage !== "All" && totalPages !== 0  && !q && 
        ( 
          <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          />
          )
        
        }
      </main>
      {showNewProjectModal && (
        <NewProjectModal onClose={toggleShowNewProjectModal} />
      )}
      {showArchivedModal && (
        <ArchivedModal
          show={showArchivedModal}
          onClose={() => setShowArchivedModal(false)}
          onConfirm={handleDeleteProject}
        />
      )}
    </>
  );
};

const LoadingPhantomTable = () => (
  <div
    className="w-full h-full flex items-center justify-center rounded border border-blueGray-100 bg-blueGray-200"
    style={{ minHeight: 800 }}
  >
    <div className="animate-pulse w-full h-full">
      <div className="w-full h-14 bg-blueGray-100 bg-opacity-50 px-2" />
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="w-full h-12 bg-blueGray-100 flex items-center space-x-0.5 py-1 px-6"
        >
          <div className="rounded w-5/12 h-full bg-blueGray-200 bg-opacity-40" />
          <div className="rounded w-3/12 h-full bg-blueGray-200 bg-opacity-40" />
          <div className="rounded w-4/12 h-full bg-blueGray-200 bg-opacity-40" />
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;

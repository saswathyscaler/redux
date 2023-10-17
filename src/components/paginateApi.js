const refreshData = (page = 1) => {
  if (isLoaded) {
    // If data is already loaded in Redux, use it
    const start = (page - 1) * projectsPerPage;
    const end = page * projectsPerPage;
    const paginatedData = dashboardData.slice(start, end);
    setProjects(paginatedData);
    setTotalPages(Math.ceil(dashboardData.length / projectsPerPage));
    setCurrentPage(page > totalPages ? 1 : page);
    setLoading(false);
  } else {
    const onSuccess = (response) => {
      const { data, totalPages } = response;
      setProjects(data);
      setTotalPages(totalPages);
      setCurrentPage(page > totalPages ? 1 : page);
      setLoading(false);
    };
    const onError = (err) => {
      showErrorToast(err);
      setLoading(false);
    };

    if (projectsPerPage === "All") {
      // If 'projectsPerPage' is 'All', use data from the Redux store
      onSuccess({ data: dashboardData, totalPages: totalPages });
    } else if (projectsPerPage === "30") {
      // Fetch the first 30 projects from dashboardData
      const paginatedData = dashboardData.slice(0, 30);
      onSuccess({
        data: paginatedData,
        totalPages: Math.ceil(dashboardData.length / 30),
      });
    } else if (projectsPerPage === "50") {
      // Fetch the first 50 projects from dashboardData
      const paginatedData = dashboardData.slice(0, 50);
      onSuccess({
        data: paginatedData,
        totalPages: Math.ceil(dashboardData.length / 50),
      });
    }
  }
};

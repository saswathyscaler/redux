import React, { useState,useRef ,useContext} from 'react';
import { PlusIcon,ArchiveIcon} from '@heroicons/react/outline';
import { useHistory, useParams, Link } from 'react-router-dom';

import Button from "shared/components/Button";
import SearchBar from "shared/components/SearchBar";
import { useHotkeys } from "react-hotkeys-hook";
import { AuthContext } from "shared/contexts/AuthContext";
import { ProjectsContext } from "../contexts/ProjectsContext";

const alphanumericKeys = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'
];

const Subheader = ({ projects, onSearch, clearSearch, searchValue, onClickNewProject }) => {
  const sheetsCount = projects.map(p => (p.Sheets?.length || 0)).reduce((a,b) => a + b, 0);
  const _searchInput = useRef(null);
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const { projectsPerPage, setProjectsPerPage,showComplete, setShowComplete } = useContext(ProjectsContext);
  const [showCompletedProjects, setShowCompletedProjects]=useState(false)
  function onKeyDown(e) {
    if (!_searchInput.current) return;
    
    const isFocused = _searchInput.current === document.activeElement;

    if (!isFocused && alphanumericKeys.includes(e.key)) {
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) e.preventDefault();
      _searchInput.current.focus();
    }
  }

  function onEscape(e) {
    if (_searchInput.current) _searchInput.current.blur();
    clearSearch();
  }

  const keysArg = [...alphanumericKeys, 'ctrl+f', 'cmd+f'].join(', ');
  
  useHotkeys(keysArg, onKeyDown, { keydown: true });
  
  useHotkeys( 'Escape', onEscape, { enableOnTags: ['INPUT'] }) // enableOnTags allows callback to be triggered continuously while input is focused
  const toggleCompeteCheckBox=()=>{
    setShowCompletedProjects(!showCompletedProjects);
    if(!showCompletedProjects){
      setShowComplete("Complete")
    }
    else{
      setShowComplete("")
    }
  }
  return (
    <div className={styles.subheaderContainer}>
        <div className="flex items-right text-lg">Projects</div>
      <div className={styles.subheaderTop}>
{user.humanizedRole === "Super Admin" && (
      <Button
          innerText="Archived Projects"
          iconElement={<ArchiveIcon className="w-5 h-5 mr-1.5"/>}
          color="whiteDanger"
          // disabled={disabled}
          onClick={() => history.push('/dashboard/archived-project')}

        />
)}
{user.humanizedRole === "Super Admin" && (

        <Button
          innerText="New Project"
          iconElement={<PlusIcon className="w-5 h-5 mr-1.5" />}
          onClick={onClickNewProject}
          color="green"
        />
)}

      </div>
      <div className={styles.subheaderBottom}>
        <div className="hidden sm:flex justify-start">
          <div className="min-w-min flex">
            <div className="hidden md:block md:mr-1">You have </div>
            <div className="text-gray-600 mr-1">{projects.length}</div> projects
          </div>
        </div>
        <div className="w-full flex-1 md:flex-none md:w-1/3 flex items-center h-full">
          <SearchBar
            ref={_searchInput}
            value={searchValue}
            onSearch={onSearch}
            placeholder="search projects by name or number (ctrl + f)"
          />
        </div>
          <div className="flex justify-end p-1">
          <input 
            className="cursor-pointer focus:ring-0 mr-2 mt-2.5"
            type="checkbox"
            title="Select row"
            checked={showCompletedProjects}
            onChange={toggleCompeteCheckBox}
          />
         {!showCompletedProjects &&(<span className=" text-gray-500 text-sm mr-6 pt-2">Show completed projects</span>)} 
         {!!showCompletedProjects &&(<span className=" text-gray-500 text-sm mr-7 pt-2">Hide completed projects</span>)}
            <span className="text-gray-500 text-sm pt-2">Projects per page</span>
            <select
                value={projectsPerPage}
                onChange={(e) => setProjectsPerPage(e.target.value)}
                className="h-9 w-15 ml-2 text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="All">All</option>
            </select>
          </div>
      </div>
    </div>
  );
};

const styles = {
  subheaderContainer: 'border-b-2 border-gray-200 flex flex-col justify-between px-5 py-1',
  subheaderTop: 'flex-grow-1 border-b-2 border-gray-100 flex items-center justify-end space-x-4 h-10',
  subheaderBottom: 'py-0.5 flex justify-between items-center h-10 text-sm text-gray-500',
};

export default Subheader;

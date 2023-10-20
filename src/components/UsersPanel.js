import React, { useState, useContext, useEffect } from "react";
import { DownloadIcon, PlusIcon } from "@heroicons/react/outline";
import { objSort } from "gmi-utils";
import { UsersContext } from "../contexts/UsersContext";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import EditUserSharedProjectsModal from "./EditUserSharedProjectsModal";
import Button from "../../shared/components/Button";
import SearchBar from "../../shared/components/SearchBar";
import { Table, Row, Cell } from "../../shared/components/Table/Table";
import { TrashIcon } from "@heroicons/react/outline";
import { AuthContext } from "shared/contexts/AuthContext";
import DeleteUserModal from "./DeleteUserModal.js";
import { Select } from "../.././shared/components/Select";

const columnController = [
  { key: "firstName", displayName: "First Name", width: "15%", sortable: true },
  { key: "lastName", displayName: "Last Name", width: "15%", sortable: true },
  { key: "email", displayName: "Email", width: "30%", sortable: true },
  { key: "humanizedRole", displayName: "Role", width: "15%", sortable: true },
  { key: "numberOfSharedProjects", displayName: "Shared Projects", width: "25%", sortable: true },
];

const Span = ({ children, className = "" }) => (
  <span className={`block truncate ${className}`}>{children}</span>
);

const UsersPanel = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { users, userProjects, deleteUsers, refreshData } = useContext(UsersContext);
  const roles = ["All", "super admin", "regular"];
  const allUsersId = users.map((item) => item.id);
  const [selectedUser, setSelectedUser] = useState(null);
  const [_selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedSharedProjectsUser, setSelectedSharedProjectUser] = useState(null);
  const [userInfo, setUserInfo] = useState({ role: "" });
  const [sortedBy, setSortedBy] = useState({ key: "email", asc: true });
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  columnController.forEach((col) => (col.sortBy = col.key === sortedBy.key));

  const projectsByUser = {};
  userProjects.forEach((project) => {
    projectsByUser[project.UserId] = projectsByUser[project.UserId] || [];
    projectsByUser[project.UserId].push(project);
  });

  const onClickSort = (colKey) => {
    if (sortedBy.key === colKey)
      return setSortedBy((prev) => ({ ...prev, asc: !prev.asc }));
    return setSortedBy({ key: colKey, asc: true });
  };

  const exportUsers = async () => {
    window.open("/api/admin/users/export", "_blank");
  };

  const exportProjectCreators = async () => {
    window.open("/api/admin/users/project_creators_export", "_blank");
  };

  const toggleInviteUserModal = () =>
    setShowInviteUserModal(!showInviteUserModal);
  const sortedUsers = users
    .map((u) => ({
      ...u,
      numberOfSharedProjects: (projectsByUser[u.id] || []).length,
    }))
    .sort(objSort(sortedBy.key, sortedBy.asc));

  const onClickEmail = (email) => {
    const user = users.find((user) => user.email === email);
    if (user && !selectedUser) setSelectedUser(user);
  };

  const onClickSharedProjects = (user) => {
    const found = users.find((u) => u.id === user.id);
    if (found && !selectedSharedProjectsUser)
      setSelectedSharedProjectUser(found);
  };
  const allUsersAreSelected =
    users.length > 1 && _selectedUserIds.length === users.length;
  const toggleSelectAllUsers = () => {
    if (allUsersAreSelected) return setSelectedUserIds([]);
    return setSelectedUserIds(allUsersId);
  };

  const toggleSelectUser = (userId) => {
    if (_selectedUserIds.includes(userId)) {
      return setSelectedUserIds(
        _selectedUserIds.filter((item) => item !== userId)
      );
    }
    return setSelectedUserIds([..._selectedUserIds, userId]);
  };

  const columnFormatters = {
    email: (email) => (
      <Span>
        <a
          className="cursor-pointer hover:underline text-blue-500"
          onClick={() => onClickEmail(email)}
        >
          {email}
        </a>
      </Span>
    ),
    numberOfSharedProjects: (num, user) => (
      <Span className="block truncate">
        <a
          className="cursor-pointer hover:underline text-blue-500"
          onClick={() => onClickSharedProjects(user)}
        >
          {num !== 1 ? `${num} Projects` : `${num} Project`}
        </a>
      </Span>
    ),
    activated: (isActive) => <>{isActive ? "activated" : "pending"}</>,
    default: (val) => <Span>{val}</Span>,
  };
  const DeleteButton = ({ onClick, disabled }) => (
    <Button
      innerText="Delete"
      iconElement={<TrashIcon className="w-4 h-4 mr-1" />}
      color="whiteDanger"
      className="mb-px ml-2 max-w-max"
      disabled={disabled}
      onClick={onClick}
    />
  );
  const handleDeleteUser = (data) => {
    setLoading(true);
    const unmountModal = () => {
      setLoading(false);
      setShowDeleteModal(false);
    };
    const users = data.filter((id) => id !== user.id);
    deleteUsers(users, unmountModal);
    refreshData();
    setSelectedUserIds([]);
  };
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleSetUserInfo = (key, val) =>
    setUserInfo({ ...userInfo, [key]: val });

  const filteredUsers = sortedUsers.filter((user) => {
    return (
      (userInfo.role === "" ||
        user.role === userInfo.role ||
        userInfo.role === "All") &&
      ((user.firstName &&
        user.firstName.trim().length &&
        user.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.lastName &&
          user.lastName.trim().length &&
          user.lastName.toLowerCase().includes(searchText.toLowerCase())) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()))
    );
  });
  return (
    <>
      <main className="min-h-screen bg-blueGray-100">
      <div className={styles.subheaderContainer}>
      <div className="flex items-right text-lg">Users Panel</div>
        <div className={styles.subheaderTop}>
          <Button
              className="mr-1 whitespace-nowrap py-2.5"
              innerText="Export Project Creators"
              iconElement={<DownloadIcon className="w-4 h-4 ml-1" />}
              color="orange"
              onClick={exportProjectCreators}
            />
            <Button
              className="py-2.5"
              innerText="Export"
              iconElement={<DownloadIcon className="w-4 h-4 ml-1" />}
              color="orange"
              onClick={exportUsers}
            />
        </div>
        <div className={styles.subheaderBottom}>
          <div className="flex gap-x-1">
            <Button
              innerText="Invite a New User"
              iconElement={<PlusIcon className="w-4 h-4 mr-1" />}
              className="py-2.5"
              color="green"
              onClick={toggleInviteUserModal}
            />
            <DeleteButton
              className="py-2.5"
              disabled={!_selectedUserIds.length}
              onClick={() => setShowDeleteModal(true)}
            />
          </div>
          <div className="capitalize h-12 w-3/4 p-1 flex gap-x-3 items-center">
          <SearchBar
              value={searchText}
              onSearch={handleChange}
              placeholder="Search Users"
            />
            <Select
              placeholder="Search by Role"
              className="w-[180px] mb-1 "
              onChange={(val) => handleSetUserInfo("role", val)}
              options={roles || []}
            />
          </div>
        </div>
        </div>
        <section className="py-5 p-10 overflow-x-auto bg-blueGray-100">
          <Table
            columnHeaderDetails={columnController}
            onClickSort={onClickSort}
            ascending={sortedBy.asc}
            hasHeaderCheckbox
            headerCheckboxIsChecked={allUsersAreSelected}
            onCheckHeaderCheckbox={toggleSelectAllUsers}
          >
            {filteredUsers.map((users) => (
              <Row
                key={users.id}
                className={`bg-white ${user.id === users.id ? "pl-16" : "p-0"}`}
                hasCheckbox={user.id === users.id ? false : true}
                onCheck={() => toggleSelectUser(users.id)}
                isChecked={_selectedUserIds.includes(users.id)}
              >
                {columnController.map((col) => (
                  <Cell
                    key={col.key}
                    width={col.width}
                    className="text-sm text-gray-500"
                    hasCheckbox={true}
                  >
                    {columnFormatters[col.key]
                      ? columnFormatters[col.key](users[col.key], users)
                      : columnFormatters.default(users[col.key], users)}
                  </Cell>
                ))}
              </Row>
            ))}
          </Table>
        </section>
      </main>
      {showDeleteModal && (
        <DeleteUserModal
          onClose={() => setShowDeleteModal(false)}
          usersCount={
            allUsersAreSelected
              ? _selectedUserIds.length - 1
              : _selectedUserIds.length
          }
          show={showDeleteModal}
          onConfirm={() => handleDeleteUser(_selectedUserIds)}
        />
      )}
      {selectedSharedProjectsUser && (
        <EditUserSharedProjectsModal
          user={selectedSharedProjectsUser}
          onClose={() => setSelectedSharedProjectUser(null)}
        />
      )}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {showInviteUserModal && <AddUserModal onClose={toggleInviteUserModal} />}
    </>
  );
};
const styles = {
  subheaderContainer: 'border-b-2 border-gray-200 bg-white h-[118px] flex flex-col px-5',
  subheaderTop: 'flex-grow-1 border-b-2 border-gray-100 flex items-center justify-end space-x-4 h-[75px] mb-1',
  subheaderBottom: 'flex justify-between items-center h-10 text-sm pb-1 text-gray-500 flex-grow-1',
};

export default UsersPanel;

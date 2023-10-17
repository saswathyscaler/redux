import React, { Fragment, useState, useContext, useRef } from 'react';
import DatePicker from 'react-datepicker';
import Autocomplete from "react-google-autocomplete";
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/outline';

import { projectAddressFields, PROJECT_ADDRESS_KEYS, projectStatusSuggestions } from 'gmi-domain-logic';

import { ProjectsContext } from '../contexts/ProjectsContext';

import "react-datepicker/dist/react-datepicker.css";

import Modal from '../../shared/components/Modal';
import Button from '../../shared/components/Button';
import { Select } from '../../shared/components/Select';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const NewProjectModal = ({ onClose }) => {
  const googleMapsKey = process.env.REACT_APP_MAPS_KEY;
  
  const initialAddressObj = {};
  PROJECT_ADDRESS_KEYS.forEach(key => {
    const defaultVal = key === 'country' ? 'United States' : '';
    initialAddressObj[key] = defaultVal;
  });
  
  const [loading, setLoading] = useState(false);
  const [projectNum, setProjectNum] = useState('');
  const [projectName, setProjectName] = useState('');
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState(initialAddressObj);
  const [isManualAddressEntryMode, setIsManualAddressEntryMode] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const formattedDateRange = dateRange.map(d => d ? d.toLocaleDateString() : '')


  const _searchBox = useRef(null);
  const _initialFocusRef = useRef(null);

  const toggleIsManualAddressEntryMode = () => setIsManualAddressEntryMode(!isManualAddressEntryMode);

  const { submitNewProject } = useContext(ProjectsContext);

  const handleOnPlaceSelected = selectedPlace => {
    // TODO: test lots of different place types
    const [ street_number, street_name, neighborhood, city, county, state, country, postal_code ] = selectedPlace.address_components;
    setAddress({
      addressLine1: `${(street_number || {}).short_name || ''} ${(street_name || {}).short_name || ''}`,
      addressLine2: '',
      city:  (city || {}).short_name || '',
      state:  (state || {}).short_name || '',
      postalCode:  (postal_code || {}).short_name || '',
      country:  (country || {}).short_name || '',
    });
  }
  
  const handleSubmit= () => {
    setLoading(true);
    const unmountModal = () => {
      setLoading(false);
      onClose();
    };
    const [ startDate, endDate ] = dateRange;
    const addressData = address;
    submitNewProject({ projectName, projectNum, addressData, status, startDate, endDate }, unmountModal);
  }

  const CustomDateRangeInput = React.forwardRef(
    ({ value, onClick }, ref) => {
      return (
      <div
        onClick={onClick} 
        ref={ref}
        className="flex items-center justify-between px-3 py-2 my-1 leading-6 border border-gray-500 rounded w-80 focus-within:ring-blue-600 focus-within:ring-1 focus:border-blue-600 focus-within:ring-offset-blue-600"
        tabIndex={0}
      >
        <div className="flex items-center w-5/12 text-center">
          <CalendarIcon className="w-4 h-4 mr-4" />
          <span>{formattedDateRange[0]}</span>
        </div>
        <span className="p-2"><ArrowRightIcon className="w-4 h-4 text-gray-600" /> </span>
        <span className="w-5/12 text-center">{formattedDateRange[1]}</span>
      </div>
    )},
  );
  
  return (
    <Modal
      isOpen
      size="xl"
      handleClose={onClose}
      closeOnClickaway={false}
      preventDefaultClose={true}
      initialFocusRef={_initialFocusRef}
      title="Create a new project"
    >
      <form>
        <label className="block mt-6" htmlFor="projectName">Project Name <sup className="text-gray-500">*</sup></label>
        <input className="block w-full my-1 rounded"
          ref={_initialFocusRef}
          type="text"
          name="projectName"
          autoComplete="off"
          required
          onChange={(e) => setProjectName(e.target.value)}
        />
        <label className="block mt-6" htmlFor="projectNum">Project Num <sup className="text-gray-500">*</sup></label>
        <input className="block w-full my-1 rounded w-1/2"
          type="text"
          name="projectNum"
          autoComplete="off"
          required
          onChange={(e) => setProjectNum(e.target.value)}
        />
        <label className="block mt-6" htmlFor="autocompleteAddress">Address</label>
        <Autocomplete
          ref={_searchBox}
          type="text"
          className="block w-full my-1 rounded"
          id="autocompleteAddress"
          options={{
            types: [] // if this line is not included it will default to (cities)
          }}
          onPlaceSelected={handleOnPlaceSelected}
          apiKey={googleMapsKey} //TODO: get from server(?)
        />
        <button
          onClick={toggleIsManualAddressEntryMode}
          type="button"
          className="block p-1 my-1 text-blue-700 transition-all delay-75 border-none cursor-pointer hover:bg-blue-100 hover:shadow-md"
        >
          {isManualAddressEntryMode ? "Autocomplete address" : "Enter address manually"}
        </button>
        {isManualAddressEntryMode && (
          <fieldset>
            <legend>Physical Address Fields</legend>
            <div className="flex flex-wrap justify-between">
              {PROJECT_ADDRESS_KEYS.map(key =>  (
                <Fragment key={key}>
                  <label htmlFor={key} className="sr-only">{projectAddressFields[key].display}</label>
                  <input
                    className="py-1 my-1 rounded"
                    style={{ width: '31%' }}
                    type="text"
                    name={key}
                    autoComplete="new-str"
                    value={address[key]}
                    placeholder={projectAddressFields[key].display}
                    onChange={e => {
                      e.persist();
                      setAddress(prev => ({ ...prev, [key]: e.target.value }))
                    }}
                  />
                </Fragment>
              ))}
            </div>
          </fieldset>
        )}
        <label className="block mt-6" htmlFor="autocompleteAddress">Project Status</label>
        <Select
          className="w-1/2 h-full"
          placeholder="Select One (optional)"
          options={projectStatusSuggestions || []}
          onChange={(val) => setStatus(val)}
        />
        <label className="block mt-6">Project Dates</label>
        <DatePicker
          selected={dateRange[0]}
          onChange={(dates) => setDateRange(dates)}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          selectsRange
          customInput={<CustomDateRangeInput />}
        />
        <span className="block mt-6"/>
        <div className="flex justify-between mt-6">
          <Button
            onClick={onClose}
            variant="modal"
            color="gray"
            innerText="Cancel"
          />
          <Button
            onClick={handleSubmit}
            variant="modal"
            color="blue"
            disabled={!projectName}
            innerText="Submit"
          />
        </div>
      </form>
      {loading && <LoadingSpinner />}
    </Modal>
  )
}

export default NewProjectModal;

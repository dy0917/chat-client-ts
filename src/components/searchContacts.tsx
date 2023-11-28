import { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { findUsersByQueryString } from '../store/slices/contact';
import store from '../store';
import { TUser } from '../types/user';

type SearchContactType = {
  onSelectContact: (contact:any) => void;
};

export const SearchContacts = ({ onSelectContact }: SearchContactType) => {
  const [options, setOptions] = useState<any>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.contacts);
  const handleSearch = async (query: string) => {
    await dispatch(findUsersByQueryString({ queryString: query }));
    const contacts = store.getState().contacts.tempContacts;
    setOptions(contacts);
  };

  const setSingleSelections = (selected: any[]) => {
    onSelectContact(selected[0] as TUser);
  };

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <>
      <AsyncTypeahead
        filterBy={filterBy}
        id="async-example"
        isLoading={status.toLowerCase() === 'isLoading'}
        labelKey="firstName"
        minLength={3}
        onChange={setSingleSelections}
        onSearch={handleSearch}
        options={options}
        placeholder="Search for a user..."
        renderMenuItemChildren={(option: any) => (
          <>
            <span>{option.firstName}</span>
          </>
        )}
      />
    </>
  );
};

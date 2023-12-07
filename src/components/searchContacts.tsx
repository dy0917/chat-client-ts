import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  AsyncTypeahead,
  Menu,
  MenuItem,
  RenderMenuProps,
} from 'react-bootstrap-typeahead';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { findUsersByQueryString } from '../store/slices/contact';
import store from '../store';
import { TUser } from '../types/user';
import { Spinner } from 'react-bootstrap';

type SearchContactType = {
  onSelectContact: (contact: any) => void;
};

export const SearchContacts = ({ onSelectContact }: SearchContactType) => {
  const [options, setOptions] = useState<any>([]);
  const refheader = useRef<any>(null);
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

  const onInputChange = (
    text: string,
    _event: ChangeEvent<HTMLInputElement>
  ) => {
    if (text.length < 3) {
      setOptions([]);
    }
  };

  const isLoading = () => status.toLowerCase() === 'loading';
  const filterBy = () => true;

  useEffect(() => {
    if (refheader.current) refheader.current.focus();
  }, []);

  return (
    <div>
      <AsyncTypeahead
        filterBy={filterBy}
        ref={refheader}
        id="async-example"
        isLoading={false}
        labelKey="firstName"
        minLength={3}
        onInputChange={onInputChange}
        onChange={setSingleSelections}
        onSearch={handleSearch}
        options={options}
        placeholder="Search for a user..."
        renderMenu={(results: any[], menuProps: RenderMenuProps) => {
          return (
            <Menu {...menuProps}>
              {isLoading() ? (
                <MenuItem option={{}} position={1}>
                  <Spinner animation="border" role="status" size="sm">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </MenuItem>
              ) : results.length > 0 ? (
                <>
                  {results.map((result, index) => (
                    <MenuItem option={result} position={index}>
                      {result.firstName}
                    </MenuItem>
                  ))}
                </>
              ) : (
                <MenuItem option={{}} position={1}>
                  No matches found
                </MenuItem>
              )}
            </Menu>
          );
        }}
      />
    </div>
  );
};

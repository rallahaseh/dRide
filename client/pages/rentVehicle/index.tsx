import { useState } from 'react';
import { NextPage } from 'next';
import { SearchResult, SearchVehicle } from './search';
import { Vehicle } from './rental-vehicles';
import Box from '@mui/material/Box';

enum State {
  search,
  result
}

const IndexPage: NextPage = () => {
  const [state, setState] = useState<State>(State.search);
  const [searchResult, setSearchResult] = useState<SearchResult>();

  const onSearchClickedHandler = (_searchResult: SearchResult) => {
    setState(State.result)
    setSearchResult(_searchResult);
  }

  const SearchComponent = () => {
    return (
      <SearchVehicle onSearchClickedHandler={onSearchClickedHandler} />
    );
  }

  const VehiclesComponent = () => {
    return (
      <Vehicle result={searchResult} />
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {state === State.search && <SearchComponent />}
      {state === State.result && <VehiclesComponent />}
    </Box>
  );
};

export default IndexPage;
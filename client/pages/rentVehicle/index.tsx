import { useState } from 'react';
import { NextPage } from 'next';
import { SearchResult, SearchVehicle } from './search';
import { Vehicle } from './rental-vehicles';
import { Box, Grid, Paper, Alert } from '@mui/material';

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

  const getDateFormatted = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString()
  }

  const VehiclesComponent = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid container item spacing={3}>
            <Grid item xs={16}>
              <Paper>
                <Alert severity="info">
                  {"List of available vehicles from " + getDateFormatted(searchResult!.date.from!) + " - " + getDateFormatted(searchResult!.date.to!)}
                </Alert>
              </Paper>
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={16}>
              <Vehicle result={searchResult} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
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
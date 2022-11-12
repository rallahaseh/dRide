import { Fragment, useState } from 'react';
import { fetchAllNFTs, NFTData, NFTItem, queryAllNFTs, queryClient } from '../api/index';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { SWRConfig } from 'swr';
import { SearchResult, SearchVehicle } from './search';
import { Vehicle } from './rental-vehicles';
import Box from '@mui/material/Box';

enum State {
  search,
  result
}

const IndexPage: NextPage<IndexPageProps> = (props: IndexPageProps) => {
  const { fallback } = props;
  const [state, setState] = useState<State>(State.search);

  const onSearchClickedHandler = (searchResult: SearchResult) => {
    setState(State.result)
    // const result = fallback.allnfts.filter((nft) => {
    //   if (searchResult.location) {
    //     let searchLocation = whichCountry[searchResult.location.center[0], searchResult.location.center[1]]
    //     let nftLocation = whichCountry[nft.userLocation.latitude, nft.userLocation.longitude]
    //     return (nft.date.from <= searchResult.date.from!) && (searchLocation == nftLocation);
    //   } else {
    //     return nft.date.from <= searchResult.date.from!;
    //   }
    // });
    // console.log(result)
  }

  const SearchComponent = () => {
    return (
      <SearchVehicle onSearchClickedHandler={onSearchClickedHandler} />
    );
  }

  const VehiclesComponent = () => {
    return (
      <Fragment>
        <SWRConfig value={{ fallback }}>
          <Vehicle />
        </SWRConfig>
      </Fragment>
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

export const getServerSideProps = async () => {
  const data = await queryClient.query(queryAllNFTs, {}).toPromise();
  const response: NFTItem[] = await fetchAllNFTs(data.data.tokens as NFTData[]);

  return {
    props: {
      fallback: {
        allnfts: response
      }
    }
  };
};

interface IndexPageProps extends InferGetServerSidePropsType<typeof getServerSideProps> { }

export default IndexPage;
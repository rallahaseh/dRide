import { Fragment } from 'react';
import { fetchAllNFTs, NFTData, NFTItem, queryAllNFTs, queryClient } from '../api/index';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { SWRConfig } from 'swr';
import { GridCard } from './rentVehicle';

const IndexPage: NextPage<IndexPageProps> = (props: IndexPageProps) => {
  const { fallback } = props;

  return (
    <Fragment>
      <SWRConfig value={{ fallback }}>
        <GridCard />
      </SWRConfig>
    </Fragment>
  );
};

export const getServerSideProps = async () => {
  const data = await queryClient.query(queryAllNFTs, {}).toPromise();
  const res: NFTItem[] = await fetchAllNFTs(data.data.tokens as NFTData[]);

  return {
    props: {
      fallback: {
        allnfts: res
      }
    }
  };
};

interface IndexPageProps extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export default IndexPage;
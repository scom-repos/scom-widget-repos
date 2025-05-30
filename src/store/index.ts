import { application } from "@ijstech/components";
import { Wallet } from "@ijstech/eth-wallet";
import { IContractInfo } from '../interface';

const state = {
  contractInfo: {},
  transportEndpoint: '',
  mode: 'development',
  storageConfig: {},
  rootCid: ''
}

export const getContractInfoByChain = () => {
  return state.contractInfo
}

export const setContractInfoByChain = (value: Record<string, IContractInfo>) => {
  state.contractInfo = value;
}

export const getContractAddress = async (type: keyof IContractInfo, chainId?: number): Promise<string> => {
  if (!chainId) {
    chainId = Wallet.getClientInstance().chainId;
  }
  const contracts = await getContractInfo(chainId) || {};
  return contracts[type]?.address
}

export const getContractInfo = async (chainId: number): Promise<IContractInfo> => {
  let contractInfoByChain = application.store['contractInfoByChain'];
  if (!contractInfoByChain) {
    contractInfoByChain = getContractInfoByChain();
  }
  return contractInfoByChain?.[chainId];
}

export const setTransportEndpoint = (transportEndpoint: string) => {
  state.transportEndpoint = transportEndpoint;
}

export const getTransportEndpoint = () => {
  return state.transportEndpoint;
}

export const isLoggedIn = () => {
  return true;
  const isLoggedIn = application.store['isLoggedIn'];
  return isLoggedIn && isLoggedIn(Wallet.getClientInstance().address);
}

export const setStorageConfig = (config: any) => {
  state.storageConfig = config;
}

export const getStorageConfig = () => {
  return state.storageConfig;
}

export const setRootCid = (rootCid: string) => {
  state.rootCid = rootCid;
}

export const getRootCid = () => {
  return state.rootCid;
}

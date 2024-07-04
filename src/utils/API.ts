import { application } from "@ijstech/components";
import { Wallet, ISendTxEventsOptions } from "@ijstech/eth-wallet";
// import { Contracts } from "@scom/scom-dev-contract";
import { AuditResult, IAuditInfo, IAuditReportInfo, IAuditReportResultInfo, ICommit, IProject, IRouterResult, ISemanticVersion, PackageStatus } from "../interface";
import { getContractAddress, getTransportEndpoint } from '../store/index';

const API_URL = 'https://dev.decom.app';
const API_EMBED_URL = `${API_URL}/api/embed/v0`;
const getIPFSBaseUrl = () => {
  return `${getTransportEndpoint()}/ipfs/`;
}

const _fetchFileContentByCID = async (ipfsCid: string) => {
  let res;
  try {
    const ipfsBaseUrl = getIPFSBaseUrl();
    res = await fetch(ipfsBaseUrl + ipfsCid);
  } catch (err) {
  }
  return res;
}

const checkGithubOwner = async () => {
  let result: any;
  try {
    let response = await fetch(`${API_URL}/github/owner?address=${Wallet.getClientInstance().address}`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[checkGithubOwner]")
  }
  return result?.data;
}

export const registerSendTxEvents = (sendTxEventHandlers: ISendTxEventsOptions) => {
  const wallet = Wallet.getClientInstance();
  wallet.registerSendTxEvents({
    transactionHash: (error: Error, receipt?: string) => {
      if (sendTxEventHandlers.transactionHash) {
        sendTxEventHandlers.transactionHash(error, receipt);
      }
    },
    confirmation: (receipt: any) => {
      if (sendTxEventHandlers.confirmation) {
        sendTxEventHandlers.confirmation(receipt);
      }
    },
  })
}

const getGithubUser = async () => {
  let result: any;
  try {
    let response = await fetch(`${API_URL}/github/user`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[getGithubUser]")
  }
  return result;
}

const getAllRepos = async (owner?: string, prefix?: string, withPRs?: boolean) => {
  let result: any;
  const queryParams = [];
  if (owner) {
    queryParams.push(`owner=${owner}`);
  }
  if (prefix) {
    queryParams.push(`prefix=${prefix}`);
  }
  if (withPRs) {
    queryParams.push(`withPRs=${withPRs}`);
  }
  const queryString = queryParams.join('&');
  try {
    let response = await fetch(`${API_URL}/github/all-repos${queryString ? `?${queryString}` : ''}`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[getAllRepos]")
  }
  return result;
}

const isActiveAuditor = async () => {
  let isPermitted = false;
  let wallet = Wallet.getInstance();
  try {
    let contractAddress = await getContractAddress("AuditorInfo");
    // let auditorInfo = new Contracts.AuditorInfo(wallet, contractAddress);
    // isPermitted = await auditorInfo.isActiveAuditor(wallet.address);
  } catch (err) {
    console.log('err', err)
  }
  return isPermitted;
}

const getAuditInfo = async (commitGuid: string) => {
  let result: IAuditInfo;
  try {
    let response = await fetch(`${API_EMBED_URL}/getAuditCommit?commitGuid=${commitGuid}`, {
      method: 'GET'
    });
    const { data } = await response.json();
    result = data;
  } catch (err) {
    console.log("[getAuditInfo]")
  }
  return result;
}

const getAuditReportInfo = async (commitGuid: string) => {
  let auditInfo = await getAuditInfo(commitGuid);
  if (auditInfo.auditStatus !== PackageStatus.AUDITING)
    return getAuditReportResult(commitGuid, auditInfo);
  let auditReportInfo: IAuditReportInfo = {
    commitGuid: auditInfo.guid,
    packageGuid: auditInfo.packgeGuid,
    projectId: auditInfo.projectId,
    projectGuid: auditInfo.projectGuid,
    packageId: auditInfo.packageId,
    packageVersionId: auditInfo.packageVersionId,
    commitId: auditInfo.sha,
    owner: auditInfo.owner,
    ipfsCid: auditInfo.ipfsCid,
    ipfsReportCid: auditInfo.ipfsReportCid,
    auditDate: auditInfo.auditDate,
    auditedBy: auditInfo.auditedBy ?? '',
    result: auditInfo.auditStatus,
    checklist: [],
    comment: '',
    version: auditInfo.version,
    projectName: auditInfo.projectName,
    packageName: auditInfo.packageName,
    packageOwner: auditInfo.packageOwner,
    imgUrl: auditInfo.imgUrl,
    message: auditInfo.message,
    url: auditInfo.url,
    auditStatus: auditInfo.auditStatus
  }
  return auditReportInfo;
}

const getAuditReportResult = async (commitGuid: string, auditInfo?: IAuditInfo) => {
  if (!auditInfo) auditInfo = await getAuditInfo(commitGuid);
  let auditReportResultInfo = {} as IAuditReportResultInfo;
  if (auditInfo.ipfsReportCid) {
    let result = await _fetchFileContentByCID(auditInfo.ipfsReportCid);
    auditReportResultInfo = (await result.json());
  }
  let auditReportInfo: IAuditReportInfo = {
    ...auditInfo,
    ...auditReportResultInfo,
    ipfsCid: auditInfo.ipfsCid
  }
  return auditReportInfo;
}

const getAuditPRList = async (packageName: string) => {
  let result: any;
  try {
    let response = await fetch(`${API_EMBED_URL}/getAuditPRList?packageName=${packageName}`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[getAuditPRList]")
  }
  return result;
}

const auditCommit = async (data: any) => {
  let result;
  try {
    let response = await fetch(`${API_EMBED_URL}/commit/audit`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    result = await response.json();
  } catch (err) {
    console.log("[auditCommit]")
  }
  return result;
}

const uploadDataToIpfs = async (data: string, fileName: string) => {
  try {
    const uploadResult = await application.uploadData(fileName, data);
    return uploadResult.data?.links?.[0]?.cid;
  } catch (err) {
    return '';
  }
}

const getAllFiles = async (commitGuid: string) => {
  let result: any;
  try {
    const commitInfo = await getAuditInfo(commitGuid);
    if (!commitInfo) return { error: 'Cannot fetch commit info' };
    const { auditStatus, ipfsCid, sha, packageOwner, packageName, projectName } = commitInfo;
    let files = [];
    if (auditStatus === PackageStatus.AUDIT_PASSED && ipfsCid) {
      const ipfsData = await _fetchFileContentByCID(ipfsCid);
      files = (await ipfsData.json());
    } else {
      let response = await fetch(`github/all-files?owner=${packageOwner}&repo=${packageName}&commitId=${sha}`, {
        method: 'GET'
      });
      const res = await response.json();
      if (!res.data) return { error: 'Cannot fetch commit files' };
      files = res.data;
    }
    result = {
      files,
      projectName,
      packageOwner,
      packageName,
      sha
    }
  } catch (err) {
    result = err;
    console.log("[getAllFiles]");
  }
  return result;
}

const getPull = async (owner: string, repo: string, prNumber: string | number) => {
  let result: any;
  try {
    let response = await fetch(`${API_URL}/github/pull?owner=${owner}&repo=${repo}&prNumber=${prNumber}`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[getPull]")
  }
  return result;
}

const getAllPulls = async (owner: string, repo: string) => {
  let result: any;
  try {
    let response = await fetch(`${API_URL}/github/all-pulls?owner=${owner}&repo=${repo}`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[getAllPulls]")
  }
  return result;
}

const auditPR = async (packageOwner: string, packageName: string, mergeNumber: number, mergeSHA: string, ipfsReportCid: string, ipfsCid: string, auditStatus: string) => {
  let result;
  try {
    let body = {
      packageOwner,
      packageName,
      mergeNumber,
      mergeSHA,
      ipfsReportCid,
      ipfsCid,
      auditStatus
    }
    let response = await fetch(`${API_EMBED_URL}/pr/audit`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    result = await response.json();
  } catch (err) {
    console.log("[auditPR]")
  }
  return result;
}

const getAuditPRInfo = async (mergeId: string) => {
  let result: IAuditInfo;
  try {
    let response = await fetch(`${API_EMBED_URL}/getAuditPR?mergeId=${mergeId}`, {
      method: 'GET'
    });
    const { data } = await response.json();
    result = data;
  } catch (err) {
    console.log("[getAuditPRInfo]")
  }
  return result;
}

const getAuditPRReportInfo = async (mergeId: string) => {
  let auditInfo = await getAuditPRInfo(mergeId);
  if (auditInfo.auditStatus !== PackageStatus.AUDITING)
    return getAuditPRReportResult(mergeId, auditInfo);
  let auditReportInfo: IAuditReportInfo = {
    mergeId: auditInfo.mergeId,
    commitId: auditInfo.sha,
    owner: auditInfo.owner,
    ipfsCid: auditInfo.ipfsCid,
    ipfsReportCid: auditInfo.ipfsReportCid,
    auditDate: auditInfo.auditDate,
    auditedBy: auditInfo.auditedBy ?? '',
    result: auditInfo.auditStatus,
    checklist: [],
    comment: '',
    packageName: auditInfo.packageName,
    packageOwner: auditInfo.packageOwner,
    auditStatus: auditInfo.auditStatus
  }
  return auditReportInfo;
}

const getAuditPRReportResult = async (mergeId: string, auditInfo?: IAuditInfo) => {
  if (!auditInfo) auditInfo = await getAuditPRInfo(mergeId);
  let auditReportResultInfo = {} as IAuditReportResultInfo;
  if (auditInfo.ipfsReportCid) {
    let result = await _fetchFileContentByCID(auditInfo.ipfsReportCid);
    auditReportResultInfo = (await result.json());
  }
  let auditReportInfo: IAuditReportInfo = {
    ...auditInfo,
    ...auditReportResultInfo,
    ipfsCid: auditInfo.ipfsCid
  }
  return auditReportInfo;
}

const auditPackageVersion = async (packageVersionId: number, pass: boolean, reportCid: string, callback?: any, confirmationCallback?: any) => {
  let receipt;
  let wallet = Wallet.getInstance();
  try {
    let contractAddress = await getContractAddress("AuditInfo");
    // let auditInfo = new Contracts.AuditInfo(wallet, contractAddress);
    // registerSendTxEvents({
    //   transactionHash: callback,
    //   confirmation: confirmationCallback
    // });
    // receipt = await auditInfo.addAuditReport({
    //   packageVersionsId: packageVersionId,
    //   auditResult: pass ? AuditResult.PASSED : AuditResult.FAILED,
    //   ipfsCid: reportCid
    // });
  } catch (err) {
    if (callback) callback(err);
  }
  return receipt;
}

const createNewPackage = async (projectId: number, name: string, ipfsCid: string, category: string, callback?: any, confirmationCallback?: any) => {
  let receipt, packageId;
  const wallet = Wallet.getInstance();
  try {
    let contractAddress = await getContractAddress("ProjectInfo");
    // let projectInfo = new Contracts.ProjectInfo(wallet, contractAddress);
    // registerSendTxEvents({
    //   transactionHash: callback,
    //   confirmation: confirmationCallback
    // });
    // receipt = await projectInfo.newPackage({ projectId, name, ipfsCid, category });
    // if (receipt) {
    //   let newPackageEvent = projectInfo.parseNewPackageEvent(receipt)[0];
    //   packageId = newPackageEvent.packageId.toNumber();
    // }
  } catch (err) {
    if (callback) callback(err);
  }
  return { packageId, receipt };
}

const createNewPackageVersion = async (projectId: number, packageId: number, version: ISemanticVersion, ipfsCid: string, callback?: any, confirmationCallback?: any) => {
  let receipt, packageVersionId;
  const wallet = Wallet.getInstance();
  try {
    let contractAddress = await getContractAddress("ProjectInfo");
    // let projectInfo = new Contracts.ProjectInfo(wallet, contractAddress);
    // registerSendTxEvents({
    //   transactionHash: callback,
    //   confirmation: confirmationCallback
    // });
    // receipt = await projectInfo.newPackageVersion({ projectId, packageId, version, ipfsCid });
    // packageVersionId = projectInfo.parseNewPackageVersionEvent(receipt)?.[0]?.packageVersionId.toNumber()
  } catch (err) {
    if (callback) callback(err);
  }
  return { receipt, packageVersionId };
}

const getCommits = async (offset: number, limit: number, filter?: { [key: string]: string }): Promise<{
  total: number;
  list: ICommit[];
}> => {
  try {
    let queries = new URLSearchParams(filter).toString();
    let url = `${API_EMBED_URL}/commits?limit=${limit}&offset=${offset}${queries ? "&" + queries : ""}`;
    let response = await fetch(url, {
      method: 'GET'
    });
    const result = await response.json();
    return result?.data || { total: 0, list: [] };
  } catch (err) {
    console.log("[getCommits]")
  }
  return {
    total: 0,
    list: []
  }
}

const getMergeMsg = async (guid: string, repoOwner: string, repoName: string) => {
  let result: IRouterResult;
  try {
    let response = await fetch(`${API_EMBED_URL}/getPackageMsg?guid=${guid}&repoOwner=${repoOwner}&repoName=${repoName}`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[getMergeMsg]")
  }
  return result;
}

const getPackageByNames = async (packageOwner: string, packageName: string) => {
  try {
    const url = `${API_EMBED_URL}/getPackageByNames?packageOwner=${packageOwner}&packageName=${packageName}`;
    let response = await fetch(url, {
      method: 'GET'
    });
    const result = await response.json();
    return result?.data;
  } catch (err) {
    console.log("[getPackageByNames]")
  }
  return null;
}

const mergePR = async (address: string, signature: string, owner: string, repo: string, prNumber: number) => {
  let result: any;
  try {
    let response = await fetch(`${API_URL}/github/merge`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, owner, repo, prNumber })
    });
    result = await response.json();
  } catch (err) {
    console.log("[mergePR]")
  }
  return result;
}

const requestAuditCommit = async (commitGuid: string, projectGuid: string, projectId: number, packageId: number, packageVersionId: number, version: string, commitId: string, status: boolean) => {
  let result: IRouterResult;
  try {
    let body = {
      commitGuid,
      packageId,
      projectId,
      packageVersionId,
      projectGuid,
      owner: Wallet.getClientInstance().address,
      commitId,
      version,
      status: status ? 1 : 0
    }
    let response = await fetch(`${API_EMBED_URL}/commit/requestAudit`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    result = await response.json();
  }
  catch (err) {
    console.log("[requestAuditCommit] error: ", err);
  }
  return result;
}

const syncCommits = async (owner: string, repo: string) => {
  let result: any;
  try {
    let response = await fetch(`github/sync-commits?owner=${owner}&repo=${repo}`, {
      method: 'GET'
    });
    result = await response.json();
  } catch (err) {
    console.log("[syncCommits]")
  }
  return result;
}

const updatePackageVersionIpfsCid = async (packageVersionId: number, packageId: number, ipfsCid: string, callback?: any, confirmationCallback?: any) => {
  let receipt;
  const wallet = Wallet.getInstance();
  try {
    let contractAddress = await getContractAddress("ProjectInfo");
    // let projectInfo = new Contracts.ProjectInfo(wallet, contractAddress);
    // registerSendTxEvents({
    //   transactionHash: callback,
    //   confirmation: () => confirmationCallback(packageId, projectInfo.parseNewPackageVersionEvent(receipt)[0].packageVersionId || packageVersionId)
    // });
    // receipt = await projectInfo.updatePackageVersionIpfsCid({ packageVersionId, ipfsCid });
  } catch (err) {
    if (callback) callback(err);
  }

  return receipt;
}

const updatePackageVersionToAuditing = async (packageVersionId: number, callback?: any, confirmationCallback?: any) => {
  let receipt;
  let wallet = Wallet.getInstance();
  try {
    let contractAddress = await getContractAddress("ProjectInfo");
    // let projectInfo = new Contracts.ProjectInfo(wallet, contractAddress);
    // registerSendTxEvents({
    //   transactionHash: callback,
    //   confirmation: confirmationCallback
    // });
    // receipt = await projectInfo.setPackageVersionToAuditing(packageVersionId);
  } catch (err) {
    if (callback) callback(err);
  }
  return receipt;
}

const createRepo = async (params: { name: string, description?: string, private?: boolean }) => {
  let result: any;
  try {
    let response = await fetch(`${API_URL}/github/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    result = await response.json();
  } catch (err) {
    console.log("[createRepo]")
  }
  return result;
}

const getProject = async (guid: string): Promise<IProject | undefined> => {
  let project: IProject;
  try {
    let projectResponse = await fetch(`${API_EMBED_URL}/project?guid=${guid}`);
    let projectResult = await projectResponse.json();
    project = {
      ...projectResult.data
    }
    return project;
  } catch (err) {
    console.log("[getMicroDapp] error: ", err);
  }
}


export {
  checkGithubOwner,
  getAllRepos,
  getGithubUser,
  isActiveAuditor,
  getAuditInfo,
  getAuditReportResult,
  getAuditReportInfo,
  getAuditPRList,
  getAuditPRReportInfo,
  auditCommit,
  uploadDataToIpfs,
  getAllFiles,
  getPull,
  getAllPulls,
  auditPR,
  auditPackageVersion,
  createNewPackage,
  createNewPackageVersion,
  getCommits,
  getMergeMsg,
  mergePR,
  getPackageByNames,
  requestAuditCommit,
  syncCommits,
  updatePackageVersionIpfsCid,
  updatePackageVersionToAuditing,
  createRepo,
  getProject
}
export type ActionType = 'ViewRecord' | 'SubmitReport' | 'StartAudit';

export enum PackageStatus {
  AUDITING = 'pending',
  AUDIT_PASSED = 'passed',
  AUDIT_FAILED = 'failed'
}

export interface IAuditInfo {
  guid: string;
  projectId?: number;
  projectGuid?: string;
  packageId?: number;
  packgeGuid?: string;
  packageVersionId?: number;
  mergeId?: string;
  projectName?: string;
  packageName: string;
  packageOwner?: string;
  version?: string;
  message?: string;
  url?: string;
  owner: string;
  sha: string;
  auditedBy: string;
  ipfsReportCid: string;
  ipfsCid: string;
  imgUrl?: string;
  auditStatus: string;
  auditDate: number;
}

interface IAuditChecklistItem {
  checked: boolean;
  comment: string;
}

export interface IAuditReportResultInfo {
  commitGuid?: string;
  projectId?: number;
  projectGuid?: string;
  packageGuid?: string;
  packageId?: number;
  packageVersionId?: number;
  mergeId?: string;
  packageName: string;
  packageOwner: string;
  version?: string;
  commitId: string;
  owner: string;
  ipfsReportCid: string;
  ipfsCid: string;
  auditDate: number;
  auditedBy: string;
  result: PackageStatus;
  checklist: IAuditChecklistItem[];
  comment: string;
}

export interface IAuditReportInfo extends IAuditReportResultInfo {
  projectName?: string;
  mergeNumber?: number;
  mergeTitle?: string;
  mergeSha?: string;
  imgUrl?: string;
  message?: string;
  url?: string;
  auditStatus: string;
}

export interface ISemanticVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface ICodeInfoFileContent {
  version: ISemanticVersion;
  codeCID: string;
  source: string;
}

export interface ICommit {
  guid: string;
  packageGuid: string;
  packageId?: number;
  packageVersionId?: number;
  packageOwner: string;
  packageName: string;
  projectGuid: string;
  projectId?: number;
  owner?: string;
  committer: string;
  message: string;
  sha: string;
  url: string;
  version: string;
  date: string;
  ipfsCid?: string;
  ipfsReportCid?: string;
  auditedBy?: string;
  auditDate?: number;
  auditStatus?: PackageStatus;
  isIpfsPublished?: number;
  isNpmPublished?: number;
  publishIpfsDate?: number;
  publishNpmDate?: number;
}

export interface IContractDetailInfo {
  address: string;
}

export interface IContractInfo {
  Proxy: IContractDetailInfo;
  ProjectInfo: IContractDetailInfo;
  AuditorInfo: IContractDetailInfo;
  AuditInfo: IContractDetailInfo;
  Scom: IContractDetailInfo;
}

export type ContractInfoByChainType = { [key: number]: IContractInfo };

export enum AuditResult { FAILED, WARNING, PASSED };
export enum AuditorStatus { Inactive, Active, Freezed, Super };

export interface IRouterResult {
  success: boolean;
  data?: any;
  error?: IRouterResultError;
}

interface IRouterResultError {
  message: string;
}

export interface IProject {
  guid: string;
  id: number;
  dataUri: string;
  name: string;
  description: string;
  mediaCid: string;
  img: string;
  prefix?: string;
  banner?: string;
  socialLinks?: IProjectSocialLink[];
  owner: string;
  meta?: IMetaData;
}

export interface IMetaData {
  favicon?: string;
  title?: string;
  description?: string;
}

export interface IProjectSocialLink {
  type: string;
  url: string;
}

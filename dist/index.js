var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-widget-repos/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuditorStatus = exports.AuditResult = exports.PackageStatus = void 0;
    var PackageStatus;
    (function (PackageStatus) {
        PackageStatus["AUDITING"] = "pending";
        PackageStatus["AUDIT_PASSED"] = "passed";
        PackageStatus["AUDIT_FAILED"] = "failed";
    })(PackageStatus = exports.PackageStatus || (exports.PackageStatus = {}));
    var AuditResult;
    (function (AuditResult) {
        AuditResult[AuditResult["FAILED"] = 0] = "FAILED";
        AuditResult[AuditResult["WARNING"] = 1] = "WARNING";
        AuditResult[AuditResult["PASSED"] = 2] = "PASSED";
    })(AuditResult = exports.AuditResult || (exports.AuditResult = {}));
    ;
    var AuditorStatus;
    (function (AuditorStatus) {
        AuditorStatus[AuditorStatus["Inactive"] = 0] = "Inactive";
        AuditorStatus[AuditorStatus["Active"] = 1] = "Active";
        AuditorStatus[AuditorStatus["Freezed"] = 2] = "Freezed";
        AuditorStatus[AuditorStatus["Super"] = 3] = "Super";
    })(AuditorStatus = exports.AuditorStatus || (exports.AuditorStatus = {}));
    ;
});
define("@scom/scom-widget-repos/store/index.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet"], function (require, exports, components_1, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getScomCid = exports.setScomCid = exports.getStorageConfig = exports.setStorageConfig = exports.isLoggedIn = exports.getTransportEndpoint = exports.setTransportEndpoint = exports.getContractInfo = exports.getContractAddress = exports.setContractInfoByChain = exports.getContractInfoByChain = void 0;
    const state = {
        contractInfo: {},
        transportEndpoint: '',
        mode: 'development',
        storageConfig: {},
        scomCid: ''
    };
    const getContractInfoByChain = () => {
        return state.contractInfo;
    };
    exports.getContractInfoByChain = getContractInfoByChain;
    const setContractInfoByChain = (value) => {
        state.contractInfo = value;
    };
    exports.setContractInfoByChain = setContractInfoByChain;
    const getContractAddress = async (type, chainId) => {
        if (!chainId) {
            chainId = eth_wallet_1.Wallet.getClientInstance().chainId;
        }
        const contracts = await (0, exports.getContractInfo)(chainId) || {};
        return contracts[type]?.address;
    };
    exports.getContractAddress = getContractAddress;
    const getContractInfo = async (chainId) => {
        let contractInfoByChain = components_1.application.store['contractInfoByChain'];
        if (!contractInfoByChain) {
            contractInfoByChain = (0, exports.getContractInfoByChain)();
        }
        return contractInfoByChain?.[chainId];
    };
    exports.getContractInfo = getContractInfo;
    const setTransportEndpoint = (transportEndpoint) => {
        state.transportEndpoint = transportEndpoint;
    };
    exports.setTransportEndpoint = setTransportEndpoint;
    const getTransportEndpoint = () => {
        return state.transportEndpoint;
    };
    exports.getTransportEndpoint = getTransportEndpoint;
    const isLoggedIn = () => {
        return true;
        const isLoggedIn = components_1.application.store['isLoggedIn'];
        return isLoggedIn && isLoggedIn(eth_wallet_1.Wallet.getClientInstance().address);
    };
    exports.isLoggedIn = isLoggedIn;
    const setStorageConfig = (config) => {
        state.storageConfig = config;
    };
    exports.setStorageConfig = setStorageConfig;
    const getStorageConfig = () => {
        return state.storageConfig;
    };
    exports.getStorageConfig = getStorageConfig;
    const setScomCid = (scomCid) => {
        state.scomCid = scomCid;
    };
    exports.setScomCid = setScomCid;
    const getScomCid = () => {
        return state.scomCid;
    };
    exports.getScomCid = getScomCid;
});
define("@scom/scom-widget-repos/utils/API.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-widget-repos/interface.ts", "@scom/scom-widget-repos/store/index.ts"], function (require, exports, components_2, eth_wallet_2, interface_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProject = exports.createRepo = exports.updatePackageVersionToAuditing = exports.updatePackageVersionIpfsCid = exports.syncCommits = exports.requestAuditCommit = exports.getPackageByNames = exports.mergePR = exports.getMergeMsg = exports.getCommits = exports.createNewPackageVersion = exports.createNewPackage = exports.auditPackageVersion = exports.auditPR = exports.getAllPulls = exports.getPull = exports.getAllFiles = exports.uploadDataToIpfs = exports.auditCommit = exports.getAuditPRReportInfo = exports.getAuditPRList = exports.getAuditReportInfo = exports.getAuditReportResult = exports.getAuditInfo = exports.isActiveAuditor = exports.getGithubUser = exports.getAllRepos = exports.checkGithubOwner = exports.registerSendTxEvents = void 0;
    const API_URL = 'https://dev.decom.app';
    const API_EMBED_URL = `${API_URL}/api/embed/v0`;
    const getIPFSBaseUrl = () => {
        return `${(0, index_1.getTransportEndpoint)()}/ipfs/`;
    };
    const _fetchFileContentByCID = async (ipfsCid) => {
        let res;
        try {
            const ipfsBaseUrl = getIPFSBaseUrl();
            res = await fetch(ipfsBaseUrl + ipfsCid);
        }
        catch (err) {
        }
        return res;
    };
    const checkGithubOwner = async () => {
        let result;
        try {
            let response = await fetch(`${API_URL}/github/owner?address=${eth_wallet_2.Wallet.getClientInstance().address}`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[checkGithubOwner]");
        }
        return result?.data;
    };
    exports.checkGithubOwner = checkGithubOwner;
    const registerSendTxEvents = (sendTxEventHandlers) => {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            },
        });
    };
    exports.registerSendTxEvents = registerSendTxEvents;
    const getGithubUser = async () => {
        let result;
        try {
            let response = await fetch(`${API_URL}/github/user`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[getGithubUser]");
        }
        return result;
    };
    exports.getGithubUser = getGithubUser;
    const getAllRepos = async (owner, prefix, withPRs) => {
        let result;
        // const queryParams = [];
        // if (owner) {
        //   queryParams.push(`owner=${owner}`);
        // }
        // if (prefix) {
        //   queryParams.push(`prefix=${prefix}`);
        // }
        // if (withPRs) {
        //   queryParams.push(`withPRs=${withPRs}`);
        // }
        // const queryString = queryParams.join('&');
        const queryString = 'org=scom-repos';
        try {
            let response = await fetch(`${API_URL}/github/all-repos${queryString ? `?${queryString}` : ''}`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[getAllRepos]");
        }
        return result;
    };
    exports.getAllRepos = getAllRepos;
    const isActiveAuditor = async () => {
        let isPermitted = false;
        let wallet = eth_wallet_2.Wallet.getInstance();
        try {
            let contractAddress = await (0, index_1.getContractAddress)("AuditorInfo");
            // let auditorInfo = new Contracts.AuditorInfo(wallet, contractAddress);
            // isPermitted = await auditorInfo.isActiveAuditor(wallet.address);
        }
        catch (err) {
            console.log('err', err);
        }
        return isPermitted;
    };
    exports.isActiveAuditor = isActiveAuditor;
    const getAuditInfo = async (commitGuid) => {
        let result;
        try {
            let response = await fetch(`${API_EMBED_URL}/getAuditCommit?commitGuid=${commitGuid}`, {
                method: 'GET'
            });
            const { data } = await response.json();
            result = data;
        }
        catch (err) {
            console.log("[getAuditInfo]");
        }
        return result;
    };
    exports.getAuditInfo = getAuditInfo;
    const getAuditReportInfo = async (commitGuid) => {
        let auditInfo = await getAuditInfo(commitGuid);
        if (auditInfo.auditStatus !== interface_1.PackageStatus.AUDITING)
            return getAuditReportResult(commitGuid, auditInfo);
        let auditReportInfo = {
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
        };
        return auditReportInfo;
    };
    exports.getAuditReportInfo = getAuditReportInfo;
    const getAuditReportResult = async (commitGuid, auditInfo) => {
        if (!auditInfo)
            auditInfo = await getAuditInfo(commitGuid);
        let auditReportResultInfo = {};
        if (auditInfo.ipfsReportCid) {
            let result = await _fetchFileContentByCID(auditInfo.ipfsReportCid);
            auditReportResultInfo = (await result.json());
        }
        let auditReportInfo = {
            ...auditInfo,
            ...auditReportResultInfo,
            ipfsCid: auditInfo.ipfsCid
        };
        return auditReportInfo;
    };
    exports.getAuditReportResult = getAuditReportResult;
    const getAuditPRList = async (packageName) => {
        let result;
        try {
            let response = await fetch(`${API_EMBED_URL}/getAuditPRList?packageName=${packageName}`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[getAuditPRList]");
        }
        return result;
    };
    exports.getAuditPRList = getAuditPRList;
    const auditCommit = async (data) => {
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
        }
        catch (err) {
            console.log("[auditCommit]");
        }
        return result;
    };
    exports.auditCommit = auditCommit;
    const uploadDataToIpfs = async (data, fileName) => {
        try {
            const uploadResult = await components_2.application.uploadData(fileName, data);
            return uploadResult.data?.links?.[0]?.cid;
        }
        catch (err) {
            return '';
        }
    };
    exports.uploadDataToIpfs = uploadDataToIpfs;
    const getAllFiles = async (commitGuid) => {
        let result;
        try {
            const commitInfo = await getAuditInfo(commitGuid);
            if (!commitInfo)
                return { error: 'Cannot fetch commit info' };
            const { auditStatus, ipfsCid, sha, packageOwner, packageName, projectName } = commitInfo;
            let files = [];
            if (auditStatus === interface_1.PackageStatus.AUDIT_PASSED && ipfsCid) {
                const ipfsData = await _fetchFileContentByCID(ipfsCid);
                files = (await ipfsData.json());
            }
            else {
                let response = await fetch(`github/all-files?owner=${packageOwner}&repo=${packageName}&commitId=${sha}`, {
                    method: 'GET'
                });
                const res = await response.json();
                if (!res.data)
                    return { error: 'Cannot fetch commit files' };
                files = res.data;
            }
            result = {
                files,
                projectName,
                packageOwner,
                packageName,
                sha
            };
        }
        catch (err) {
            result = err;
            console.log("[getAllFiles]");
        }
        return result;
    };
    exports.getAllFiles = getAllFiles;
    const getPull = async (owner, repo, prNumber) => {
        let result;
        try {
            let response = await fetch(`${API_URL}/github/pull?owner=${owner}&repo=${repo}&prNumber=${prNumber}`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[getPull]");
        }
        return result;
    };
    exports.getPull = getPull;
    const getAllPulls = async (owner, repo) => {
        let result;
        try {
            let response = await fetch(`${API_URL}/github/all-pulls?owner=${owner}&repo=${repo}`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[getAllPulls]");
        }
        return result;
    };
    exports.getAllPulls = getAllPulls;
    const auditPR = async (packageOwner, packageName, mergeNumber, mergeSHA, ipfsReportCid, ipfsCid, auditStatus) => {
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
            };
            let response = await fetch(`${API_EMBED_URL}/pr/audit`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[auditPR]");
        }
        return result;
    };
    exports.auditPR = auditPR;
    const getAuditPRInfo = async (mergeId) => {
        let result;
        try {
            let response = await fetch(`${API_EMBED_URL}/getAuditPR?mergeId=${mergeId}`, {
                method: 'GET'
            });
            const { data } = await response.json();
            result = data;
        }
        catch (err) {
            console.log("[getAuditPRInfo]");
        }
        return result;
    };
    const getAuditPRReportInfo = async (mergeId) => {
        let auditInfo = await getAuditPRInfo(mergeId);
        if (auditInfo.auditStatus !== interface_1.PackageStatus.AUDITING)
            return getAuditPRReportResult(mergeId, auditInfo);
        let auditReportInfo = {
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
        };
        return auditReportInfo;
    };
    exports.getAuditPRReportInfo = getAuditPRReportInfo;
    const getAuditPRReportResult = async (mergeId, auditInfo) => {
        if (!auditInfo)
            auditInfo = await getAuditPRInfo(mergeId);
        let auditReportResultInfo = {};
        if (auditInfo.ipfsReportCid) {
            let result = await _fetchFileContentByCID(auditInfo.ipfsReportCid);
            auditReportResultInfo = (await result.json());
        }
        let auditReportInfo = {
            ...auditInfo,
            ...auditReportResultInfo,
            ipfsCid: auditInfo.ipfsCid
        };
        return auditReportInfo;
    };
    const auditPackageVersion = async (packageVersionId, pass, reportCid, callback, confirmationCallback) => {
        let receipt;
        let wallet = eth_wallet_2.Wallet.getInstance();
        try {
            let contractAddress = await (0, index_1.getContractAddress)("AuditInfo");
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
        }
        catch (err) {
            if (callback)
                callback(err);
        }
        return receipt;
    };
    exports.auditPackageVersion = auditPackageVersion;
    const createNewPackage = async (projectId, name, ipfsCid, category, callback, confirmationCallback) => {
        let receipt, packageId;
        const wallet = eth_wallet_2.Wallet.getInstance();
        try {
            let contractAddress = await (0, index_1.getContractAddress)("ProjectInfo");
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
        }
        catch (err) {
            if (callback)
                callback(err);
        }
        return { packageId, receipt };
    };
    exports.createNewPackage = createNewPackage;
    const createNewPackageVersion = async (projectId, packageId, version, ipfsCid, callback, confirmationCallback) => {
        let receipt, packageVersionId;
        const wallet = eth_wallet_2.Wallet.getInstance();
        try {
            let contractAddress = await (0, index_1.getContractAddress)("ProjectInfo");
            // let projectInfo = new Contracts.ProjectInfo(wallet, contractAddress);
            // registerSendTxEvents({
            //   transactionHash: callback,
            //   confirmation: confirmationCallback
            // });
            // receipt = await projectInfo.newPackageVersion({ projectId, packageId, version, ipfsCid });
            // packageVersionId = projectInfo.parseNewPackageVersionEvent(receipt)?.[0]?.packageVersionId.toNumber()
        }
        catch (err) {
            if (callback)
                callback(err);
        }
        return { receipt, packageVersionId };
    };
    exports.createNewPackageVersion = createNewPackageVersion;
    const getCommits = async (offset, limit, filter) => {
        try {
            let queries = new URLSearchParams(filter).toString();
            let url = `${API_EMBED_URL}/commits?limit=${limit}&offset=${offset}${queries ? "&" + queries : ""}`;
            let response = await fetch(url, {
                method: 'GET'
            });
            const result = await response.json();
            return result?.data || { total: 0, list: [] };
        }
        catch (err) {
            console.log("[getCommits]");
        }
        return {
            total: 0,
            list: []
        };
    };
    exports.getCommits = getCommits;
    const getMergeMsg = async (guid, repoOwner, repoName) => {
        let result;
        try {
            let response = await fetch(`${API_EMBED_URL}/getPackageMsg?guid=${guid}&repoOwner=${repoOwner}&repoName=${repoName}`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[getMergeMsg]");
        }
        return result;
    };
    exports.getMergeMsg = getMergeMsg;
    const getPackageByNames = async (packageOwner, packageName) => {
        try {
            const url = `${API_EMBED_URL}/getPackageByNames?packageOwner=${packageOwner}&packageName=${packageName}`;
            let response = await fetch(url, {
                method: 'GET'
            });
            const result = await response.json();
            return result?.data;
        }
        catch (err) {
            console.log("[getPackageByNames]");
        }
        return null;
    };
    exports.getPackageByNames = getPackageByNames;
    const mergePR = async (address, signature, owner, repo, prNumber) => {
        let result;
        try {
            let response = await fetch(`${API_URL}/github/merge`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, signature, owner, repo, prNumber })
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[mergePR]");
        }
        return result;
    };
    exports.mergePR = mergePR;
    const requestAuditCommit = async (commitGuid, projectGuid, projectId, packageId, packageVersionId, version, commitId, status) => {
        let result;
        try {
            let body = {
                commitGuid,
                packageId,
                projectId,
                packageVersionId,
                projectGuid,
                owner: eth_wallet_2.Wallet.getClientInstance().address,
                commitId,
                version,
                status: status ? 1 : 0
            };
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
    };
    exports.requestAuditCommit = requestAuditCommit;
    const syncCommits = async (owner, repo) => {
        let result;
        try {
            let response = await fetch(`github/sync-commits?owner=${owner}&repo=${repo}`, {
                method: 'GET'
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[syncCommits]");
        }
        return result;
    };
    exports.syncCommits = syncCommits;
    const updatePackageVersionIpfsCid = async (packageVersionId, packageId, ipfsCid, callback, confirmationCallback) => {
        let receipt;
        const wallet = eth_wallet_2.Wallet.getInstance();
        try {
            let contractAddress = await (0, index_1.getContractAddress)("ProjectInfo");
            // let projectInfo = new Contracts.ProjectInfo(wallet, contractAddress);
            // registerSendTxEvents({
            //   transactionHash: callback,
            //   confirmation: () => confirmationCallback(packageId, projectInfo.parseNewPackageVersionEvent(receipt)[0].packageVersionId || packageVersionId)
            // });
            // receipt = await projectInfo.updatePackageVersionIpfsCid({ packageVersionId, ipfsCid });
        }
        catch (err) {
            if (callback)
                callback(err);
        }
        return receipt;
    };
    exports.updatePackageVersionIpfsCid = updatePackageVersionIpfsCid;
    const updatePackageVersionToAuditing = async (packageVersionId, callback, confirmationCallback) => {
        let receipt;
        let wallet = eth_wallet_2.Wallet.getInstance();
        try {
            let contractAddress = await (0, index_1.getContractAddress)("ProjectInfo");
            // let projectInfo = new Contracts.ProjectInfo(wallet, contractAddress);
            // registerSendTxEvents({
            //   transactionHash: callback,
            //   confirmation: confirmationCallback
            // });
            // receipt = await projectInfo.setPackageVersionToAuditing(packageVersionId);
        }
        catch (err) {
            if (callback)
                callback(err);
        }
        return receipt;
    };
    exports.updatePackageVersionToAuditing = updatePackageVersionToAuditing;
    const createRepo = async (params) => {
        let result;
        try {
            let response = await fetch(`${API_URL}/github/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            result = await response.json();
        }
        catch (err) {
            console.log("[createRepo]");
        }
        return result;
    };
    exports.createRepo = createRepo;
    const getProject = async (guid) => {
        let project;
        try {
            let projectResponse = await fetch(`${API_EMBED_URL}/project?guid=${guid}`);
            let projectResult = await projectResponse.json();
            project = {
                ...projectResult.data
            };
            return project;
        }
        catch (err) {
            console.log("[getMicroDapp] error: ", err);
        }
    };
    exports.getProject = getProject;
});
define("@scom/scom-widget-repos/components/github/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customModalStyle = exports.wrapperStyle = exports.stickyStyle = exports.childTabStyle = exports.tabStyle = exports.inputDateStyle = exports.textareaStyle = exports.inputStyle = exports.modalStyle = exports.spinnerStyle = exports.githubStyle = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    exports.githubStyle = components_3.Styles.style({
        $nest: {
            '.list-repos': {
                borderRadius: '0.35rem',
                border: `1px solid ${Theme.divider}`,
                $nest: {
                    'i-scom-widget-repos--github-repo:not(:last-of-type)': {
                        borderBottom: `1px solid ${Theme.divider}`
                    }
                }
            },
            'i-pagination': {
                $nest: {
                    '.paginate_button': {
                        border: `1px solid ${Theme.divider}`,
                        $nest: {
                            '&.active': {
                                backgroundColor: Theme.colors.primary.main,
                                borderColor: Theme.colors.primary.main,
                                color: Theme.text.primary
                            },
                            '&.disabled': {
                                opacity: 0.8
                            }
                        }
                    }
                }
            },
            '.icon-expansion:hover': {
                borderRadius: '0.35rem',
                background: Theme.action.focus
            },
            '.icon-hover:hover': {
                opacity: 0.85
            },
            '#btnShowPublish.disabled': {
                opacity: 0.85
            }
        }
    });
    const spin = components_3.Styles.keyframes({
        "to": {
            "-webkit-transform": "rotate(360deg)"
        }
    });
    exports.spinnerStyle = components_3.Styles.style({
        display: "inline-block",
        width: "50px",
        height: "50px",
        border: "3px solid rgba(255,255,255,.3)",
        borderRadius: "50%",
        borderTopColor: Theme.colors.primary.main,
        "animation": `${spin} 1s ease-in-out infinite`,
        "-webkit-animation": `${spin} 1s ease-in-out infinite`
    });
    exports.modalStyle = components_3.Styles.style({
        $nest: {
            '.modal': {
                padding: 0,
                borderRadius: 4
            }
        }
    });
    exports.inputStyle = components_3.Styles.style({
        $nest: {
            'input': {
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 0.25rem',
                border: 'none',
                borderTopRightRadius: '0.25rem',
                borderBottomRightRadius: '0.25rem'
            }
        }
    });
    exports.textareaStyle = components_3.Styles.style({
        $nest: {
            'textarea': {
                border: `1px solid ${Theme.divider}`,
                borderRadius: 5,
                outline: 'none',
                padding: '0.5rem 0.75rem',
                fontSize: Theme.typography.fontSize,
                fontFamily: Theme.typography.fontFamily
            },
            '&.disabled': {
                opacity: 1,
                $nest: {
                    'textarea': {
                        background: Theme.action.disabledBackground
                    }
                }
            }
        }
    });
    exports.inputDateStyle = components_3.Styles.style({
        background: Theme.input.background,
        position: 'relative',
        $nest: {
            'input[type="text"]': {
                background: 'transparent',
                height: '40px !important',
                width: '100% !important',
                border: 'none',
                padding: '1rem 0.75rem',
                color: '#fff',
                $nest: {
                    '&::placeholder': {
                        color: '#8d8fa3',
                    },
                }
            },
            '.datepicker-toggle': {
                display: 'flex',
                width: '100% !important',
                height: '100% !important',
                padding: 0,
                position: 'absolute',
                top: 0,
                margin: 0,
                background: 'transparent',
                border: 'none'
            },
            '.datepicker-toggle:hover': {
                background: 'transparent'
            },
            'i-icon': {
                width: '100%',
            },
            'svg': {
                display: 'none',
            }
        }
    });
    exports.tabStyle = components_3.Styles.style({
        gap: '1rem',
        $nest: {
            '> .tabs-nav-wrap': {
                margin: 0,
                position: 'sticky',
                top: 60,
                height: 'fit-content',
                background: Theme.background.main,
                zIndex: 1,
                paddingBottom: '0.5rem',
                $nest: {
                    '.tabs-nav': {
                        border: 0,
                        gap: '0.25rem',
                        width: '100%'
                    },
                    'i-tab': {
                        minWidth: 120,
                        background: 'transparent',
                        border: `1px solid ${Theme.divider} !important`,
                        borderRadius: '0.25rem',
                        color: Theme.text.primary,
                        fontFamily: Theme.typography.fontFamily,
                        fontSize: '0.875rem',
                        marginBottom: 0,
                    },
                    'i-tab:not(.disabled).active': {
                        background: Theme.action.activeBackground,
                        color: Theme.action.hover,
                        fontWeight: 600,
                    },
                    'i-tab:not(.disabled):hover': {
                        background: Theme.action.hoverBackground,
                        color: Theme.action.hover
                    },
                    'i-tab .tab-item': {
                        padding: '0.5rem 0.75rem',
                        margin: 'auto'
                    },
                }
            },
            '> .tabs-content': {
                paddingBottom: '1rem',
                minHeight: '60px',
                overflow: 'visible',
                $nest: {
                    'i-table table': {
                        background: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07));'
                    }
                }
            }
        }
    });
    exports.childTabStyle = components_3.Styles.style({
        gap: '1rem',
        maxHeight: '33rem',
        $nest: {
            '> .tabs-nav-wrap': {
                margin: 0,
                position: 'sticky',
                height: 'fit-content',
                background: Theme.background.main,
                zIndex: 1,
                paddingBottom: '0.5rem',
                $nest: {
                    '.tabs-nav': {
                        border: 0,
                        gap: '0.25rem',
                        width: '100%'
                    },
                    'i-tab': {
                        minWidth: 120,
                        background: 'transparent',
                        border: `1px solid ${Theme.divider} !important`,
                        borderRadius: '0.25rem',
                        color: Theme.text.primary,
                        fontFamily: Theme.typography.fontFamily,
                        fontSize: '0.875rem',
                        marginBottom: 0,
                    },
                    'i-tab:not(.disabled).active': {
                        background: Theme.action.activeBackground,
                        color: Theme.action.hover,
                        fontWeight: 600,
                    },
                    'i-tab:not(.disabled):hover': {
                        background: Theme.action.hoverBackground,
                        color: Theme.action.hover
                    },
                    'i-tab .tab-item': {
                        padding: '0.5rem 0.75rem',
                        margin: 'auto'
                    },
                }
            },
            '> .tabs-content': {
                paddingBottom: '1rem',
                minHeight: '60px',
                maxHeight: '30rem',
                overflow: 'auto',
                $nest: {
                    'i-table table': {
                        background: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07));'
                    }
                }
            }
        }
    });
    exports.stickyStyle = components_3.Styles.style({
        margin: 0,
        position: 'sticky',
        height: 'fit-content',
        background: Theme.background.main,
        zIndex: 1,
        top: 60,
        paddingBottom: '0.5rem',
    });
    exports.wrapperStyle = components_3.Styles.style({
        $nest: {
            'i-table table': {
                background: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07));'
            }
        }
    });
    exports.customModalStyle = components_3.Styles.style({
        $nest: {
            '.modal > div:last-child': {
                height: '100%',
                width: '100%',
                clear: 'both',
                display: 'block',
                position: 'relative'
            },
            '> .modal-wrapper': {
                paddingLeft: '0 !important',
                paddingTop: '0 !important',
                maxHeight: '100%',
                overflow: 'hidden !important'
            }
        }
    });
});
define("@scom/scom-widget-repos/utils/storage.ts", ["require", "exports", "@scom/scom-widget-repos/store/index.ts"], function (require, exports, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getScconfig = exports.getPackage = exports.getPackages = void 0;
    const store = {
        packages: []
    };
    const getPackages = async () => {
        try {
            const response = await fetch(`${(0, index_2.getTransportEndpoint)()}/stat/${(0, index_2.getScomCid)()}`);
            const data = await response.json();
            store.packages = data?.links || [];
        }
        catch (error) {
            console.error(error);
            store.packages = [];
        }
    };
    exports.getPackages = getPackages;
    const getPackageCid = (name) => {
        const finded = store.packages.find(item => item.name === name);
        return finded?.cid;
    };
    const getPackage = async (name) => {
        try {
            const cid = getPackageCid(name);
            if (!cid)
                return;
            const packageJson = await getFileContent(`${cid}/package.json`);
            const packageJsonObj = packageJson ? JSON.parse(packageJson) : {};
            let mainDir = packageJsonObj.plugin || packageJsonObj.browser || packageJsonObj.main;
            if (mainDir.startsWith('./'))
                mainDir = mainDir.slice(2);
            if (mainDir.startsWith('/'))
                mainDir = mainDir.slice(1);
            const mainContent = await getFileContent(`${cid}/${mainDir}`);
            return mainContent;
        }
        catch { }
        return '';
    };
    exports.getPackage = getPackage;
    const getScconfig = async (name) => {
        try {
            const splitted = name.split('/');
            const contractName = splitted[splitted.length - 1];
            const cid = getPackageCid(contractName);
            if (!cid)
                return;
            const scconfigJson = await getFileContent(`${cid}/scconfig.json`);
            return scconfigJson ? JSON.parse(scconfigJson) : null;
        }
        catch { }
        return null;
    };
    exports.getScconfig = getScconfig;
    const getFileContent = async (path) => {
        try {
            if (path.startsWith('/'))
                path = path.slice(1);
            const uri = `${(0, index_2.getTransportEndpoint)()}/ipfs/${path}`;
            const response = await fetch(uri);
            if (response.ok)
                return await response.text();
        }
        catch (error) { }
        return '';
    };
});
define("@scom/scom-widget-repos/utils/schema.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.workerSchemas = exports.getSchema = void 0;
    const getSchema = (scconfig, result) => {
        for (const key in scconfig) {
            const value = scconfig[key];
            if (typeof value === 'object') {
                const childSchema = {
                    "type": "object",
                    "properties": {}
                };
                result.properties[key] = childSchema;
                getSchema(value, result.properties[key]);
            }
            else {
                result.properties[key] = {
                    type: 'string'
                };
            }
            return result;
        }
    };
    exports.getSchema = getSchema;
    const workerSchemas = {
        "schema": {
            "type": "object",
            "properties": {
                "workers": {
                    "type": "object",
                    "description": "Map of worker definitions. The key is the worker name.",
                    "patternProperties": {
                        "^[a-zA-Z0-9_-]+$": {
                            "type": "object",
                            "properties": {
                                "module": {
                                    "type": "string",
                                    "description": "Module path for the worker"
                                },
                                "plugins": {
                                    "type": "object",
                                    "description": "Predefined plugins for the worker",
                                    "properties": {
                                        "cache": {
                                            "type": "boolean"
                                        },
                                        "db": {
                                            "type": "boolean"
                                        },
                                        "wallet": {
                                            "type": "boolean"
                                        },
                                        "fetch": {
                                            "type": "boolean"
                                        }
                                    },
                                    "additionalProperties": false
                                }
                            },
                            "required": ["module", "plugins"]
                        }
                    },
                    "additionalProperties": false
                },
                "scheduler": {
                    "type": "object",
                    "properties": {
                        "params": {
                            "type": "object",
                            "description": "Custom scheduler parameters",
                            "additionalProperties": true
                        },
                        "schedules": {
                            "type": "array",
                            "description": "Array of schedule items",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string",
                                        "description": "Unique identifier for the schedule"
                                    },
                                    "cron": {
                                        "type": "string",
                                        "description": "Cron expression for schedule timing"
                                    },
                                    "worker": {
                                        "type": "string",
                                        "description": "Worker to run (must match a key in workers)"
                                    },
                                    "params": {
                                        "type": "object",
                                        "description": "Custom parameters for the schedule",
                                        "additionalProperties": true
                                    }
                                },
                                "required": ["id", "cron", "worker", "params"]
                            }
                        }
                    },
                    "required": ["schedules"]
                },
                "router": {
                    "type": "object",
                    "properties": {
                        "baseUrl": {
                            "type": "string",
                            "description": "Base URL for the router"
                        },
                        "routes": {
                            "type": "array",
                            "description": "Array of route definitions",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "methods": {
                                        "type": "array",
                                        "description": "HTTP methods allowed for this route",
                                        "items": {
                                            "type": "string",
                                            "enum": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
                                        }
                                    },
                                    "url": {
                                        "type": "string",
                                        "description": "Route URL (path)"
                                    },
                                    "worker": {
                                        "type": "string",
                                        "description": "Worker assigned to this route (must match a key in workers)"
                                    }
                                },
                                "required": ["methods", "url", "worker"]
                            }
                        }
                    },
                    "required": ["routes"]
                }
            },
            "required": ["workers", "scheduler", "router"]
        },
        "uischema": {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Group",
                    "label": "Workers",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/workers",
                            "options": {
                                "detail": {
                                    "type": "VerticalLayout",
                                    "elements": [
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/module"
                                        },
                                        {
                                            "type": "Group",
                                            "label": "Plugins",
                                            "elements": [
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/plugins/properties/cache"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/plugins/properties/db"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/plugins/properties/wallet"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/plugins/properties/fetch"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "Group",
                    "label": "Scheduler",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/scheduler/properties/params",
                            "options": {
                                "multi": true,
                                "format": "json"
                            }
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/scheduler/properties/schedules",
                            "options": {
                                "detail": {
                                    "type": "VerticalLayout",
                                    "elements": [
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/id"
                                        },
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/cron",
                                            "label": "Cron Expression"
                                        },
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/worker",
                                            "options": {
                                                "enum": []
                                                /* This dropdown should be populated with keys from "workers" */
                                            }
                                        },
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/params",
                                            "options": {
                                                "multi": true,
                                                "format": "json"
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "Group",
                    "label": "Router",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/router/properties/baseUrl"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/router/properties/routes",
                            "options": {
                                "detail": {
                                    "type": "VerticalLayout",
                                    "elements": [
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/methods"
                                        },
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/url"
                                        },
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/worker",
                                            "options": {
                                                "enum": []
                                                /* This dropdown should be populated with keys from "workers" */
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        }
    };
    exports.workerSchemas = workerSchemas;
});
define("@scom/scom-widget-repos/utils/index.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-widget-repos/utils/API.ts", "@scom/scom-widget-repos/utils/storage.ts", "@scom/scom-widget-repos/utils/schema.ts"], function (require, exports, components_4, eth_wallet_3, API_1, storage_1, schema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compareVersions = exports.parseContractError = exports.getExplorerTxUrl = exports.getTimeAgo = exports.formatDate = exports.workerSchemas = exports.getSchema = void 0;
    __exportStar(API_1, exports);
    __exportStar(storage_1, exports);
    Object.defineProperty(exports, "getSchema", { enumerable: true, get: function () { return schema_1.getSchema; } });
    Object.defineProperty(exports, "workerSchemas", { enumerable: true, get: function () { return schema_1.workerSchemas; } });
    const formatDate = (date, customType) => {
        const formatType = customType || 'DD/MM/YYYY';
        return (0, components_4.moment)(date).format(formatType);
    };
    exports.formatDate = formatDate;
    const getTimeAgo = (timestamp, i18n) => {
        const currentTime = (0, components_4.moment)();
        const pastTime = (0, components_4.moment)(timestamp);
        const duration = components_4.moment.duration(currentTime.diff(pastTime));
        if (duration.years() > 0) {
            return i18n.get(duration.years() > 1 ? 'years_ago' : 'year_ago', { value: `${duration.years()}` });
        }
        if (duration.months() > 0) {
            return i18n.get(duration.months() > 1 ? 'months_ago' : 'month_ago', { value: `${duration.months()}` });
        }
        if (duration.days() > 0) {
            return i18n.get(duration.days() > 1 ? 'days_ago' : 'day_ago', { value: `${duration.days()}` });
        }
        if (duration.hours() > 0) {
            return i18n.get(duration.hours() > 1 ? 'hours_ago' : 'hour_ago', { value: `${duration.hours()}` });
        }
        if (duration.minutes() > 0) {
            return i18n.get(duration.minutes() > 1 ? 'minutes_ago' : 'minute_ago', { value: `${duration.minutes()}` });
        }
        return i18n.get('just_now');
    };
    exports.getTimeAgo = getTimeAgo;
    const getExplorerTxUrl = (txHash, chainId) => {
        const wallet = eth_wallet_3.Wallet.getInstance();
        let url = "";
        if (!chainId) {
            chainId = wallet.chainId;
        }
        const networkInfo = wallet.getNetworkInfo(chainId);
        if (networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length) {
            const explorerUrl = networkInfo.blockExplorerUrls[0];
            url = explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/${txHash}` : "";
        }
        return url;
    };
    exports.getExplorerTxUrl = getExplorerTxUrl;
    const parseContractError = (message) => {
        if (message.includes('Internal JSON-RPC error.')) {
            message = JSON.parse(message.replace('Internal JSON-RPC error.\n', '')).message;
        }
        const prefixes = ['MetaMask Tx Signature: ', 'execution reverted: '];
        for (const prefix of prefixes) {
            if (message.startsWith(prefix)) {
                message = message.substring(prefix.length);
                break;
            }
        }
        return message;
    };
    exports.parseContractError = parseContractError;
    const compareVersions = (firstVer, secondVer) => {
        const ver1 = firstVer.split('.').map((v) => Number(v));
        const ver2 = secondVer.split('.').map((v) => Number(v));
        if (ver1[0] < ver2[0]) {
            return false;
        }
        if (ver1[0] === ver2[0] && ver1[1] < ver2[1]) {
            return false;
        }
        if (ver1[0] == ver2[0] && ver1[1] == ver2[1] && ver1[2] < ver2[2]) {
            return false;
        }
        return true;
    };
    exports.compareVersions = compareVersions;
});
define("@scom/scom-widget-repos/languages/main.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-widget-repos/languages/main.json.ts'/> 
    exports.default = {
        "en": {
            "create_repository": "Create Repository",
            "day_ago": "{{value}} day ago",
            "days_ago": "{{value}} days ago",
            "failed_to_upload_data_to_ipfs": "Failed to upload data to IPFS.",
            "hour_ago": "{{value}} hour ago",
            "hours_ago": "{{value}} hours ago",
            "just_now": "just now",
            "minute_ago": "{{value}} minute ago",
            "minutes_ago": "{{value}} minutes ago",
            "month_ago": "{{value}} month ago",
            "months_ago": "{{value}} months ago",
            "opened_by": "# {{qty}} opened {{date}} by {{by}}",
            "pull_requests": "Pull Requests",
            "search_repositories": "Search repositories...",
            "transaction_submitted": "Transaction Submitted",
            "year_ago": "{{value}} year ago",
            "years_ago": "{{value}} years ago"
        },
        "zh-hant": {
            "create_repository": "創建存儲庫",
            "day_ago": "{{value}}天前",
            "days_ago": "{{value}}天前",
            "failed_to_upload_data_to_ipfs": "上傳數據到IPFS失敗。",
            "hour_ago": "{{value}}小時前",
            "hours_ago": "{{value}}小時前",
            "just_now": "剛剛",
            "minute_ago": "{{value}}分鐘前",
            "minutes_ago": "{{value}}分鐘前",
            "month_ago": "{{value}}個月前",
            "months_ago": "{{value}}個月前",
            "opened_by": "# {{qty}}由{{by}}於{{date}} 開啟",
            "pull_requests": "拉取請求",
            "search_repositories": "搜索存儲庫...",
            "transaction_submitted": "交易已提交",
            "year_ago": "{{value}}年前",
            "years_ago": "{{value}}年前"
        },
        "vi": {
            "create_repository": "Tạo Kho lưu trữ",
            "day_ago": "{{value}} ngày trước",
            "days_ago": "{{value}} ngày trước",
            "failed_to_upload_data_to_ipfs": "Tải dữ liệu lên IPFS thất bại.",
            "hour_ago": "{{value}} giờ trước",
            "hours_ago": "{{value}} giờ trước",
            "just_now": "gần đây",
            "minute_ago": "{{value}} phút trước",
            "minutes_ago": "{{value}} phút trước",
            "month_ago": "{{value}} tháng trước",
            "months_ago": "{{value}} tháng trước",
            "opened_by": "# {{qty}} được tạo {{date}} bởi {{by}}",
            "pull_requests": "Yêu cầu đóng góp",
            "search_repositories": "Tìm kiếm kho lưu trữ...",
            "transaction_submitted": "Giao dịch đã được gửi đi",
            "year_ago": "{{value}} năm trước",
            "years_ago": "{{value}} năm trước",
        }
    };
});
define("@scom/scom-widget-repos/languages/audit.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-widget-repos/languages/audit.json.ts'/> 
    exports.default = {
        "en": {
            "all": "All",
            "audit_by": "Audit By",
            "audit_checklist": "Audit Checklist",
            "audit_date": "Audit Date",
            "audit_procedure": "Audit Procedure",
            "audit_result": "Audit Result",
            "audit_successfully": "Audit successfully",
            "audit_summary": "Audit Summary",
            "auditing_checklist": "Auditing Checklist",
            "auditing": "Auditing",
            "auditor_comment": "Auditor Comment",
            "back": "Back",
            "by_key": "by",
            "cannot_fetch_pull_request_info": "Cannot fetch pull request info!",
            "checklist_item": "Checklist Item",
            "checklist": "Checklist",
            "comments": "Comments",
            "commit_id_sha": "Commit ID (SHA)",
            "failed_to_audit": "Failed to audit",
            "fill_comment_if_fail": "Fill comment if fail",
            "here": "here",
            "if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline": "If you are first time to go over the checklist, you could find the guideline",
            "invalid_commit_audit_report_not_found": "Invalid commit, audit report not found",
            "ipfs_code_source": "IPFS Code Source",
            "loading": "Loading...",
            "merge_sha": "Merge SHA",
            "next": "Next",
            "not_under_auditing": "Not under auditing",
            "owner": "Owner",
            "package_name": "Package Name",
            "package_owner": "Package Owner",
            "pr_number": "PR Number",
            "project_name": "Project Name",
            "sign_and_submit": "Sign & Submit",
            "submit": "Submit",
            "title": "Title",
            "uploading_audit_report_to_ipfs": "Uploading Audit Report to IPFS",
            "version": "Version",
            "view_code": "View Code",
            "you_are_going_to_audit_the_dapp_checklist": "* You are going to audit the DApp checklist.",
            "you_have_to_add_comment_to_the_failed_checklist_item": "You have to add comment to the failed checklist item"
        },
        "zh-hant": {
            "all": "全部",
            "audit_by": "審核者",
            "audit_checklist": "審核清單",
            "audit_date": "審核日期",
            "audit_procedure": "審核程序",
            "audit_result": "審核結果",
            "audit_successfully": "審核成功",
            "audit_summary": "審核摘要",
            "auditing_checklist": "審核清單",
            "auditing": "審核中",
            "auditor_comment": "審核者評論",
            "back": "返回",
            "by_key": "由",
            "cannot_fetch_pull_request_info": "無法獲取拉取請求信息！",
            "checklist_item": "清單項目",
            "checklist": "清單",
            "comments": "評論",
            "commit_id_sha": "提交 ID (SHA)",
            "failed_to_audit": "審核失敗",
            "fill_comment_if_fail": "如果失敗，填寫評論",
            "here": "這裡",
            "if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline": "如果您是第一次查看清單，您可以找到指南",
            "invalid_commit_audit_report_not_found": "無效的提交，找不到審核報告",
            "ipfs_code_source": "IPFS 代碼源",
            "loading": "加載中...",
            "merge_sha": "合併 SHA",
            "next": "下一步",
            "not_under_auditing": "不在審核中",
            "owner": "擁有者",
            "package_name": "包名",
            "package_owner": "包擁有者",
            "pr_number": "PR 號",
            "project_name": "項目名稱",
            "sign_and_submit": "簽名並提交",
            "submit": "提交",
            "title": "標題",
            "uploading_audit_report_to_ipfs": "正在上傳審核報告到 IPFS",
            "version": "版本",
            "view_code": "查看代碼",
            "you_are_going_to_audit_the_dapp_checklist": "* 您將審核 DApp 清單。",
            "you_have_to_add_comment_to_the_failed_checklist_item": "您必須對失敗的清單項目添加評論"
        },
        "vi": {
            "all": "Tất cả",
            "audit_by": "Kiểm tra bởi",
            "audit_checklist": "Danh sách kiểm tra",
            "audit_date": "Ngày kiểm tra",
            "audit_procedure": "Hành vi kiểm tra",
            "audit_result": "Kết quả kiểm tra",
            "audit_successfully": "Đã kiểm tra thành công",
            "audit_summary": "Tóm tắt kiểm tra",
            "auditing_checklist": "Danh sách kiểm tra",
            "auditing": "Đang kiểm tra",
            "auditor_comment": "Bình luận kiểm tra",
            "back": "Quay lại",
            "by_key": "bởi",
            "cannot_fetch_pull_request_info": "Không thể lấy thông tin pull request!",
            "checklist_item": "Mục danh sách kiểm tra",
            "checklist": "Danh sách kiểm tra",
            "comments": "Bình luận",
            "commit_id_sha": "Commit ID (SHA)",
            "failed_to_audit": "Không thể kiểm tra",
            "failed_to_upload_data_to_ipfs": "Tải dữ liệu lên IPFS thất bại",
            "fill_comment_if_fail": "Điền bình luận nếu thất bại",
            "here": "ở đây",
            "if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline": "Nếu bạn là người đầu tiên để xem qua danh sách, bạn có thể tìm thấy hướng dẫn",
            "invalid_commit_audit_report_not_found": "Báo cáo kiểm tra không hợp lệ, báo cáo không tìm thấy",
            "ipfs_code_source": "Mã nguồn IPFS",
            "loading": "Đang tải...",
            "merge_sha": "Merge SHA",
            "next": "Tiếp theo",
            "not_under_auditing": "Không ở chế độ kiểm tra",
            "owner": "Chủ sở hữu",
            "package_name": "Tên gói",
            "package_owner": "Chủ sở hữu gói",
            "pr_number": "Số PR",
            "project_name": "Tên dự án",
            "sign_and_submit": "Ký và gửi",
            "submit": "Gửi",
            "title": "Tiêu đề",
            "transaction_submitted": "Giao dịch đã được gửi",
            "uploading_audit_report_to_ipfs": "Đang tải lên báo cáo kiểm tra lên IPFS",
            "version": "Phiên bản",
            "view_code": "Xem mã",
            "you_are_going_to_audit_the_dapp_checklist": "* Bạn sắp có muốn kiểm tra danh sách ứng dụng.",
            "you_have_to_add_comment_to_the_failed_checklist_item": "Bạn phải thêm bình luận vào mục danh sách kiểm tra thất bại"
        }
    };
});
define("@scom/scom-widget-repos/languages/repo.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-widget-repos/languages/repo.json.ts'/> 
    exports.default = {
        "en": {
            "all": "All",
            "are_you_sure_you_want_to_merge": "Are you sure you want to merge #${prNumber} in ${repo}?",
            "audit_failed": "Audit Failed",
            "audit_passed": "Audit Passed",
            "audit_report": "Audit Report",
            "branch": "Branch:",
            "cannot_submit_an_old_version": "Cannot submit an old version",
            "clear": "Clear",
            "commit_id_sha": "Commit ID (SHA):",
            "commit_id": "Commit ID",
            "commits": "Commits",
            "committed": "committed",
            "confirm": "Confirm",
            "create_new_repository": "Create new repository",
            "description": "Description",
            "edit": "Edit",
            "end_date": "End Date",
            "end_time_cannot_be_earlier_than_start_time": "End time cannot be earlier than start time",
            "error": "Error",
            "failed_review": "Failed Review",
            "failed_to_create_your_repository": "Failed to create your repository.",
            "failed_to_get_message": "Failed to get message",
            "failed_to_merge": "Failed to merge",
            "failed_to_submit": "Failed to submit",
            "failed_to_upload_data_to_ipfs": "Failed to upload data to IPFS",
            "merge_pull_request": "Merge pull request",
            "merge": "Merge",
            "merged_successfully": "Merged successfully",
            "merged": "Merged",
            "merging...": "Merging...",
            "merging": "Merging",
            "passed_review": "Passed Review",
            "pending_audit": "Pending Audit",
            "pending_review": "Pending Review",
            "please_add_a_prefix_to_the_project_first": "Please add a prefix to the project first.",
            "please_login_to_create_your_repository": "Please login to create your repository",
            "prs": "PRs",
            "publish": "Publish",
            "repositories": "repositories",
            "repository_name_is_required": "Repository name is required.",
            "repository_name": "Repository name",
            "repository": "repository",
            "review": "Review",
            "search": "Search",
            "show_only_PRs": "Show only PRs",
            "start_date": "Start Date",
            "start_time_cannot_be_earlier_than_end_time": "Start time cannot be earlier than end time",
            "submit_for_audit": "Submit for Audit",
            "submitted_successfully": "Submitted successfully",
            "submitting": "Submitting",
            "success": "Success",
            "sync": "Sync",
            "there_is_no_commit": "There is no commit",
            "there_is_no_pull_request": "There is no pull request",
            "there_is_no_repository": "There is no repository!",
            "this_pr_has_been_audited_with_failed_status": "This PR has been audited with failed status.",
            "this_pr_is_not_reviewed_by_the_auditor_yet": "This PR is not reviewed by the auditor yet.",
            "this_version_has_already_been_submitted": "This version has already been submitted",
            "title": "Title",
            "updated": "Updated {{date}}",
            "version": "Version:",
            "view_record": "View Record",
            "your_repository_has_been_created_successfully": "Your repository has been created successfully.",
            "deploy": "Deploy",
            "view": "View",
            "verify": "Verify",
            'enclave': 'Enclave',
            'enclave_verification_successful': 'Enclave verification successful',
            'enclave_verification_failed': 'Enclave verification failed'
        },
        "zh-hant": {
            "all": "全部",
            "are_you_sure_you_want_to_merge": "您確定要將＃${prNumber}合併到${repo}嗎？",
            "audit_failed": "審核失敗",
            "audit_passed": "審核通過",
            "audit_report": "審核報告",
            "branch": "分支：",
            "cannot_submit_an_old_version": "無法提交舊版本",
            "clear": "清除",
            "commit_id_sha": "提交 ID (SHA)：",
            "commit_id": "提交 ID",
            "commits": "提交",
            "committed": "已提交",
            "confirm": "確認",
            "create_new_repository": "創建新存儲庫",
            "description": "描述",
            "edit": "編輯",
            "end_date": "結束日期",
            "end_time_cannot_be_earlier_than_start_time": "結束時間不能早於開始時間",
            "error": "錯誤",
            "failed_review": "審核失敗",
            "failed_to_create_your_repository": "無法創建您的存儲庫。",
            "failed_to_get_message": "無法獲取消息",
            "failed_to_merge": "無法合併",
            "failed_to_submit": "無法提交",
            "failed_to_upload_data_to_ipfs": "上傳數據到IPFS失敗",
            "merge_pull_request": "合併拉取請求",
            "merge": "合併",
            "merged_successfully": "合併成功",
            "merged": "已合併",
            "merging...": "正在合併...",
            "merging": "正在合併",
            "passed_review": "審核通過",
            "pending_audit": "待審核",
            "pending_review": "待審查",
            "please_add_a_prefix_to_the_project_first": "請先為項目添加前綴。",
            "please_login_to_create_your_repository": "請登錄以創建您的存儲庫",
            "prs": "PRs",
            "publish": "發布",
            "repositories": "存儲庫",
            "repository_name_is_required": "存儲庫名稱是必需的。",
            "repository_name": "存儲庫名稱",
            "repository": "存儲庫",
            "review": "審核",
            "search": "搜索",
            "show_only_PRs": "僅顯示 PRs",
            "start_date": "開始日期",
            "start_time_cannot_be_earlier_than_end_time": "開始時間不能早於結束時間",
            "submit_for_audit": "提交審核",
            "submitted_successfully": "提交成功",
            "submitting": "正在提交",
            "success": "成功",
            "sync": "同步",
            "there_is_no_commit": "沒有提交",
            "there_is_no_pull_request": "沒有拉取請求",
            "there_is_no_repository": "沒有存儲庫！",
            "this_pr_has_been_audited_with_failed_status": "此 PR 已通過失敗狀態審核。",
            "this_pr_is_not_reviewed_by_the_auditor_yet": "此 PR 尚未由審核員審查。",
            "this_version_has_already_been_submitted": "此版本已提交",
            "title": "標題",
            "updated": "已更新{{date}}",
            "version": "版本：",
            "view_record": "查看記錄",
            "your_repository_has_been_created_successfully": "您的存儲庫已成功創建。",
            "deploy": "部署",
            "view": "查看",
            "verify": "驗證",
            'enclave': '飛地',
            'enclave_verification_successful': '飛地驗證成功',
            'enclave_verification_failed': '飛地驗證失敗'
        },
        "vi": {
            "all": "Tất cả",
            "are_you_sure_you_want_to_merge": "Bạn có chắc chắn muốn gộp #${prNumber} vào ${repo}?",
            "audit_failed": "Kiểm tra chưa đạt",
            "audit_passed": "Kiểm tra đạt",
            "audit_report": "Báo cáo kiểm tra",
            "branch": "Đường:",
            "cannot_submit_an_old_version": "Không thể gửi phiên bản cũ",
            "clear": "Xóa",
            "commit_id_sha": "Commit ID (SHA):",
            "commit_id": "Commit ID",
            "commits": "Commits",
            "committed": "đã được commit",
            "confirm": "Xác nhận",
            "create_new_repository": "Tạo Kho lưu trữ mới",
            "description": "Mô tả",
            "edit": "Chỉnh sửa",
            "end_date": "Ngày kết thúc",
            "end_time_cannot_be_earlier_than_start_time": "Thời gian kết thúc không thể sớm hơn thời gian bắt đầu",
            "error": "Lỗi",
            "failed_review": "Đánh giá chưa đạt",
            "failed_to_create_your_repository": "Không thể tạo kho lưu trữ của bạn.",
            "failed_to_get_message": "Không thể lấy thông điệp",
            "failed_to_merge": "Không thể gộp",
            "failed_to_submit": "Không thể gửi",
            "failed_to_upload_data_to_ipfs": "Tải dữ liệu lên IPFS thất bại",
            "merge_pull_request": "Gộp Pull request",
            "merge": "Gộp",
            "merged_successfully": "Đã gộp thành công",
            "merged": "Đã gộp",
            "merging...": "Đang gộp...",
            "merging": "Đang gộp",
            "passed_review": "Đánh giá đạt",
            "pending_audit": "Đang kiểm tra",
            "pending_review": "Đang đánh giá",
            "please_add_a_prefix_to_the_project_first": "Vui lòng thêm tiền tố cho tên dự án.",
            "please_login_to_create_your_repository": "Vui lòng đăng nhập để tạo kho lưu trữ",
            "prs": "PRs",
            "publish": "Xuất bản",
            "repositories": "kho lưu trữ",
            "repository_name_is_required": "Tên kho lưu trữ là bắt buộc.",
            "repository_name": "Tên Kho lưu trữ",
            "repository": "kho lưu trữ",
            "review": "Đánh giá",
            "search": "Tìm kiếm",
            "show_only_PRs": "Chỉ hiển thị PRs",
            "start_date": "Ngày bắt đầu",
            "start_time_cannot_be_earlier_than_end_time": "Thời gian bắt đầu không thể sớm hơn thời gian kết thúc",
            "submit_for_audit": "Gửi để kiểm tra",
            "submitted_successfully": "Đã gửi thành công",
            "submitting": "Đang gửi",
            "success": "Thành công",
            "sync": "Đồng bộ",
            "there_is_no_commit": "Không có commit nào",
            "there_is_no_pull_request": "Không có pull request nào",
            "there_is_no_repository": "Không có dữ liệu!",
            "this_pr_has_been_audited_with_failed_status": "PR này chưa thông qua kiểm tra.",
            "this_pr_is_not_reviewed_by_the_auditor_yet": "PR này chưa được đánh giá bởi người đánh giá.",
            "this_version_has_already_been_submitted": "Phiên bản này đã được gửi",
            "title": "Tiêu đề",
            "updated": "Đã cập nhật {{date}}",
            "version": "Phiên bản:",
            "view_record": "Xem bản ghi",
            "your_repository_has_been_created_successfully": "Kho lưu trữ của bạn đã được tạo thành công.",
            "deploy": "Phát hành",
            "view": "Xem",
            "verify": "Xác minh",
            'enclave': 'Enclave',
            'enclave_verification_successful': 'Xác minh Enclave thành công',
            'enclave_verification_failed': 'Xác minh Enclave thất bại'
        }
    };
});
define("@scom/scom-widget-repos/languages/index.ts", ["require", "exports", "@scom/scom-widget-repos/languages/main.json.ts", "@scom/scom-widget-repos/languages/audit.json.ts", "@scom/scom-widget-repos/languages/repo.json.ts"], function (require, exports, main_json_1, audit_json_1, repo_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.repoJson = exports.auditJson = exports.mainJson = void 0;
    exports.mainJson = main_json_1.default;
    exports.auditJson = audit_json_1.default;
    exports.repoJson = repo_json_1.default;
});
define("@scom/scom-widget-repos/components/github/repo.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-widget-repos/utils/index.ts", "@scom/scom-widget-repos/components/github/index.css.ts", "@scom/scom-widget-repos/interface.ts", "@ijstech/eth-wallet", "@scom/scom-widget-repos/languages/index.ts"], function (require, exports, components_5, index_3, index_css_1, interface_2, eth_wallet_4, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetReposGithubRepo = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomWidgetReposGithubRepo = class ScomWidgetReposGithubRepo extends components_5.Module {
        set guid(value) {
            this._guid = value;
        }
        get guid() {
            return this._guid;
        }
        set projectId(value) {
            this._projectId = value;
        }
        get projectId() {
            return this._projectId;
        }
        set isProject(value) {
            this._isProject = value;
        }
        get isProject() {
            return this._isProject;
        }
        set isProjectOwner(value) {
            this._isProjectOwner = value;
        }
        get isProjectOwner() {
            return this._isProjectOwner;
        }
        set isGithubOwner(value) {
            this._isGithubOwner = value;
        }
        get isGithubOwner() {
            return this._isGithubOwner;
        }
        set data(value) {
            this._data = value;
            this.renderUI();
        }
        get data() {
            return this._data || {};
        }
        get isAuditPR() {
            return this._isAuditPR;
        }
        set isAuditPR(value) {
            this._isAuditPR = value;
        }
        constructor(parent, options) {
            super(parent, options);
            // private lastCommitId: string;
            this.listPR = [];
            this.isDetailShown = false;
            this.listAuditPr = [];
            this.listTimer = [];
            this.commits = [];
            this.totalCommits = 0;
            this.activeTab = 'prs';
        }
        setMessage(message) {
            const { status, content, title, link, onClose, onConfirm } = message;
            if (title !== undefined)
                this.mdAlert.title = title;
            if (content !== undefined)
                this.mdAlert.content = content;
            if (status !== undefined)
                this.mdAlert.status = status;
            if (link)
                this.mdAlert.link = link;
            if (typeof onClose === 'function')
                this.mdAlert.onClose = onClose;
            if (typeof onConfirm === 'function')
                this.mdAlert.onConfirm = onConfirm;
        }
        async renderUI() {
            if (!this.isInitialized || !this.data)
                return;
            const { name, owner_login, open_issues, html_url, pushed_at, full_name, version, type } = this.data;
            // TODO: get package info
            // this.packageInfo = await getPackageByNames(owner_login, name);
            this.lblType.caption = type;
            this.lbName.caption = name;
            this.lbPublish.caption = this.i18n.get('$publish', { name, repo: full_name });
            this.lbPath.caption = full_name;
            this.lbVersion.caption = version || '-';
            const hasPR = open_issues > 0;
            this.lbCount.caption = `${open_issues}`;
            this.lbCount.background = { color: hasPR ? Theme.colors.primary.main : Theme.colors.info.main };
            this.hStackCount.cursor = hasPR ? 'pointer' : 'default';
            this.hStackCount.onClick = () => hasPR ? this.onShowDetail() : {};
            this.hStackLink.onClick = () => this.openLink(html_url);
            this.lbPushedAt.caption = this.i18n.get('$updated', { date: (0, index_3.getTimeAgo)(pushed_at, this.i18n) });
            if (this.timer)
                clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.lbPushedAt.caption = this.i18n.get('$updated', { date: (0, index_3.getTimeAgo)(pushed_at, this.i18n) });
            }, 60000);
            this.customTabs.setData({
                items: [
                    { caption: this.i18n.get('$prs'), tag: 'prs', count: open_issues, hasCount: true },
                    // { caption: this.i18n.get('$commits'), tag: 'commits', count: 0, hasCount: false }
                ]
            });
            // this.btnDeployer.enabled = type && ['contract', 'agent'].includes(type);
            this.btnDeployer.enabled = true;
        }
        clearListTimer() {
            for (const item of this.listTimer) {
                clearInterval(item);
            }
            this.listTimer = [];
        }
        renderListPR() {
            this.lbCount.caption = `${this.listPR.length}`;
            const hasPR = this.listPR.length > 0;
            this.lbCount.background = { color: hasPR ? Theme.colors.primary.main : Theme.colors.info.main };
            this.hStackCount.cursor = hasPR ? 'pointer' : 'default';
            this.hStackCount.onClick = () => hasPR ? this.onShowDetail() : {};
            this.clearListTimer();
            let nodeItems = [];
            for (const pr of this.listPR) {
                const { mergeId, html_url, number, title, created_at, user_login, base, status } = pr;
                const lbTimer = new components_5.Label(undefined, {
                    caption: this.i18n.get('$opened_by', {
                        qty: `${number}`,
                        date: (0, index_3.getTimeAgo)(created_at, this.i18n),
                        by: user_login
                    }),
                    font: { size: '0.75rem' },
                    opacity: 0.8
                });
                const interval = setInterval(() => {
                    lbTimer.caption = this.i18n.get('$opened_by', {
                        qty: `${number}`,
                        date: (0, index_3.getTimeAgo)(created_at, this.i18n),
                        by: user_login
                    });
                }, 60000);
                this.listTimer.push(interval);
                nodeItems.push(this.$render("i-hstack", { gap: "0.625rem", margin: { bottom: '1rem' }, padding: { top: '0.75rem', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }, background: { color: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))' }, boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)", border: { radius: '0.375rem' }, verticalAlignment: "center", horizontalAlignment: "space-between" },
                    this.$render("i-vstack", { gap: "0.5rem", verticalAlignment: "center", maxWidth: "calc(100% - 200px)" },
                        this.$render("i-hstack", { gap: "0.5rem" },
                            this.$render("i-label", { caption: title, wordBreak: "break-word", font: { size: '0.8  75rem', bold: true } }),
                            this.$render("i-icon", { name: "external-link-alt", class: "icon-hover", cursor: "pointer", width: "0.9rem", height: "0.9rem", onClick: () => this.openLink(html_url) })),
                        lbTimer),
                    this.$render("i-hstack", { gap: "1rem", verticalAlignment: "center" },
                        this.$render("i-label", { caption: this.getStatusText(status, true), font: { size: '0.875rem' }, background: { color: this.getStatusColor(status) }, border: { radius: '1rem' }, padding: { left: '0.625rem', right: '0.625rem', top: '0.3125rem', bottom: '0.3125rem' }, minWidth: '5.5rem', class: "text-center" }),
                        status !== interface_2.PackageStatus.AUDITING ? this.$render("i-button", { caption: "$view_record", background: { color: '#212128' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, rightIcon: { spin: true, visible: false }, onClick: () => this.onViewRecord(mergeId, base.base_login, base.base_name, number) }) : [],
                        this.isAuditPR && status === interface_2.PackageStatus.AUDITING ? this.$render("i-button", { caption: '$review', padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, rightIcon: { spin: true, visible: false }, onClick: () => this.onAuditPR(base.base_login, base.base_name, number) }) : [],
                        this.isGithubOwner || this.isProjectOwner ? this.$render("i-button", { caption: '$merge', padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, rightIcon: { spin: true, visible: false }, onClick: (btn) => this.onMergePR(btn, base.base_login, base.base_name, number, status) }) : [])));
            }
            if (!nodeItems.length) {
                nodeItems.push(this.$render("i-hstack", { gap: "0.625rem", margin: { bottom: '1rem' }, padding: { top: '0.75rem', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }, background: { color: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))' }, boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)", border: { radius: '0.375rem' }, verticalAlignment: "center", horizontalAlignment: "center" },
                    this.$render("i-label", { caption: "$there_is_no_pull_request" })));
            }
            this.vStackListPR.clearInnerHTML();
            this.vStackListPR.append(...nodeItems);
        }
        getStatusMessage(status, prNumber, repo) {
            let text = this.i18n.get('$are_you_sure_you_want_to_merge', { prNumber: `${prNumber}`, repo });
            if (!this.guid)
                return text;
            switch (status) {
                case interface_2.PackageStatus.AUDITING:
                    text = `<span style="color: ${Theme.colors.warning.main}">${this.i18n.get('$this_pr_is_not_reviewed_by_the_auditor_yet')} ${text}</span>`;
                    break;
                case interface_2.PackageStatus.AUDIT_FAILED:
                    text = `<span style="color: ${Theme.colors.error.main}">${this.i18n.get('$this_pr_has_been_audited_with_failed_status')} ${text}</span>`;
                    break;
            }
            return text;
        }
        getStatusColor(status) {
            let color;
            if (!status)
                return Theme.colors.warning.main;
            switch (status) {
                case interface_2.PackageStatus.AUDIT_PASSED: {
                    color = Theme.colors.success.main;
                    break;
                }
                case interface_2.PackageStatus.AUDITING: {
                    color = Theme.colors.warning.main;
                    break;
                }
                case interface_2.PackageStatus.AUDIT_FAILED: {
                    color = Theme.colors.error.main;
                    break;
                }
            }
            return color;
        }
        getStatusText(status, isPR, isDefault) {
            let text = '';
            switch (status) {
                case interface_2.PackageStatus.AUDITING:
                    text = isPR ? "$pending_review" : "$pending_audit";
                    break;
                case interface_2.PackageStatus.AUDIT_PASSED:
                    if (isDefault)
                        return "$submit_for_audit";
                    text = isPR ? "$passed_review" : "$audit_passed";
                    break;
                case interface_2.PackageStatus.AUDIT_FAILED:
                    if (isDefault)
                        return "$submit_for_audit";
                    text = isPR ? "$failed_review" : "$audit_failed";
                    break;
                default:
                    text = isPR ? "$pending_review" : "$submit_for_audit";
            }
            return text;
        }
        // private onStartDateChanged = (elm: Datepicker) => {
        //   const value = elm?.value;
        //   const inputEndDate = this.inputEndDate.querySelector('input[type="datetime-local"]') as HTMLInputElement;
        //   this.lbStartDateErr.caption = '';
        //   this.lbEndDateErr.caption = '';
        //   if (inputEndDate) {
        //     if (value) {
        //       const date = moment(value, 'DD/MM/YYYY HH:mm');
        //       const val = date;
        //       inputEndDate.min = val.format('YYYY-MM-DD HH:mm');
        //       if (this.inputEndDate.value?.isBefore(val)) {
        //         this.lbStartDateErr.caption = '$start_time_cannot_be_earlier_than_end_time';
        //       }
        //     } else {
        //       inputEndDate.min = undefined;
        //     }
        //   }
        // }
        // private onEndDateChanged = (elm: Datepicker) => {
        //   const value = elm?.value;
        //   const inputStartDate = this.inputStartDate.querySelector('input[type="datetime-local"]') as HTMLInputElement;
        //   this.lbStartDateErr.caption = '';
        //   this.lbEndDateErr.caption = '';
        //   if (inputStartDate) {
        //     if (value) {
        //       const date = moment(value, 'DD/MM/YYYY HH:mm');
        //       const val = date;
        //       inputStartDate.max = val.format('YYYY-MM-DD HH:mm');
        //       if (this.inputStartDate.value?.isAfter(value)) {
        //         this.lbEndDateErr.caption = '$end_time_cannot_be_earlier_than_start_time';
        //       }
        //     } else {
        //       inputStartDate.max = moment().format('YYYY-MM-DD HH:mm');
        //     }
        //   }
        // }
        // private initInputDate() {
        //   const inputStartDate = this.inputStartDate.querySelector('input[type="datetime-local"]') as HTMLInputElement;
        //   const inputEndDate = this.inputEndDate.querySelector('input[type="datetime-local"]') as HTMLInputElement;
        //   if (inputStartDate) inputStartDate.max = moment().format('YYYY-MM-DD HH:mm');
        //   if (inputEndDate) inputEndDate.max = moment().format('YYYY-MM-DD HH:mm');
        // }
        // private onClearSearch() {
        //   this.inputCommitId.value = '';
        //   this.inputMessage.value = '';
        //   this.inputStartDate.value = undefined;
        //   this.inputEndDate.value = undefined;
        //   this.onStartDateChanged(undefined);
        //   this.onEndDateChanged(undefined);
        // }
        // private async onSyncCommits() {
        //   await this.onRefreshData(true);
        //   if (!this.packageInfo) {
        //     const { name, owner_login } = this.data;
        //     this.packageInfo = await getPackageByNames(owner_login, name);
        //   }
        //   await this.onSearchCommits();
        // }
        // private async onSearchCommits() {
        //   this.btnSync.enabled = false;
        //   this.btnSearch.enabled = false;
        //   this.btnClear.enabled = false;
        //   this.pagiCommitList.currentPage = 1;
        //   await this.getCommits();
        //   this.btnSync.enabled = true;
        //   this.btnSearch.enabled = true;
        //   this.btnClear.enabled = true;
        // }
        async getCommits() {
            // if (!this.packageInfo) return;
            // const packageGuid = this.packageInfo.guid;
            // const filter = {
            //   packageGuid,
            //   commitId: this.inputCommitId.value,
            //   message: this.inputMessage.value,
            //   startDate: this.inputStartDate.value?.format('YYYY-MM-DDTHH:mm:ss\\Z') || '',
            //   endDate: this.inputEndDate.value?.format('YYYY-MM-DDTHH:mm:ss\\Z') || ''
            // }
            // const currentPage = this.pagiCommitList.currentPage;
            // const { list, total } = await getCommits(currentPage, this.pageSize, filter);
            // this.commits = list;
            // this.totalCommits = total;
            // this.pagiCommitList.visible = total > 0;
            // this.pagiCommitList.totalPages = Math.ceil(total / this.pageSize) || 1;
            // this.renderCommits();
        }
        async getAllPRs() {
            const { name, owner_login } = this.data;
            const result = await (0, index_3.getAllPulls)(owner_login, name);
            if (result?.data) {
                const resultPRList = await (0, index_3.getAuditPRList)(name);
                if (resultPRList?.data) {
                    this.listAuditPr = resultPRList.data;
                }
                this.listPR = result.data.map((v) => {
                    const { commit_sha, number } = v;
                    const auditPr = this.listAuditPr.find(f => f.mergeSHA === commit_sha && f.mergeNumber === number);
                    return {
                        ...v,
                        mergeId: auditPr?.mergeId,
                        status: auditPr?.auditStatus || interface_2.PackageStatus.AUDITING
                    };
                });
            }
            else {
                this.listPR = [];
            }
        }
        async onShowDetail() {
            this.isDetailShown = !this.isDetailShown;
            this.iconDetail.name = this.isDetailShown ? 'angle-up' : 'angle-down';
            this.tabs.visible = this.isDetailShown;
            if (!this.isDetailShown)
                return;
            if (!this.totalCommits) {
                await this.getCommits();
            }
            await this.refreshPR(this.listPR.length > 0);
        }
        async onRefreshData(commit) {
            this.iconRefresh.enabled = false;
            this.iconDetail.enabled = false;
            const { name, owner_login } = this.data;
            await (0, index_3.syncCommits)(owner_login, name);
            if (!commit)
                await this.refreshPR();
            this.iconRefresh.enabled = true;
            this.iconDetail.enabled = true;
        }
        async refreshPR(hasData) {
            // this.lastCommitId = '';
            this.iconRefresh.enabled = false;
            this.iconDetail.enabled = false;
            if (!hasData)
                await this.getAllPRs();
            this.renderListPR();
            this.iconRefresh.enabled = true;
            this.iconDetail.enabled = true;
        }
        // private renderCommits() {
        //   this.customTabs.updateCount('commits', this.totalCommits);
        //   let nodeItems: HTMLElement[] = [];
        //   const { guid } = this.packageInfo;
        //   for (const commit of this.commits) {
        //     const { committer, message, sha, url, version, date, auditStatus } = commit;
        //     nodeItems.push(<i-hstack
        //       gap="0.625rem"
        //       margin={{ bottom: '1rem' }}
        //       padding={{ top: '0.75rem', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}
        //       background={{ color: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))' }}
        //       boxShadow="0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)"
        //       border={{ radius: '0.375rem' }}
        //       verticalAlignment="center"
        //       horizontalAlignment="space-between"
        //     >
        //       <i-vstack gap="0.5rem" verticalAlignment="center" maxWidth="calc(100% - 200px)">
        //         <i-hstack gap="0.5rem">
        //           <i-label caption={message} wordBreak="break-word" font={{ size: '0.875rem', bold: true }} />
        //           <i-icon name="external-link-alt" class="icon-hover" cursor="pointer" width="0.9rem" height="0.9rem" onClick={() => this.openLink(url)} />
        //         </i-hstack>
        //         <i-label caption={`${this.i18n.get('$version')} ${version || '-'}`} font={{ size: '0.875rem' }} />
        //         <i-label caption={`${committer} ${this.i18n.get('$committed')} ${getTimeAgo(date, this.i18n)}`} font={{ size: '0.75rem' }} opacity={0.8} />
        //       </i-vstack>
        //       <i-hstack gap="1rem" verticalAlignment="center" wrap="wrap">
        //         {auditStatus ? <i-label
        //           caption={this.getStatusText(auditStatus)}
        //           font={{ size: '0.875rem' }}
        //           background={{ color: this.getStatusColor(auditStatus) }}
        //           border={{ radius: '1rem' }}
        //           padding={{ left: '0.625rem', right: '0.625rem', top: '0.3125rem', bottom: '0.3125rem' }}
        //           minWidth={'5.5rem'}
        //           class="text-center"
        //         /> : []}
        //         {auditStatus && auditStatus !== PackageStatus.AUDITING ? <i-button
        //           caption="$view_record"
        //           background={{ color: '#212128' }}
        //           padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }}
        //           rightIcon={{ spin: true, visible: false }}
        //           onClick={() => this.onViewCommitRecord(commit.guid)}
        //         /> : []}
        //         {this.isAuditPR && auditStatus === PackageStatus.AUDITING ? <i-button
        //           caption={'$audit'}
        //           padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }}
        //           rightIcon={{ spin: true, visible: false }}
        //           onClick={() => this.onAuditCommit(commit.guid)}
        //         /> : []}
        //         {this.isProject && this.isProjectOwner && !auditStatus ? <i-button
        //           id={`btn-${sha}`}
        //           caption={'$submit_for_audit'}
        //           padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }}
        //           rightIcon={{ spin: true, visible: false }}
        //           onClick={() => this.onShowRequestAudit(commit.guid, guid, sha, version)}
        //         /> : []}
        //         {this.isProject && this.isProjectOwner && auditStatus === PackageStatus.AUDIT_PASSED ? <i-button
        //           caption={'$publish'}
        //           padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }}
        //           onClick={() => this.onPublish(commit.guid)}
        //         /> : []}
        //       </i-hstack>
        //     </i-hstack>);
        //   }
        //   if (!nodeItems.length) {
        //     nodeItems.push(<i-hstack
        //       gap="0.625rem"
        //       margin={{ bottom: '1rem' }}
        //       padding={{ top: '0.75rem', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}
        //       background={{ color: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))' }}
        //       boxShadow="0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)"
        //       border={{ radius: '0.375rem' }}
        //       verticalAlignment="center"
        //       horizontalAlignment="center"
        //     >
        //       <i-label caption="$there_is_no_commit" />
        //     </i-hstack>)
        //   }
        //   this.vStackListCommit.clearInnerHTML();
        //   this.vStackListCommit.append(...nodeItems);
        // }
        // private onViewCommitRecord(guid: string) {
        //   this.viewReportModal.visible = true;
        //   this.auditReport.prInfo = undefined;
        //   this.auditReport.commitGuid = guid;
        //   this.auditReport.scrollTop = 0;
        // }
        onViewRecord(mergeId, owner, repo, prNumber) {
            this.viewReportModal.visible = true;
            this.auditReport.commitGuid = undefined;
            this.auditReport.prInfo = { mergeId, owner, repo, prNumber };
            this.auditReport.scrollTop = 0;
        }
        // private async onAuditCommit(guid: string) {
        //   let queries = new URLSearchParams({ guid }).toString();
        //   window.location.href = `#/audit-commit-form?${queries}`;
        // }
        async onAuditPR(owner, repo, prNumber) {
            let queries = new URLSearchParams({ owner, repo, prNumber }).toString();
            window.location.href = `#/review-pr-form?${queries}`;
        }
        async onMergePR(button, owner, repo, prNumber, status) {
            if (status === interface_2.PackageStatus.AUDITING) {
                this.mergeOnePR(button, owner, repo, prNumber);
            }
            else {
                this.setMessage({
                    status: 'confirm',
                    title: '$merge_pull_request',
                    content: this.getStatusMessage(status, prNumber, repo),
                    onConfirm: () => this.mergeOnePR(button, owner, repo, prNumber)
                });
                this.mdAlert.showModal();
            }
        }
        async mergeOnePR(button, owner, repo, prNumber) {
            this.setMessage({
                status: 'warning',
                title: '$merge',
                content: '$merging...',
            });
            this.mdAlert.showModal();
            button.caption = '$merging';
            button.enabled = false;
            button.rightIcon.visible = true;
            const showError = (msg) => {
                this.setMessage({
                    status: 'error',
                    title: '$error',
                    content: msg || '$failed_to_merge'
                });
                this.mdAlert.showModal();
                button.caption = '$merge';
                button.enabled = true;
                button.rightIcon.visible = false;
            };
            try {
                const wallet = eth_wallet_4.Wallet.getClientInstance();
                let message = '';
                if (this.guid) {
                    const { data } = await (0, index_3.getMergeMsg)(this.guid, owner, repo);
                    if (!data) {
                        showError('$failed_to_get_message');
                        return;
                    }
                    message = btoa(data);
                }
                else {
                    message = btoa(`owner:${owner}-repo:${repo}`);
                }
                const signature = await wallet.signMessage(message);
                const result = await (0, index_3.mergePR)(this.guid ? wallet.address : undefined, signature, owner, repo, prNumber);
                if (!result || result.error) {
                    showError(result.error);
                }
                else {
                    this.setMessage({
                        status: 'success',
                        title: '$success',
                        content: '$merged_successfully'
                    });
                    this.mdAlert.showModal();
                    const oldPRs = Number(this.listPR.length);
                    await this.getAllPRs();
                    if (this.listPR.length === 0 && this.guid) {
                        await this.onRefresh();
                    }
                    else {
                        button.caption = '$merged';
                        button.enabled = false;
                        button.rightIcon.visible = false;
                        this.refreshPR(true);
                        if (this.guid && this.updateCountPRs) {
                            this.updateCountPRs(oldPRs, this.listPR.length);
                        }
                    }
                }
            }
            catch (error) {
                showError();
            }
        }
        // private async onShowRequestAudit(commitGuid: string, packageGuid: string, sha: string, version: string) {
        //   if (this.isProject && this.isProjectOwner) {
        //     this.selectedCommit = {
        //       commitGuid,
        //       packageGuid,
        //       sha,
        //       version
        //     }
        //     this.lbCommitId.caption = sha;
        //     this.lbCommitVersion.caption = version;
        //     this.mdPublish.visible = true;
        //   }
        // }
        onClosePublish() {
            this.mdPublish.visible = false;
        }
        resetPublishInfo() {
            this.lbCommitId.caption = '';
            this.lbCommitVersion.caption = '';
            this.btnPublish.caption = '$submit_for_audit';
            this.btnPublish.enabled = true;
            this.btnPublish.rightIcon.visible = false;
            this.mdPublish.visible = false;
        }
        // private async onPublish(guid: string) {
        //   window.location.assign(`/#/publish-commit/${guid}`);
        // }
        async onRequestAudit() {
            if (this.isProject && this.isProjectOwner) {
                this.setMessage({
                    status: 'warning',
                    title: 'Submit',
                    content: 'Submitting...',
                });
                this.mdAlert.showModal();
                this.btnPublish.caption = '$submitting';
                this.btnPublish.enabled = false;
                this.btnPublish.rightIcon.visible = true;
                const showError = (msg) => {
                    this.setMessage({
                        status: 'error',
                        title: 'Error',
                        content: msg || '$failed_to_submit'
                    });
                    this.mdAlert.showModal();
                    this.btnPublish.caption = '$submit_for_audit';
                    this.btnPublish.enabled = true;
                    this.btnPublish.rightIcon.visible = false;
                };
                try {
                    const { name, owner_login } = this.data;
                    const { commitGuid, sha, packageGuid, version } = this.selectedCommit;
                    const commitInfo = {
                        commitGuid,
                        packageGuid,
                        packageName: name,
                        packageOwner: owner_login,
                        sha,
                        version,
                        projectGuid: this.guid,
                        projectId: this.projectId
                    };
                    const semver = version.split('.').map((v) => Number(v));
                    const finVersion = {
                        major: semver[0],
                        minor: semver[1],
                        patch: semver[2]
                    };
                    let packageVersionId, packageId;
                    const requestedAudit = this.commits.filter(f => f.auditStatus);
                    let isOldVersion = requestedAudit.length ? requestedAudit.every((v) => !(0, index_3.compareVersions)(v.version, version)) : false;
                    if (isOldVersion) {
                        showError('$cannot_submit_an_old_version');
                        return;
                    }
                    else {
                        let isCurrentVersion = requestedAudit.find((v) => {
                            const ver = v.version.split('.').map((v) => Number(v));
                            return ver[0] === finVersion.major && ver[1] === finVersion.minor && ver[2] === finVersion.patch && v.auditStatus !== interface_2.PackageStatus.AUDIT_FAILED;
                        });
                        if (isCurrentVersion) {
                            showError('$this_version_has_already_been_submitted');
                            return;
                        }
                    }
                    const ipfsCid = await (0, index_3.uploadDataToIpfs)('commitDetail', JSON.stringify(commitInfo, null, 2));
                    if (!ipfsCid) {
                        showError('$failed_to_upload_data_to_ipfs');
                        return;
                    }
                    const callback = async (err, receipt) => {
                        if (err) {
                            showError((0, index_3.parseContractError)(err.message));
                            this.getCommits();
                        }
                        else if (receipt) {
                            this.setMessage({
                                status: 'success',
                                title: '$transaction_submitted',
                                link: {
                                    caption: receipt,
                                    href: (0, index_3.getExplorerTxUrl)(receipt)
                                }
                            });
                            this.mdAlert.showModal();
                        }
                    };
                    const confirmationCallback = async (receipt) => { };
                    const confirmationForPublishing = async (receipt, hideStatus) => {
                        const result = await (0, index_3.requestAuditCommit)(commitGuid, this.guid, this.projectId, packageId, packageVersionId, version, sha, !!receipt);
                        if (result?.success) {
                            if (hideStatus)
                                return;
                            await this.getCommits();
                            this.resetPublishInfo();
                            this.setMessage({
                                status: 'success',
                                title: 'Success',
                                content: '$submitted_successfully'
                            });
                            this.mdAlert.showModal();
                        }
                        else {
                            showError(result?.error?.message);
                        }
                    };
                    if (this.packageInfo.packageId && this.packageInfo.packageVersionId) {
                        packageVersionId = this.packageInfo.packageVersionId;
                        packageId = this.packageInfo.packageId;
                        await (0, index_3.updatePackageVersionIpfsCid)(packageVersionId, packageId, ipfsCid, callback, confirmationCallback);
                        await confirmationForPublishing();
                    }
                    else if (this.packageInfo.packageId) {
                        packageId = this.packageInfo.packageId;
                        const verData = await (0, index_3.createNewPackageVersion)(this.projectId, packageId, finVersion, ipfsCid, callback, confirmationCallback);
                        this.packageInfo.packageVersionId = verData.packageVersionId;
                        packageVersionId = verData.packageVersionId;
                        await confirmationForPublishing(undefined, true); // Store packageVersionId
                        await (0, index_3.updatePackageVersionToAuditing)(packageVersionId, callback, confirmationForPublishing);
                    }
                    else {
                        const data = await (0, index_3.createNewPackage)(this.projectId, name, ipfsCid, 'PackageType', callback, confirmationCallback);
                        packageId = data.packageId;
                        this.packageInfo.packageId = data.packageId;
                        await confirmationForPublishing(undefined, true); // Store packageId
                        const verData = await (0, index_3.createNewPackageVersion)(this.projectId, packageId, finVersion, ipfsCid, callback, confirmationCallback);
                        packageVersionId = verData.packageVersionId;
                        await confirmationForPublishing(undefined, true); // Store packageVersionId
                        await (0, index_3.updatePackageVersionToAuditing)(packageVersionId, callback, confirmationForPublishing);
                    }
                }
                catch (error) {
                    showError();
                }
            }
        }
        openLink(link) {
            return window.open(link, '_blank');
        }
        onHide() {
            this.clearListTimer();
            clearInterval(this.timer);
        }
        onOpenBuilder() {
            const repoName = this.data?.full_name;
            if (typeof this.onEdit === 'function') {
                this.onEdit(repoName);
            }
        }
        onOpenDeploy() {
            // if (this.data.type && ['contract', 'agent'].includes(this.data.type)) {
            const repoName = this.data?.full_name;
            if (typeof this.onDeploy === 'function') {
                this.onDeploy(repoName);
            }
            // }
        }
        onTabClick(target) {
            this.vStackListPR.visible = target.tag === 'prs';
            // this.vstackCommitTab.visible = target.tag === 'commits';
        }
        init() {
            const i18nData = {};
            for (const key in index_4.repoJson) {
                i18nData[key] = { ...(index_4.repoJson[key] || {}), ...(index_4.mainJson[key] || {}) };
            }
            this.i18n.init({ ...i18nData });
            super.init();
            this.isInitialized = true;
            // this.pagiCommitList.currentPage = 1;
            // this.pagiCommitList.onPageChanged = () => this.getCommits();
            // this.initInputDate();
            this.renderUI();
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", verticalAlignment: "center", padding: { left: '1rem', right: '1rem' } },
                this.$render("i-hstack", { gap: "0.625rem", verticalAlignment: "center", horizontalAlignment: "space-between" },
                    this.$render("i-stack", { gap: "0.3rem", width: "calc(100% - 15rem)", minWidth: "15rem", padding: { top: '1rem', bottom: '1rem' }, wrap: "wrap", alignItems: "center", mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    direction: 'vertical',
                                    alignItems: 'start',
                                }
                            }
                        ] },
                        this.$render("i-vstack", { gap: "0.5rem", width: "45%", mediaQueries: [
                                {
                                    maxWidth: '767px',
                                    properties: {
                                        width: '100%'
                                    }
                                }
                            ] },
                            this.$render("i-hstack", { gap: "0.5rem" },
                                this.$render("i-label", { id: "lbName", font: { size: '1.125rem', bold: true } })),
                            this.$render("i-hstack", { id: "hStackLink", gap: "0.5rem", width: "fit-content", cursor: "pointer", class: "icon-hover" },
                                this.$render("i-label", { id: "lbPath", font: { size: '0.75rem' }, opacity: 0.8 }),
                                this.$render("i-icon", { name: "external-link-alt", width: "0.85rem", height: "0.85em", minWidth: "0.85rem" }))),
                        this.$render("i-hstack", { verticalAlignment: "center", minWidth: '5%' },
                            this.$render("i-label", { id: "lblType", caption: "" })),
                        this.$render("i-hstack", { width: "3rem", horizontalAlignment: "center" },
                            this.$render("i-label", { id: "lbVersion", font: { size: '0.875rem' } })),
                        this.$render("i-hstack", { width: "5rem", horizontalAlignment: "center", mediaQueries: [
                                {
                                    maxWidth: '767px',
                                    properties: {
                                        justifyContent: 'start'
                                    }
                                }
                            ] },
                            this.$render("i-hstack", { id: "hStackCount", gap: "0.5rem", width: "fit-content", verticalAlignment: "center", tooltip: { trigger: 'hover', content: 'Pull requests' } },
                                this.$render("i-icon", { name: "retweet", width: "1.25rem", height: "1.25rem", opacity: 0.8 }),
                                this.$render("i-label", { id: "lbCount", lineHeight: 1, font: { size: '0.75rem', color: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, border: { radius: '0.625rem' }, padding: { left: '0.3rem', right: '0.3rem', top: '0.125rem', bottom: '0.125rem' } }))),
                        this.$render("i-hstack", { gap: "0.5rem", width: "calc(52% - 9rem)", minWidth: "11rem", verticalAlignment: "center" },
                            this.$render("i-label", { id: "lbPushedAt", font: { size: '0.875rem' }, opacity: 0.8 }),
                            this.$render("i-icon", { id: "iconRefresh", name: "sync-alt", class: "icon-hover", cursor: "pointer", width: "0.9rem", height: "0.9rem", minWidth: "0.9rem", onClick: () => this.onRefreshData() }))),
                    this.$render("i-stack", { gap: "0.5rem", alignItems: "center", mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    direction: 'vertical'
                                }
                            }
                        ] },
                        this.$render("i-button", { id: "btnEdit", caption: "$view", stack: { shrink: '0' }, icon: { name: 'eye', width: '0.675rem', height: '0.675rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText }, background: { color: '#17a2b8' }, onClick: this.onOpenBuilder }),
                        this.$render("i-button", { id: "btnDeployer", caption: "$deploy", stack: { shrink: '0' }, icon: { name: 'file-upload', width: '0.675rem', height: '0.675rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText }, background: { color: '#17a2b8' }, enabled: false, onClick: this.onOpenDeploy })),
                    this.$render("i-icon", { id: "iconDetail", name: "angle-down", class: "icon-expansion", cursor: "pointer", width: "1.5rem", height: "1.5rem", stack: { shrink: '0' }, onClick: this.onShowDetail })),
                this.$render("i-vstack", { id: "tabs", visible: false, width: "100%", maxHeight: '33rem', position: "relative", zIndex: 0 },
                    this.$render("i-scom-widget-repos--tabs", { id: "customTabs", width: "100%", display: "flex", onChanged: this.onTabClick, class: index_css_1.stickyStyle }),
                    this.$render("i-panel", { minHeight: 60, maxHeight: '30rem', overflow: 'auto', padding: { bottom: '1rem' }, class: index_css_1.wrapperStyle },
                        this.$render("i-vstack", { id: "vStackListPR", verticalAlignment: "center" }))),
                this.$render("i-modal", { id: "mdPublish", class: index_css_1.modalStyle, maxWidth: "600px" },
                    this.$render("i-vstack", { width: "100%", gap: "0.625rem", padding: { top: '1.5rem', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' } },
                        this.$render("i-hstack", { gap: "1rem", horizontalAlignment: "space-between", verticalAlignment: "center" },
                            this.$render("i-label", { id: "lbPublish", font: { size: '1rem', bold: true, color: Theme.colors.primary.main } }),
                            this.$render("i-icon", { name: "times", fill: Theme.colors.primary.main, width: "1.25rem", height: "1.25rem", cursor: "pointer", onClick: this.onClosePublish })),
                        this.$render("i-vstack", { width: "100%", gap: "0.5rem", margin: { top: '1rem' } },
                            this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", margin: { bottom: '0.25rem' } },
                                this.$render("i-label", { caption: "$branch" }),
                                this.$render("i-label", { caption: "main", font: { size: '1rem', color: Theme.colors.primary.main } })),
                            this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center" },
                                this.$render("i-label", { caption: "$version" }),
                                this.$render("i-label", { id: "lbCommitVersion", font: { size: '1rem', color: Theme.colors.primary.main } })),
                            this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center" },
                                this.$render("i-label", { caption: "$commit_id_sha" }),
                                this.$render("i-label", { id: "lbCommitId", font: { size: '1rem', color: Theme.colors.primary.main } }))),
                        this.$render("i-button", { id: "btnPublish", caption: "$submit_for_audit", width: "12.5rem", margin: { top: '1rem', left: 'auto', right: 'auto' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, rightIcon: { spin: true, visible: false }, onClick: () => this.onRequestAudit() }))),
                this.$render("i-modal", { id: 'viewReportModal', maxWidth: "55rem", title: "$audit_report", closeIcon: { name: 'times' }, popupPlacement: "center" },
                    this.$render("i-panel", { padding: { top: '1rem', bottom: '1rem' } },
                        this.$render("i-scom-widget-repos--audit-report", { id: "auditReport", isPopup: true, display: "block", height: 'calc(100vh - 68px)', overflow: { y: 'auto' } }))),
                this.$render("i-alert", { id: "mdAlert" })));
        }
    };
    ScomWidgetReposGithubRepo = __decorate([
        (0, components_5.customElements)('i-scom-widget-repos--github-repo')
    ], ScomWidgetReposGithubRepo);
    exports.ScomWidgetReposGithubRepo = ScomWidgetReposGithubRepo;
});
define("@scom/scom-widget-repos/components/deployer.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-widget-repos/utils/index.ts", "@scom/scom-widget-repos/components/github/index.css.ts", "@scom/scom-enclave-attestation"], function (require, exports, components_6, utils_1, index_css_2, scom_enclave_attestation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetReposDeployer = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    let ScomWidgetReposDeployer = class ScomWidgetReposDeployer extends components_6.Module {
        get contract() {
            return this._contract;
        }
        set contract(value) {
            this._contract = value;
        }
        constructor(parent, options) {
            super(parent, options);
            this.cachedContract = {};
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        async setData(name) {
            this.contract = name;
            this.enclaveItems = [
                {
                    label: 'Enclave 1',
                    value: 'https://enclave01.decom.dev/attDoc'
                }
            ];
            await this.comboEnclave.ready();
            this.comboEnclave.items = this.enclaveItems;
            this.comboEnclave.selectedItem = this.enclaveItems[0];
            await this.handleInit();
        }
        async handleInit() {
            if (this.pnlLoader)
                this.pnlLoader.visible = true;
            this.pnlDeploy.clearInnerHTML();
            let rootDir = components_6.application.rootDir;
            if (rootDir.endsWith('/'))
                rootDir = rootDir.slice(0, -1);
            if (rootDir.startsWith('/'))
                rootDir = rootDir.slice(1);
            const mainPath = `${window.location.origin}/${rootDir ? rootDir + '/' : ''}libs/@scom/contract-deployer`;
            const scconfigPath = `${mainPath}/scconfig.json`;
            const scconfig = await fetch(scconfigPath).then(res => res.json());
            const contract = (this.contract || '').replace('scom-repos', '@scom');
            if (scconfig) {
                scconfig.contract = contract;
                scconfig.rootDir = mainPath;
            }
            try {
                const content = await this.getContent(contract);
                if (!content)
                    throw new Error('Contract not found');
                await components_6.application.loadScript(contract, content, true);
                const module = await components_6.application.newModule(scconfig.main, scconfig);
                if (module) {
                    this.pnlDeploy.append(module);
                    const firstChild = module.firstChild;
                    const pnlMain = firstChild?.children?.[2];
                    if (pnlMain) {
                        const innerModule = await components_6.application.newModule("@modules/module1", scconfig);
                        pnlMain.clearInnerHTML();
                        pnlMain.append(innerModule);
                    }
                }
            }
            catch (err) {
                console.error('deploy error', err);
            }
            const pkgScconfig = await (0, utils_1.getScconfig)(contract);
            if (pkgScconfig?.type === 'worker') {
                this.renderJsonForm(pkgScconfig);
            }
            if (this.pnlLoader)
                this.pnlLoader.visible = false;
        }
        renderJsonForm(scconfig) {
            this.jsonForm.clearFormData();
            // const schemaObj: IDataSchema = {
            //   "type": "object",
            //   "properties": {}
            // }
            this.jsonForm.jsonSchema = utils_1.workerSchemas.schema;
            this.jsonForm.uiSchema = utils_1.workerSchemas.uischema;
            this.jsonForm.formOptions = {
                columnWidth: '100%',
                columnsPerRow: 1,
                confirmButtonOptions: {
                    caption: '$confirm',
                    backgroundColor: Theme.colors.primary.main,
                    fontColor: Theme.colors.primary.contrastText,
                    hide: false,
                    onClick: async () => {
                    }
                },
                dateTimeFormat: {
                    date: 'YYYY-MM-DD',
                    time: 'HH:mm:ss',
                    dateTime: 'MM/DD/YYYY HH:mm'
                },
            };
            this.jsonForm.renderForm();
            this.jsonForm.visible = true;
            this.jsonForm.setFormData(scconfig);
        }
        async getContent(contract) {
            if (this.cachedContract[contract])
                return this.cachedContract[contract];
            const splitted = contract.split('/');
            const name = splitted[splitted.length - 1];
            const content = await (0, utils_1.getPackage)(name);
            this.cachedContract[contract] = content;
            return content;
        }
        async onOpenVerify() {
            const moduleDir = components_6.application.currentModuleDir;
            const selectedItem = this.comboEnclave.selectedItem;
            let doc = new Uint8Array(await (await fetch(selectedItem.value)).arrayBuffer());
            let rootCert = await (await fetch("certs/aws-root.pem")).text();
            let { attDoc, verified } = await (0, scom_enclave_attestation_1.verify)(doc, rootCert);
            this.lblVerificationMessage.caption = verified ? '$enclave_verification_successful' : '$enclave_verification_failed';
        }
        clear() {
            this.pnlDeploy.clearInnerHTML();
        }
        init() {
            super.init();
            const name = this.getAttribute('contract', true);
            if (name)
                this.setData(name);
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%", padding: { top: '1rem' } },
                this.$render("i-vstack", { id: "pnlLoader", position: "absolute", width: "100%", height: "100%", minHeight: 400, horizontalAlignment: "center", verticalAlignment: "center", background: { color: Theme.background.main }, padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                    this.$render("i-panel", { class: index_css_2.spinnerStyle })),
                this.$render("i-stack", { direction: 'vertical', width: "100%", height: "100%" },
                    this.$render("i-label", { caption: '$enclave', font: { size: '1rem' }, margin: { top: '0.625rem', bottom: '0.625rem' } }),
                    this.$render("i-combo-box", { id: "comboEnclave", height: 36, width: '100%', icon: { width: 14, height: 14, name: 'angle-down' }, border: { radius: 5 } }),
                    this.$render("i-button", { id: "btnVerify", caption: "$verify", stack: { shrink: '0' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText }, background: { color: '#17a2b8' }, onClick: this.onOpenVerify }),
                    this.$render("i-label", { id: "lblVerificationMessage", caption: "", font: { size: '1rem' }, margin: { top: '0.625rem', bottom: '0.625rem' } }),
                    this.$render("i-stack", { gap: "0.5rem" },
                        this.$render("i-form", { id: "jsonForm", width: "100%", height: "100%", visible: false })),
                    this.$render("i-panel", { id: "pnlDeploy", width: "100%", height: "100%" }))));
        }
    };
    ScomWidgetReposDeployer = __decorate([
        (0, components_6.customElements)('i-scom-widget-repos--deployer')
    ], ScomWidgetReposDeployer);
    exports.ScomWidgetReposDeployer = ScomWidgetReposDeployer;
});
define("@scom/scom-widget-repos/components/github/list.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-widget-repos/components/github/repo.tsx", "@scom/scom-widget-repos/components/github/index.css.ts", "@scom/scom-widget-repos/store/index.ts", "@scom/scom-widget-repos/languages/index.ts", "@scom/scom-widget-repos/components/deployer.tsx"], function (require, exports, components_7, repo_1, index_css_3, index_5, index_6, deployer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_7.Styles.Theme.ThemeVars;
    const pageSize = 10;
    let ScomWidgetReposGithubList = class ScomWidgetReposGithubList extends components_7.Module {
        constructor(parent, options) {
            super(parent, options);
            this.totalPage = 0;
            this.pageNumber = 0;
            this.itemStart = 0;
            this.itemEnd = pageSize;
            this._userInfo = {};
            this._listRepos = [];
            this.initedConfig = false;
            this._redirectUri = '';
            this._selectedType = [];
        }
        get guid() {
            return this._guid;
        }
        set guid(value) {
            this._guid = value;
        }
        get projectId() {
            return this._projectId;
        }
        set projectId(value) {
            this._projectId = value;
        }
        get isProject() {
            return this._isProject;
        }
        set isProject(value) {
            this._isProject = value;
            if (this.vStackRepos)
                this.renderDetailRepos();
        }
        get isProjectOwner() {
            return this._isProjectOwner;
        }
        set isProjectOwner(value) {
            this._isProjectOwner = value;
            if (this.vStackRepos)
                this.renderDetailRepos();
        }
        get isGithubOwner() {
            return this._isGithubOwner;
        }
        set isGithubOwner(value) {
            this._isGithubOwner = value;
        }
        get userInfo() {
            return this._userInfo;
        }
        set userInfo(value) {
            this._userInfo = value;
        }
        set listRepos(value) {
            this._listRepos = value;
            if (this.vStackRepos) {
                this.renderUI();
            }
        }
        get listRepos() {
            return this._listRepos;
        }
        get filteredRepos() {
            let list = [...this.listRepos];
            const onlyPRs = this.filterSwitch?.checked ?? false;
            if (onlyPRs) {
                list = list.filter(v => v.open_issues > 0).sort((a, b) => (0, components_7.moment)(a.pushed_at).isSameOrBefore(b.pushed_at) ? 1 : -1);
            }
            if (this._selectedType?.length) {
                list = list.filter(v => this._selectedType.includes(v.type));
            }
            return [...list];
        }
        get listReposPagination() {
            return this.filteredRepos.slice(this.itemStart, this.itemEnd);
        }
        get isAuditPR() {
            return this._isAuditPR;
        }
        set isAuditPR(value) {
            this._isAuditPR = value;
        }
        onShow(options) {
            this._redirectUri = options?.redirect || '';
            this.renderUI();
        }
        async renderDetailRepos() {
            if (!this.filteredRepos?.length) {
                this.renderEmpty();
            }
            else {
                const nodeItems = [];
                for (const repo of this.listReposPagination) {
                    const item = new repo_1.ScomWidgetReposGithubRepo();
                    item.isGithubOwner = this.isGithubOwner;
                    item.projectId = this.projectId;
                    item.guid = this.guid;
                    item.isProject = this.isProject;
                    item.isProjectOwner = this.isProjectOwner;
                    item.isAuditPR = this.isAuditPR;
                    item.data = repo;
                    item.onEdit = (name) => this.showBuilder(name);
                    item.onDeploy = (name) => this.openDeploy(name);
                    item.onRefresh = () => this.onRefresh();
                    item.updateCountPRs = (oldNum, newNum) => this.updateCountPRs(oldNum, newNum);
                    nodeItems.push(item);
                }
                this.vStackRepos.clearInnerHTML();
                this.vStackRepos.classList.add('list-repos');
                this.vStackRepos.append(...nodeItems);
            }
        }
        renderRepos() {
            this.totalPage = Math.ceil(this.filteredRepos.length / pageSize);
            this.paginationElm.visible = this.totalPage > 1;
            this.lbOrg.caption = this.userInfo?.data?.org || this.userInfo?.data?.login || '';
            const repoNum = this.filteredRepos.length;
            this.lbRepos.caption = `(${repoNum} ${repoNum !== 1 ? this.i18n.get('$repositories') : this.i18n.get('$repository')})`;
            const hasUser = !!this.userInfo?.data?.login;
            this.lbRepos.visible = hasUser;
            this.iconRefresh.visible = hasUser;
            this.renderDetailRepos();
        }
        async onRefresh() {
            this.pnlLoader.visible = true;
            this.iconRefresh.enabled = false;
            await this.getAllRepos();
            this.resetPaging();
            this.iconRefresh.enabled = true;
            this.pnlLoader.visible = false;
        }
        onSelectIndex() {
            if (!this.filteredRepos.length)
                return;
            this.pageNumber = this.paginationElm.currentPage;
            this.itemStart = (this.pageNumber - 1) * pageSize;
            this.itemEnd = this.itemStart + pageSize;
            this.renderRepos();
        }
        resetPaging() {
            this.pageNumber = 1;
            this.paginationElm.currentPage = 1;
            this.itemStart = 0;
            this.itemEnd = this.itemStart + pageSize;
            this.renderRepos();
        }
        async renderUI() {
            this.paginationElm.visible = false;
            this.iconRefresh.visible = false;
            this.vStackRepos.classList.remove('list-repos');
            this.vStackRepos.clearInnerHTML();
            this.pnlLoader.visible = true;
            this.resetPaging();
            this.pnlLoader.visible = false;
            const config = (0, index_5.getStorageConfig)();
            const baseUrl = config?.baseUrl || '';
            let result = this.extractUrl(baseUrl);
            result = result.split('?')[0];
            if (result.includes('scom-repos') || result.includes('ijstech')) {
                this.showBuilder(result);
            }
        }
        extractUrl(baseUrl) {
            let path;
            if (baseUrl && window.location.hash.startsWith(baseUrl)) {
                let length = baseUrl[baseUrl.length - 1] == '/' ? baseUrl.length : baseUrl.length + 1;
                path = window.location.hash.substring(length);
            }
            else {
                path = window.location.hash.substring(2);
            }
            return path;
        }
        renderEmpty() {
            this.vStackRepos.clearInnerHTML();
            this.vStackRepos.classList.remove('list-repos');
            this.vStackRepos.appendChild(this.$render("i-label", { caption: this.error || '$there_is_no_repository', font: { size: '1.5rem' }, margin: { top: '3rem', left: 'auto', right: 'auto' } }));
        }
        async showBuilder(name) {
            this.mdWidgetBuilder.visible = true;
            this.pnlBuilderLoader.visible = true;
            if (!this.widgetBuilder) {
                const pack = await components_7.application.loadPackage('@scom/scom-widget-builder');
                this.widgetBuilder = await pack['ScomWidgetBuilder'].create({
                    id: 'widgetBuilder',
                    width: '100dvw',
                    height: '100dvh',
                    display: 'flex',
                    onClosed: () => this.closeBuilder()
                }, undefined);
                this.widgetBuilder.parent = this.pnlBuilder;
            }
            const config = (0, index_5.getStorageConfig)();
            if (!this.initedConfig && config.transportEndpoint) {
                this.initedConfig = true;
                this.widgetBuilder.setConfig(config);
            }
            this.widgetBuilder.readonly = !!this._redirectUri;
            await this.widgetBuilder.setValue(name);
            this.widgetBuilder.refresh();
            this.pnlBuilderLoader.visible = false;
        }
        closeBuilder() {
            if (this._redirectUri) {
                window.location.assign(decodeURIComponent(this._redirectUri));
                this._redirectUri = '';
            }
            else {
                this.widgetBuilder.resetCid();
            }
            this.mdWidgetBuilder.visible = false;
        }
        onBuilderOpen() {
            const html = document.getElementsByTagName('html')[0];
            html.style.scrollbarGutter = 'auto';
            html.style.overflow = 'hidden';
        }
        onBuilderClose() {
            const html = document.getElementsByTagName('html')[0];
            html.style.scrollbarGutter = '';
            html.style.overflow = '';
        }
        onSwitchFilter(target) {
            this.renderRepos();
        }
        async openDeploy(name) {
            if (!this.deployer) {
                this.deployer = await deployer_1.ScomWidgetReposDeployer.create({
                    contract: name,
                }, undefined);
            }
            else {
                await this.deployer.setData(name);
            }
            this.deployer.openModal({
                width: 800,
                maxWidth: '100%',
                height: '100dvh',
                overflow: { y: 'auto', x: 'hidden' },
                closeOnBackdropClick: false,
                padding: { top: '0.5rem', right: '0.5rem', bottom: 0, left: '0.5rem' },
                onClose: () => {
                    this.deployer.clear();
                }
            });
        }
        onShowFilter() {
            this.mdFilter.parent = this.btnFilter;
            this.mdFilter.showBackdrop = false;
            this.mdFilter.visible = true;
        }
        onHideFilter() {
            this.mdFilter.visible = false;
        }
        renderFilter() {
            this.pnlFilter.clearInnerHTML();
            const items = [
                { caption: '$widget', value: 'widget' },
                { caption: '$contract', value: 'contract' },
                { caption: '$dapp', value: 'dapp' },
                { caption: '$worker', value: 'worker' },
                { caption: '$sdk', value: 'sdk' },
                { caption: '$component', value: 'component' },
                { caption: '$agent', value: 'agent' },
            ];
            for (const item of items) {
                this.pnlFilter.appendChild(this.$render("i-checkbox", { caption: item.caption, tag: item.value, checked: false, onChanged: (target) => this.onFilterChanged(target) }));
            }
        }
        onFilterChanged(target) {
            const checked = target.checked;
            const value = target.tag;
            if (checked) {
                this._selectedType.push(value);
            }
            else {
                this._selectedType = this._selectedType.filter(v => v !== value);
            }
            if (this.timer)
                clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.renderRepos();
            }, 500);
        }
        onHide() {
            super.onHide();
            const children = this.vStackRepos?.children || [];
            for (const child of children) {
                if (child instanceof repo_1.ScomWidgetReposGithubRepo) {
                    child.onHide();
                }
            }
        }
        init() {
            this.i18n.init({ ...index_6.repoJson });
            super.init();
            this.isProjectOwner = this.getAttribute('isProjectOwner', true, false);
            this.isProject = this.getAttribute('isProject', true, false);
            this.renderFilter();
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%", maxWidth: "75rem", margin: { left: 'auto', right: 'auto' }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, class: index_css_3.githubStyle },
                this.$render("i-vstack", { id: "pnlLoader", position: "absolute", width: "100%", height: "100%", horizontalAlignment: "center", verticalAlignment: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, background: { color: Theme.background.main }, visible: false },
                    this.$render("i-panel", { class: index_css_3.spinnerStyle })),
                this.$render("i-vstack", { width: "100%", gap: "1.25rem" },
                    this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", wrap: "wrap" },
                        this.$render("i-label", { id: "lbOrg", font: { size: '1rem', bold: true, color: Theme.colors.primary.main } }),
                        this.$render("i-label", { id: "lbRepos", font: { size: '1rem' }, opacity: 0.8 }),
                        this.$render("i-icon", { id: "iconRefresh", visible: false, class: "icon-hover", name: "sync-alt", width: "1.25rem", height: "1.25rem", cursor: "pointer", onClick: this.onRefresh }),
                        this.$render("i-switch", { id: "filterSwitch", checked: false, uncheckedTrackColor: Theme.colors.secondary.main, checkedTrackColor: Theme.colors.primary.main, tooltip: { content: '$show_only_PRs', placement: 'bottom' }, onChanged: this.onSwitchFilter }),
                        this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "end", position: "relative", margin: { left: 'auto' } },
                            this.$render("i-button", { id: "btnFilter", caption: "Filter", icon: { name: 'sliders-h', width: '1rem', height: '1rem' }, stack: { shrink: '0', grow: '0' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, onClick: this.onShowFilter }))),
                    this.$render("i-vstack", { id: "vStackRepos", width: "100%" }),
                    this.$render("i-hstack", { horizontalAlignment: "center", margin: { top: '2rem' } },
                        this.$render("i-pagination", { id: "paginationElm", margin: { bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, width: "auto", currentPage: this.pageNumber, totalPages: this.totalPage, onPageChanged: this.onSelectIndex }))),
                this.$render("i-modal", { id: "mdWidgetBuilder", showBackdrop: true, width: '100dvw', height: '100dvh', overflow: 'hidden', padding: { top: 0, bottom: 0, left: 0, right: 0 }, onOpen: this.onBuilderOpen, onClose: this.onBuilderClose, class: index_css_3.customModalStyle },
                    this.$render("i-panel", { id: "pnlBuilder", width: '100dvw', height: '100dvh', overflow: 'hidden' },
                        this.$render("i-vstack", { id: "pnlBuilderLoader", position: "absolute", width: "100%", height: "100%", horizontalAlignment: "center", verticalAlignment: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, background: { color: Theme.background.main }, visible: false },
                            this.$render("i-panel", { class: index_css_3.spinnerStyle })))),
                this.$render("i-modal", { id: "mdFilter", popupPlacement: "bottomRight", showBackdrop: false, closeOnBackdropClick: false, width: '300px', maxWidth: '100%', border: { radius: '0.25rem' }, boxShadow: Theme.shadows[0], padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                    this.$render("i-vstack", { width: "100%", gap: "1rem" },
                        this.$render("i-hstack", { verticalAlignment: "center", gap: "0.5rem", horizontalAlignment: "space-between", padding: { top: '0.5rem', bottom: '0.5rem' }, border: { bottom: { color: Theme.divider, width: '1px', style: 'solid' } } },
                            this.$render("i-label", { caption: "Select Type" }),
                            this.$render("i-icon", { name: "times", fill: Theme.text.primary, width: '1rem', height: '1rem', cursor: "pointer", stack: { shrink: '0', grow: '0' }, onClick: this.onHideFilter })),
                        this.$render("i-vstack", { id: "pnlFilter", width: "100%" })))));
        }
    };
    __decorate([
        (0, components_7.observable)()
    ], ScomWidgetReposGithubList.prototype, "totalPage", void 0);
    ScomWidgetReposGithubList = __decorate([
        components_7.customModule,
        (0, components_7.customElements)('i-scom-widget-repos--github-list')
    ], ScomWidgetReposGithubList);
    exports.default = ScomWidgetReposGithubList;
});
define("@scom/scom-widget-repos/components/github/create.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-widget-repos/components/github/index.css.ts", "@scom/scom-widget-repos/utils/index.ts", "@scom/scom-widget-repos/store/index.ts", "@scom/scom-widget-repos/languages/index.ts"], function (require, exports, components_8, index_css_4, index_7, index_8, index_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetReposCreateRepo = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    let ScomWidgetReposCreateRepo = class ScomWidgetReposCreateRepo extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        init() {
            this.i18n.init({ ...index_9.repoJson });
            super.init();
            this.onClosed = this.getAttribute('onClosed', true) || this.onClosed;
            const id = this.getAttribute('id', true);
            const prefix = this.getAttribute('prefix', true);
            if (id || prefix)
                this.setData({ id, prefix });
        }
        async setData(options) {
            this.clear();
            // if (!options?.id) {
            //   this.setMessage({
            //     status: 'error',
            //     content: 'Project ID is invalid',
            //     onClose: () => {
            //       if (typeof this.onClosed === 'function') this.onClosed();
            //     }
            //   });
            //   this.mdAlert.showModal();
            //   return;
            // }
            this.projectGuid = options.id;
            this.projectPrefix = options.prefix || '';
            if (!this.projectPrefix) {
                this.setMessage({
                    status: 'error',
                    content: '$please_add_a_prefix_to_the_project_first',
                    onClose: () => {
                        if (typeof this.onClosed === 'function')
                            this.onClosed();
                    }
                });
                this.mdAlert.showModal();
            }
            else {
                if (!this.lbPrefix.isConnected)
                    await this.lbPrefix.ready();
                this.lbPrefix.caption = `${this.projectPrefix}-`;
            }
        }
        clear() {
            if (this.lbPrefix)
                this.lbPrefix.caption = '';
            if (this.edtName)
                this.edtName.value = '';
            if (this.edtDescription)
                this.edtDescription.value = '';
            if (this.btnConfirm)
                this.btnConfirm.enabled = false;
        }
        updateButton() {
            this.btnConfirm.enabled = !!(this.edtName.value && this.projectPrefix);
        }
        setMessage(message) {
            const { status, content, title, link, onClose, onConfirm } = message;
            if (title !== undefined)
                this.mdAlert.title = title;
            if (content !== undefined)
                this.mdAlert.content = content;
            if (status !== undefined)
                this.mdAlert.status = status;
            if (link)
                this.mdAlert.link = link;
            if (typeof onClose === 'function')
                this.mdAlert.onClose = onClose;
            if (typeof onConfirm === 'function')
                this.mdAlert.onConfirm = onConfirm;
        }
        async handleConfirmClick() {
            if (!(0, index_8.isLoggedIn)()) {
                this.setMessage({
                    status: 'error',
                    content: '$please_login_to_create_your_repository'
                });
                this.mdAlert.showModal();
                return;
            }
            const name = this.edtName.value;
            if (!name) {
                this.setMessage({
                    status: 'error',
                    content: '$repository_name_is_required'
                });
                this.mdAlert.showModal();
                return;
            }
            try {
                this.btnConfirm.enabled = false;
                this.btnConfirm.rightIcon.visible = true;
                const repoInfo = {
                    name: `${this.projectPrefix}-${name}`,
                    description: this.edtDescription.value
                };
                const result = await (0, index_7.createRepo)(repoInfo);
                if (!result || result.error) {
                    this.setMessage({
                        status: 'error',
                        content: result?.error || '$failed_to_create_your_repository'
                    });
                    this.mdAlert.showModal();
                }
                else {
                    this.setMessage({
                        status: 'success',
                        content: '$your_repository_has_been_created_successfully',
                        onClose: () => {
                            if (typeof this.onClosed === 'function')
                                this.onClosed();
                        }
                    });
                    this.mdAlert.showModal();
                    this.btnConfirm.rightIcon.visible = false;
                    this.clear();
                    return;
                }
            }
            catch (err) {
                this.setMessage({
                    status: 'error',
                    content: '$failed_to_create_your_repository'
                });
                this.mdAlert.showModal();
            }
            this.btnConfirm.enabled = true;
            this.btnConfirm.rightIcon.visible = false;
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%" },
                this.$render("i-panel", { width: "100%", height: "100%", overflow: { y: 'auto' } },
                    this.$render("i-vstack", { width: "100%", padding: { top: "1rem", bottom: "1.5rem", left: "1rem", right: "1rem" }, gap: "1.5rem" },
                        this.$render("i-hstack", { horizontalAlignment: "space-between", gap: "8px" },
                            this.$render("i-label", { caption: "$create_new_repository", font: { size: '1.25rem', weight: 600 }, lineHeight: 1.5 })),
                        this.$render("i-vstack", { width: "100%", gap: "0.5rem" },
                            this.$render("i-panel", null,
                                this.$render("i-label", { display: "inline", caption: "$repository_name", margin: { right: "0.25rem" } }),
                                this.$render("i-label", { display: "inline", caption: "*", font: { color: Theme.colors.error.main } })),
                            this.$render("i-hstack", { gap: "0.15rem", verticalAlignment: "center", border: { width: 1, style: 'solid', color: Theme.divider, radius: 5 } },
                                this.$render("i-label", { id: "lbPrefix", padding: { left: '0.75rem' }, font: { bold: true, color: Theme.colors.primary.main } }),
                                this.$render("i-input", { id: "edtName", class: index_css_4.inputStyle, inputType: 'text', height: 40, width: '100%', onChanged: this.updateButton }))),
                        this.$render("i-vstack", { width: "100%", gap: "0.5rem" },
                            this.$render("i-label", { caption: "$description" }),
                            this.$render("i-panel", { class: "form-control" },
                                this.$render("i-input", { id: "edtDescription", class: index_css_4.textareaStyle, inputType: 'textarea', rows: 3, height: 'unset', width: '100%' }))),
                        this.$render("i-hstack", { justifyContent: 'end', alignItems: 'center' },
                            this.$render("i-button", { id: "btnConfirm", height: 40, minWidth: 120, enabled: false, caption: '$confirm', rightIcon: { spin: true, visible: false }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, font: { color: Theme.colors.primary.contrastText }, onClick: this.handleConfirmClick.bind(this) })))),
                this.$render("i-alert", { id: "mdAlert" })));
        }
    };
    ScomWidgetReposCreateRepo = __decorate([
        (0, components_8.customElements)('i-scom-widget-repos--create-repo')
    ], ScomWidgetReposCreateRepo);
    exports.ScomWidgetReposCreateRepo = ScomWidgetReposCreateRepo;
});
define("@scom/scom-widget-repos/components/tabs/index.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetReposTabs = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomWidgetReposTabs = class ScomWidgetReposTabs extends components_9.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = {
                items: []
            };
            this.elmsMapper = {};
        }
        set items(value) {
            this._data.items = value || [];
            if (!this.activeTab) {
                this._data.activeTab = this.items[0]?.tag;
            }
            this.renderItems();
        }
        get items() {
            return this._data.items || [];
        }
        get activeTab() {
            return this._data.activeTab;
        }
        set activeTab(value) {
            this._data.activeTab = value;
            this.renderItems();
        }
        setData(data) {
            this._data = data;
            if (!this.activeTab)
                this.activeTab = this.items[0]?.tag;
            this.renderItems();
        }
        updateCount(tag, count) {
            const elm = this.elmsMapper[tag];
            if (elm) {
                const child = elm.children?.[1];
                if (child) {
                    child.caption = `(${count || 0})`;
                    child.visible = true;
                }
            }
        }
        renderItems() {
            this.pnlList.clearInnerHTML();
            this.items.forEach(item => {
                const { caption, tag, count, hasCount } = item;
                const isActive = this.activeTab === tag;
                const itemElm = (this.$render("i-hstack", { id: `tab${tag}`, verticalAlignment: "center", horizontalAlignment: "center", gap: "0.25rem", cursor: "pointer", border: { radius: '0.25rem', color: Theme.divider, style: 'solid', width: '1px' }, background: { color: isActive ? Theme.action.hoverBackground : 'transparent' }, tag: tag, hover: { backgroundColor: isActive ? Theme.action.hoverBackground : 'transparent' }, stack: { grow: '1' }, minHeight: 36, onClick: this.onTabClick },
                    this.$render("i-label", { caption: caption, font: { size: '0.875rem', color: isActive ? Theme.action.hover : Theme.text.primary, weight: isActive ? 600 : 400 } }),
                    this.$render("i-label", { caption: `(${count})` || "(0)", font: { size: '0.875rem', color: Theme.colors.primary.main, weight: isActive ? 600 : 400 }, visible: hasCount })));
                this.pnlList.append(itemElm);
                this.elmsMapper[tag] = itemElm;
            });
        }
        onTabClick(target) {
            const oldTab = this.activeTab && this.elmsMapper[this.activeTab];
            if (oldTab) {
                oldTab.background = { color: 'transparent' };
                const firtChild = oldTab.children?.[0];
                firtChild.font = { size: '0.875rem' };
                const secondChild = oldTab.children?.[1];
                secondChild.font = { size: '0.875rem', color: Theme.colors.primary.main };
            }
            this.activeTab = target.tag;
            target.background = { color: Theme.action.hoverBackground };
            const firtChild = target.children?.[0];
            firtChild.font = { size: '0.875rem', color: Theme.action.hover, weight: 600 };
            const secondChild = target.children?.[1];
            secondChild.font = { size: '0.875rem', color: Theme.colors.primary.main, weight: 600 };
            if (typeof this.onChanged === 'function') {
                this.onChanged(target);
            }
        }
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged') || this.onChanged;
            this.onTabClick = this.onTabClick.bind(this);
            const items = this.getAttribute('items');
            const activeTab = this.getAttribute('activeTab');
            if (items)
                this.setData({ items, activeTab });
        }
        render() {
            return (this.$render("i-hstack", { id: "pnlList", verticalAlignment: "center", horizontalAlignment: "center", gap: "0.25rem", overflow: "hidden", stack: { grow: '1' } }));
        }
    };
    ScomWidgetReposTabs = __decorate([
        (0, components_9.customElements)('i-scom-widget-repos--tabs')
    ], ScomWidgetReposTabs);
    exports.ScomWidgetReposTabs = ScomWidgetReposTabs;
});
define("@scom/scom-widget-repos/components/github/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-widget-repos/utils/API.ts", "@scom/scom-widget-repos/components/github/index.css.ts", "@scom/scom-widget-repos/components/github/create.tsx", "@scom/scom-widget-repos/languages/index.ts"], function (require, exports, components_10, API_2, index_css_5, create_1, index_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetReposCreateRepo = exports.ScomWidgetReposGithub = void 0;
    Object.defineProperty(exports, "ScomWidgetReposCreateRepo", { enumerable: true, get: function () { return create_1.ScomWidgetReposCreateRepo; } });
    // import dataJson from './data.json';
    const Theme = components_10.Styles.Theme.ThemeVars;
    let ScomWidgetReposGithub = class ScomWidgetReposGithub extends components_10.Module {
        constructor(parent, options) {
            super(parent, options);
            this.countPRs = 0;
            this.userInfo = {};
            this._data = {};
            this.listRepos = [];
        }
        get guid() {
            return this._data.guid;
        }
        set guid(value) {
            this._data.guid = value;
        }
        set projectId(value) {
            this._projectId = value;
        }
        get projectId() {
            return this._projectId;
        }
        get isProject() {
            return this._data.isProject;
        }
        set isProject(value) {
            this._data.isProject = value;
            if (this.isProject && this.elmList) {
                this.elmList.isProject = this.isProject;
                this.elmPRs.isProject = this.isProject;
            }
        }
        get isProjectOwner() {
            return this._data.isProjectOwner;
        }
        set isProjectOwner(value) {
            this._data.isProjectOwner = value;
            if (this.isProjectOwner && this.elmList) {
                this.elmList.isProjectOwner = this.isProjectOwner;
                this.elmPRs.isProjectOwner = this.isProjectOwner;
            }
        }
        get prefix() {
            return this._data.prefix;
        }
        set prefix(value) {
            this._data.prefix = value;
            if (value && this.elmList) {
                this.renderUI();
            }
        }
        get searchName() {
            return this._searchName;
        }
        set searchName(value) {
            if (value === this._searchName)
                return;
            this._searchName = value;
            this.updateElms();
        }
        get listReposFiltered() {
            let list = [...this.listRepos];
            if (this.searchName)
                list = list.filter(v => v.name.toLowerCase().includes(this.searchName.toLowerCase()));
            return list.sort((a, b) => (0, components_10.moment)(a.pushed_at).isSameOrBefore(b.pushed_at) ? 1 : -1);
        }
        get listPRsFiltered() {
            let list = [...this.listRepos];
            if (this.searchName)
                list = list.filter(v => v.name.toLowerCase().includes(this.searchName.toLowerCase()));
            return list.filter(v => v.open_issues > 0).sort((a, b) => (0, components_10.moment)(a.pushed_at).isSameOrBefore(b.pushed_at) ? 1 : -1);
        }
        async getAllRepos() {
            // const result = await getAllRepos(this.userInfo?.data?.login, this.isProject ? this.prefix : '', !this.isProject);
            const result = await (0, API_2.getAllRepos)('yc-wong', 'scom', false);
            if (result?.data) {
                this.listRepos = [
                    ...result.data,
                    // ...dataJson.map(v => {
                    //   return {
                    //     full_name: v,
                    //     name: v.split('/').pop(),
                    //     open_issues: 0,
                    //     owner_login: "scom-repos",
                    //     version: "",
                    //     html_url: `https://github.com/${v}`
                    //   }
                    // })
                ];
            }
            else {
                this.listRepos = [];
            }
            this.updateElms();
        }
        updateElms() {
            const listPRsFiltered = this.listPRsFiltered;
            if (this.isProject) {
                this.elmList.listRepos = this.listReposFiltered;
                this.elmPRs.listRepos = [...listPRsFiltered];
                this.countPRs = [...listPRsFiltered].reduce((accumulator, currentObject) => accumulator + currentObject.open_issues, 0);
                this.customTabs.updateCount('prs', this.countPRs);
                // this.prTab.caption = `${this.i18n.get('$pull_requests')} <span style="color: var(--colors-${this.countPRs > 0 ? 'primary' : 'info'}-main)">(${this.countPRs})</span>`;
            }
            else {
                // this.elmPackages.listRepos = [...listPRsFiltered];
                this.elmPackages.listRepos = this.listReposFiltered;
            }
        }
        updateCountPRs(oldNum, newNum) {
            this.countPRs = this.countPRs - oldNum + newNum;
            this.customTabs.updateCount('prs', this.countPRs);
            // this.prTab.caption = `${this.i18n.get('$pull_requests')} <span style="color: var(--colors-${this.countPRs > 0 ? 'primary' : 'info'}-main)">(${this.countPRs})</span>`;
        }
        updateUI() {
            if (!this.tabs)
                return;
            this.tabs.visible = this.isProject;
            this.pnlPackages.visible = !this.isProject;
            if (!this.isProject) {
                this.elmPackages.getAllRepos = () => this.getAllRepos();
            }
            else {
                this.elmList.getAllRepos = () => this.getAllRepos();
                this.elmList.updateCountPRs = (oldNum, newNum) => this.updateCountPRs(oldNum, newNum);
                this.elmPRs.getAllRepos = () => this.getAllRepos();
                this.elmPRs.updateCountPRs = (oldNum, newNum) => this.updateCountPRs(oldNum, newNum);
            }
        }
        async renderUI() {
            const isAuditor = await (0, API_2.isActiveAuditor)();
            const isPackagesPage = window.location.hash.startsWith("#/packages");
            let isGithubOwner = false;
            if (isPackagesPage) {
                isGithubOwner = await (0, API_2.checkGithubOwner)();
            }
            this.updateUI();
            this.pnlLoader.visible = true;
            this.pnlPackages.visible = false;
            this.tabs.visible = false;
            this.userInfo = await (0, API_2.getGithubUser)();
            this.elmPackages.isGithubOwner = isGithubOwner;
            this.elmPackages.isAuditPR = isAuditor;
            this.elmList.isAuditPR = isAuditor;
            this.elmPRs.isAuditPR = isAuditor;
            this.elmList.isProjectOwner = this.isProjectOwner;
            this.elmPRs.isProjectOwner = this.isProjectOwner;
            this.elmPackages.userInfo = this.userInfo;
            this.elmList.userInfo = this.userInfo;
            this.elmPRs.userInfo = this.userInfo;
            this.elmPackages.projectId = this.projectId;
            this.elmList.projectId = this.projectId;
            this.elmPRs.projectId = this.projectId;
            this.elmPackages.guid = this.guid;
            this.elmList.guid = this.guid;
            this.elmPRs.guid = this.guid;
            if (!this.isProject || (this.isProject && this.prefix)) {
                await this.getAllRepos();
            }
            this.tabs.visible = this.isProject;
            this.pnlPackages.visible = !this.isProject;
            this.pnlLoader.visible = false;
            this.customTabs.setData({
                items: [
                    { tag: 'all', caption: this.i18n.get('$all') },
                    { tag: 'prs', caption: this.i18n.get('$pull_requests') }
                ]
            });
        }
        onTabClick(target) {
            this.elmList.visible = target.tag === 'all';
            this.elmPRs.visible = target.tag === 'prs';
        }
        setData(data) {
            this._data = data;
            this.renderUI();
        }
        onShow(options) {
            const query = window.location.hash.split('?')[1];
            const redirect = new URLSearchParams(query).get('redirect');
            if (redirect)
                this.elmPackages.onShow({ redirect });
            else
                this.renderUI();
        }
        onHide() {
            if (this.elmList)
                this.elmList.onHide();
            if (this.elmPRs)
                this.elmPRs.onHide();
            if (this.elmPackages)
                this.elmPackages.onHide();
        }
        init() {
            this.i18n.init({ ...index_10.repoJson });
            super.init();
            this.isProject = this.getAttribute('isProject', true);
            this.isProjectOwner = this.getAttribute('isProjectOwner', true);
            this.prefix = this.getAttribute('prefix', true);
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%", margin: { left: 'auto', right: 'auto' }, background: { color: Theme.background.main }, class: index_css_5.githubStyle },
                this.$render("i-vstack", { id: "pnlLoader", position: "absolute", width: "100%", height: "100%", minHeight: 400, horizontalAlignment: "center", verticalAlignment: "center", background: { color: Theme.background.main }, padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                    this.$render("i-panel", { class: index_css_5.spinnerStyle })),
                this.$render("i-panel", { id: "pnlPackages", visible: false, width: "100%", height: "100%" },
                    this.$render("i-scom-widget-repos--github-list", { id: "elmPackages" })),
                this.$render("i-vstack", { id: "tabs", visible: false, width: "100%", maxHeight: '33rem', position: "relative", zIndex: 0 },
                    this.$render("i-scom-widget-repos--tabs", { id: "customTabs", width: "100%", display: "flex", onChanged: this.onTabClick, class: index_css_5.stickyStyle }),
                    this.$render("i-panel", { minHeight: 60, maxHeight: '30rem', overflow: 'auto', padding: { bottom: '1rem' }, class: index_css_5.wrapperStyle },
                        this.$render("i-scom-widget-repos--github-list", { id: "elmList", isProject: true }),
                        this.$render("i-scom-widget-repos--github-list", { id: "elmPRs", visible: false })))));
        }
    };
    ScomWidgetReposGithub = __decorate([
        (0, components_10.customElements)('i-scom-widget-repos--github')
    ], ScomWidgetReposGithub);
    exports.ScomWidgetReposGithub = ScomWidgetReposGithub;
});
define("@scom/scom-widget-repos/components/audit_report/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_11.Styles.Theme.ThemeVars;
    exports.default = components_11.Styles.style({
        '$nest': {
            '&::-webkit-scrollbar-track': {
                borderRadius: '12px',
                border: '1px solid transparent',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '12px',
                background: '#34343A 0% 0% no-repeat padding-box'
            },
            'i-checkbox label': {
                padding: '5px 20px',
                width: '100%',
                height: '100% !important'
            },
            'i-input textarea': {
                background: 'transparent',
                color: Theme.text.primary,
                border: 0,
                fontFamily: Theme.typography.fontFamily,
                fontSize: Theme.typography.fontSize
            }
        },
    });
});
define("@scom/scom-widget-repos/components/audit_report/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checklistItems = void 0;
    ///<amd-module name='@scom/scom-widget-repos/components/audit_report/data.json.ts'/> 
    exports.checklistItems = [
        'Does the DApp contain any approach that tries to by-pass Secure Compute protocol?',
        'Does the DApp use any external library?',
        'Does the DApp contain any hard-coded wallet address?',
        'Does the DApp contain any hard-coded smart contract address?',
        'Does the DApp contain any private key?',
        'Does the DApp contain any smart contract that is not registered in the SC-Registry?',
        'Does the smart contract that is registered in the SC-Registry not open source?',
        'Does the DApp register an excessive amount of whitelisted smart contracts (i.e. registered in SC-Registry but not interact in codebase)?'
    ];
});
define("@scom/scom-widget-repos/components/audit_report/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-widget-repos/components/audit_report/index.css.ts", "@scom/scom-widget-repos/components/audit_report/data.json.ts", "@ijstech/eth-wallet", "@scom/scom-widget-repos/utils/index.ts", "@scom/scom-widget-repos/interface.ts", "@scom/scom-widget-repos/languages/index.ts"], function (require, exports, components_12, index_css_6, data_json_1, eth_wallet_5, index_11, interface_3, index_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetReposAuditReport = void 0;
    const Theme = components_12.Styles.Theme.ThemeVars;
    var ReportStatus;
    (function (ReportStatus) {
        ReportStatus[ReportStatus["EDIT"] = 0] = "EDIT";
        ReportStatus[ReportStatus["REVIEW"] = 1] = "REVIEW";
        ReportStatus[ReportStatus["POPUP"] = 2] = "POPUP";
    })(ReportStatus || (ReportStatus = {}));
    ;
    let ScomWidgetReposAuditReport = class ScomWidgetReposAuditReport extends components_12.Module {
        constructor(parent, options) {
            super(parent, options);
            this.mergeInfo = {};
            this.auditReportInfo = {};
            this.getPackageFiles = async () => {
                const res = await (0, index_11.getAllFiles)(this.commitGuid);
                if (res?.files) {
                    const files = res.files;
                    return files;
                }
                return false;
            };
            this.submitAuditReport = async () => {
                this.btnSubmit.rightIcon.visible = true;
                if (!this.isAuditPR) {
                    let auditInfo = await (0, index_11.getAuditInfo)(this.commitGuid);
                    if (auditInfo.auditStatus !== interface_3.PackageStatus.AUDITING) {
                        this.setMessage({
                            status: 'error',
                            content: '$not_under_auditing'
                        });
                        this.mdAlert.showModal();
                        this.btnSubmit.rightIcon.visible = false;
                        return;
                    }
                }
                this.setMessage({
                    status: 'loading',
                    content: '$uploading_audit_report_to_ipfs',
                });
                this.mdAlert.showModal();
                const resultInfo = { ...this.auditReportInfo };
                const { packageOwner, packageName } = resultInfo;
                const { number, commit_sha, created_at } = this.mergeInfo;
                const reportFileName = this.isAuditPR ? `Audit-Report-PR-${packageOwner}-${packageName}-${number}-${commit_sha}.md` : `Audit-Report-${this.commitGuid}.md`;
                const ipfsReportCid = await (0, index_11.uploadDataToIpfs)(JSON.stringify(resultInfo), reportFileName);
                if (ipfsReportCid) {
                    // Upload all files to ipfs
                    let ipfsCid = '';
                    /*if (this.auditReportInfo.result === PackageStatus.AUDIT_PASSED) {
                        this.setMessage({
                            status: 'warning',
                            content: 'Uploading source code to IPFS'
                        }
                        this.mdAlert.showModal();
                        const files = await this.getPackageFiles();
                        if (!files) {
                            this.setMessage({
                                status: 'error',
                                content: 'Cannot fetch source code'
                            }
                            this.mdAlert.showModal();
                            this.btnSubmit.rightIcon.visible = false;
                            return;
                        }
                        ipfsCid = await uploadDataToIpfs(JSON.stringify(files), `Source-Code-${this.commitGuid}.md`);
                        if (!ipfsCid) {
                            this.setMessage({
                                status: 'error',
                                content: 'Failed to upload data to IPFS.'
                            }
                            this.mdAlert.showModal();
                            this.btnSubmit.rightIcon.visible = false;
                            return;
                        }
                    }*/
                    this.setMessage({
                        status: 'warning',
                        content: '$auditing'
                    });
                    this.mdAlert.showModal();
                    let res;
                    if (this.isAuditPR) {
                        res = await (0, index_11.auditPR)(packageOwner, packageName, number, commit_sha, ipfsReportCid, ipfsCid, this.auditReportInfo.result);
                        if (res?.success) {
                            this.setMessage({
                                status: 'success',
                                content: '$audit_successfully',
                                onClose: () => {
                                    window.history.back();
                                }
                            });
                            this.mdAlert.showModal();
                            this.btnSubmit.rightIcon.visible = false;
                        }
                        else {
                            this.setMessage({
                                status: 'error',
                                content: res?.error?.message || '$failed_to_audit'
                            });
                            this.mdAlert.showModal();
                            this.btnSubmit.rightIcon.visible = false;
                        }
                    }
                    else {
                        const callback = async (err, receipt) => {
                            if (err) {
                                this.setMessage({
                                    status: 'error',
                                    content: (0, index_11.parseContractError)(err.message)
                                });
                                this.mdAlert.showModal();
                            }
                            else if (receipt) {
                                this.setMessage({
                                    status: 'success',
                                    title: '$transaction_submitted',
                                    link: {
                                        caption: receipt,
                                        href: (0, index_11.getExplorerTxUrl)(receipt)
                                    }
                                });
                                this.mdAlert.showModal();
                            }
                        };
                        const confirmationCallback = async (receipt) => {
                            const { commitGuid, projectGuid, result } = this.auditReportInfo;
                            let data = {
                                commitGuid,
                                projectGuid,
                                ipfsReportCid,
                                ipfsCid,
                                auditStatus: result
                            };
                            res = await (0, index_11.auditCommit)(data);
                            if (res?.success) {
                                this.setMessage({
                                    status: 'success',
                                    content: '$audit_successfully',
                                    onClose: () => {
                                        window.location.assign("#/audit-commit");
                                    }
                                });
                                this.mdAlert.showModal();
                                this.btnSubmit.rightIcon.visible = false;
                            }
                            else {
                                this.setMessage({
                                    status: 'error',
                                    content: res?.error?.message || '$failed_to_audit'
                                });
                                this.mdAlert.showModal();
                                this.btnSubmit.rightIcon.visible = false;
                            }
                        };
                        await (0, index_11.auditPackageVersion)(this.auditReportInfo.packageVersionId, this.auditReportInfo.result === interface_3.PackageStatus.AUDIT_PASSED, ipfsReportCid, callback, confirmationCallback);
                    }
                }
                else {
                    this.setMessage({
                        status: 'error',
                        content: '$failed_to_upload_data_to_ipfs'
                    });
                    this.mdAlert.showModal();
                    this.btnSubmit.rightIcon.visible = false;
                }
            };
            this.$eventBus = components_12.application.EventBus;
        }
        get isAuditPR() {
            return !!this.prInfo;
        }
        get isPopUp() {
            return this._isPopUp;
        }
        set isPopUp(value) {
            this._isPopUp = value;
        }
        get prInfo() {
            return this._prInfo;
        }
        set prInfo(value) {
            this._prInfo = value;
            if (value)
                this.onSetupPage(true);
        }
        get commitGuid() {
            return this._commitGuid;
        }
        set commitGuid(value) {
            if (value === this._commitGuid)
                return;
            this._commitGuid = value;
            if (value)
                this.onSetupPage();
        }
        async init() {
            const i18nData = {};
            for (const key in index_12.auditJson) {
                i18nData[key] = { ...(index_12.auditJson[key] || {}), ...(index_12.mainJson[key] || {}) };
            }
            this.i18n.init({ ...i18nData });
            this.classList.add(index_css_6.default);
            this.isPopUp = this.getAttribute("isPopUp") || "";
            super.init();
        }
        async onSetupPage(isPR) {
            this.mdLoading.visible = true;
            if (isPR) {
                await this.fetchAuditPR();
            }
            else {
                await this.fetchAuditPackage();
            }
            if (!isPR && !this.auditReportInfo.auditStatus) {
                this.setMessage({
                    status: 'error',
                    content: '$invalid_commit_audit_report_not_found',
                    onClose: () => {
                        window.location.assign("#/audit-commit");
                    }
                });
                this.mdAlert.showModal();
                this.mdLoading.visible = false;
                return;
            }
            this.aduitComment.value = this.auditReportInfo.comment || '';
            this.initReportState();
            this.renderCompanyInfo();
            this.renderChecklist();
            this.pageChangeState();
            this.mdLoading.visible = false;
        }
        async fetchAuditPR() {
            const { owner, repo, prNumber, mergeId } = this.prInfo;
            if (mergeId) {
                const result = await (0, index_11.getAuditPRReportInfo)(mergeId);
                if (result) {
                    this.auditReportInfo = result;
                    return;
                }
            }
            const result = await (0, index_11.getPull)(owner, repo, prNumber);
            if (result?.data) {
                this.mergeInfo = result.data;
                const { number, title, base, commit_sha } = result.data;
                this.auditReportInfo.packageName = repo;
                this.auditReportInfo.packageOwner = base.base_login;
                this.auditReportInfo.mergeNumber = number;
                this.auditReportInfo.mergeTitle = title;
                this.auditReportInfo.mergeSha = commit_sha;
            }
            else {
                this.setMessage({
                    status: 'error',
                    content: '$cannot_fetch_pull_request_info',
                    onClose: () => {
                        window.location.assign("#/review-pr");
                    }
                });
                this.mdAlert.showModal();
                this.mdLoading.visible = false;
                return;
            }
            if (!this.auditReportInfo.checklist || !this.auditReportInfo.checklist.length) {
                this.auditReportInfo.checklist = new Array(data_json_1.checklistItems.length).fill(null).map(() => ({ checked: false, comment: "" }));
            }
        }
        async fetchAuditPackage() {
            this.auditReportInfo = await (0, index_11.getAuditReportInfo)(this.commitGuid);
            if (!this.auditReportInfo.checklist || !this.auditReportInfo.checklist.length) {
                this.auditReportInfo.checklist = new Array(data_json_1.checklistItems.length).fill(null).map(() => ({ checked: false, comment: "" }));
            }
        }
        initReportState() {
            if (this.isPopUp == true) {
                this.reportStatus = ReportStatus.POPUP;
            }
            else {
                this.reportStatus = (this.auditReportInfo.auditStatus && this.auditReportInfo.auditStatus !== interface_3.PackageStatus.AUDITING) ? ReportStatus.REVIEW : ReportStatus.EDIT;
            }
        }
        renderCompanyInfo() {
            this.hStackProjectName.visible = !this.isAuditPR;
            this.DAppName.caption = this.auditReportInfo.packageName;
            this.DAppVersion.caption = this.auditReportInfo.version;
            if (!this.isAuditPR) {
                this.imgLogo.url = this.auditReportInfo.imgUrl;
                this.lblProjectName.caption = this.auditReportInfo.projectName;
                this.lblProjectName.link.href = this.auditReportInfo.projectId === undefined || this.auditReportInfo.projectId === null ? "" : `#/projects/${this.auditReportInfo.projectId}`;
                this.lbPRTitle.caption = `${this.i18n.get('$title')}: ${this.auditReportInfo.message}`;
                this.lbPRSha.caption = `${this.i18n.get('$commit_id_sha')}: ${this.auditReportInfo.commitId}`;
                this.lbPRNumber.caption = '';
            }
            else {
                this.lbPRTitle.caption = this.auditReportInfo.mergeTitle;
                this.lbPRNumber.caption = this.i18n.get('$opened_by', {
                    qty: `${this.auditReportInfo.mergeNumber ?? ''}`,
                    date: (0, index_11.getTimeAgo)(this.mergeInfo.created_at, this.i18n),
                    by: this.mergeInfo.user_login
                });
                this.lbPRSha.caption = `${this.i18n.get('$merge_sha')}: ${this.auditReportInfo.mergeSha || this.mergeInfo.commit_sha}`;
            }
        }
        guidelineMsgDisable() {
            this.guidelineMsg.visible = false;
        }
        saveCheckBoxValue(control, i) {
            this.auditReportInfo.checklist[i].checked = control.checked;
        }
        saveInputBoxValue(control, i) {
            this.auditReportInfo.checklist[i].comment = control.value;
        }
        renderChecklist() {
            this.checklist.innerHTML = '';
            let enable;
            if (this.reportStatus == ReportStatus.POPUP || this.reportStatus == ReportStatus.REVIEW) {
                enable = false;
            }
            else {
                enable = true;
            }
            this.checklist.append(this.$render("i-hstack", { height: '3.875rem', verticalAlignment: 'center', horizontalAlignment: 'center', border: { right: { color: '#636363', width: '1px', style: 'solid' } }, background: { color: Theme.colors.primary.main } },
                this.$render("i-label", { caption: '$auditing_checklist' })));
            this.checklist.append(this.$render("i-hstack", { height: '3.875rem', verticalAlignment: 'center', horizontalAlignment: 'center', background: { color: Theme.colors.primary.main } },
                this.$render("i-label", { caption: '$comments' })));
            data_json_1.checklistItems.forEach((item, i) => {
                const placeholder = this.reportStatus === ReportStatus.EDIT ? "$fill_comment_if_fail" : "";
                this.checklist.append(this.$render("i-hstack", { height: '100%', verticalAlignment: 'center', horizontalAlignment: 'start', background: { color: '#34343A' }, border: { color: '#636363', width: '0 1px 1px 0', style: 'solid' } },
                    this.$render("i-checkbox", { opacity: 1, checked: this.auditReportInfo.checklist[i].checked, height: '100%', width: '100%', caption: item, enabled: enable, onChanged: (target) => this.saveCheckBoxValue(target, i) })));
                this.checklist.append(this.$render("i-hstack", { height: '100%', verticalAlignment: 'center', horizontalAlignment: 'center', background: { color: '#34343A' }, border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-input", { opacity: 1, placeholder: placeholder, value: this.auditReportInfo.checklist[i].comment, height: '100%', width: '100%', inputType: 'textarea', enabled: enable, resize: 'auto-grow', onChanged: (target) => this.saveInputBoxValue(target, i) })));
            });
        }
        backBtn() {
            if (this.reportStatus == ReportStatus.REVIEW) {
                this.reportStatus = ReportStatus.EDIT;
                this.pageChangeState();
            }
            else {
                window.history.back();
            }
        }
        setMessage(message) {
            const { status, content, title, link, onClose } = message;
            if (title !== undefined)
                this.mdAlert.title = title;
            if (content !== undefined)
                this.mdAlert.content = content;
            if (status !== undefined)
                this.mdAlert.status = status;
            if (link)
                this.mdAlert.link = link;
            if (typeof onClose === 'function')
                this.mdAlert.onClose = onClose;
        }
        NextOrSubmitBtn() {
            if (this.reportStatus == ReportStatus.EDIT) {
                const missingComment = this.auditReportInfo.checklist.some(item => !item.checked && !item.comment);
                if (missingComment) {
                    this.setMessage({
                        status: 'warning',
                        content: '$you_have_to_add_comment_to_the_failed_checklist_item'
                    });
                    this.mdAlert.showModal();
                    return;
                }
                this.reportStatus = ReportStatus.REVIEW;
                this.auditReportInfo.auditedBy = eth_wallet_5.Wallet.getClientInstance().address;
                this.auditReportInfo.auditDate = Math.floor(Date.now() / 1000);
                const passed = this.auditReportInfo.checklist.every(item => item.checked);
                this.auditReportInfo.result = passed ? interface_3.PackageStatus.AUDIT_PASSED : interface_3.PackageStatus.AUDIT_FAILED;
                this.auditReportInfo.comment = this.aduitComment.value;
                this.pageChangeState();
                window.scrollTo(0, 0);
            }
            else {
                this.submitAuditReport();
            }
        }
        viewCode() {
            if (this.commitGuid) {
                window.open(`#/files-view/${this.commitGuid}`);
            }
            else {
                window.open(this.mergeInfo.html_url, '_blank');
            }
        }
        pageChangeState() {
            if (this.reportStatus == ReportStatus.EDIT) {
                this.btnSubmit.caption = '$next';
                this.btnSubmit.enabled = true;
                this.DAppPanel.visible = true;
                this.aduitComment.enabled = true;
                this.btnPanel.visible = true;
                this.aduitComment.enabled = true;
                this.auditSummaryPanel.visible = false;
            }
            else if (this.reportStatus == ReportStatus.REVIEW) {
                this.btnSubmit.caption = '$sign_and_submit';
                this.btnSubmit.enabled = true;
                this.aduitComment.enabled = false;
                this.DAppPanel.visible = false;
                this.btnPanel.visible = !this.auditReportInfo.auditStatus || this.auditReportInfo.auditStatus === interface_3.PackageStatus.AUDITING;
                this.aduitComment.enabled = false;
                this.renderAuditSummary();
                this.auditSummaryPanel.visible = true;
            }
            else {
                this.btnSubmit.enabled = false;
                this.aduitComment.enabled = false;
                this.DAppPanel.visible = false;
                this.btnPanel.visible = false;
                this.aduitComment.enabled = false;
                this.renderAuditSummary();
                this.auditSummaryPanel.visible = true;
            }
            this.renderChecklist();
        }
        renderAuditSummary() {
            this.auditSummary.innerHTML = '';
            const lastAuditDate = this.auditReportInfo.auditDate ? (0, index_11.formatDate)(this.auditReportInfo.auditDate * 1000, "DD MMM YYYY") : '-';
            const auditor = this.auditReportInfo.auditedBy ? components_12.FormatUtils.truncateWalletAddress(this.auditReportInfo.auditedBy) : '-';
            this.auditSummary.append(this.$render("i-vstack", { width: '100%', verticalAlignment: 'center' },
                !this.isAuditPR ? this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$project_name', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: this.auditReportInfo.projectName ?? "", padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))) : [],
                !this.isAuditPR ? this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$version', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: this.auditReportInfo.version ?? "", padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))) : [],
                !this.isAuditPR ? this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: 'Owner', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: this.auditReportInfo.owner ? components_12.FormatUtils.truncateWalletAddress(this.auditReportInfo.owner) : '-', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))) : [],
                this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$title', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: this.isAuditPR ? this.auditReportInfo.mergeTitle : this.auditReportInfo.message, padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))),
                this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$package_name', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: !this.isAuditPR ? this.auditReportInfo.packageName : this.prInfo.repo, padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))),
                this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$package_owner', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: !this.isAuditPR ? this.auditReportInfo.packageOwner : this.prInfo.owner, padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))),
                this.isAuditPR ? this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$pr_number', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: this.auditReportInfo.mergeNumber ?? this.mergeInfo.number, padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))) : [],
                this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: this.isAuditPR ? '$merge_sha' : '$commit_id_sha', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: this.isAuditPR ? this.auditReportInfo.mergeSha || this.mergeInfo.commit_sha : this.auditReportInfo.commitId, wordBreak: 'break-all', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))),
                !this.isAuditPR ? this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$ipfs_code_source', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: this.auditReportInfo.ipfsCid, class: 'pointer', link: { href: this.auditReportInfo.ipfsCid ? `https://ipfs.io/ipfs/${this.auditReportInfo.ipfsCid}/` : "" }, padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }, font: { color: '#1F86FF' }, wordBreak: "break-all" }))) : [],
                this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$audit_date', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: lastAuditDate, padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))),
                this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$audit_by', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start' },
                        this.$render("i-label", { caption: auditor, padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } }))),
                this.$render("i-hstack", { width: '100%', verticalAlignment: 'center', background: { color: '#34343A' }, height: '3.125rem', horizontalAlignment: 'center', border: { bottom: { color: '#636363', width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', border: { right: { color: '#636363', width: '1px', style: 'solid' } } },
                        this.$render("i-label", { caption: '$audit_result', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } })),
                    this.$render("i-hstack", { height: '100%', width: '50%', verticalAlignment: 'center', horizontalAlignment: 'start', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' } },
                        this.$render("i-label", { id: 'auditResultLabel', padding: { top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }, caption: this.auditReportInfo.result ? 'Pass' : 'Fail', background: { color: this.auditReportInfo.result ? Theme.colors.success.main : Theme.colors.error.main }, border: { radius: '1rem' } })))));
        }
        render() {
            return (this.$render("i-panel", { width: "100%" },
                this.$render("i-vstack", { horizontalAlignment: 'center', width: '100%', padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, gap: '1.875rem' },
                    this.$render("i-grid-layout", { id: 'DAppPanel', width: '100%', maxWidth: '87.5rem', border: { bottom: { color: '#303030', width: '1px', style: 'solid' } }, templateAreas: [['titleArea', 'titleArea', 'titleArea'],
                            ['logoArea', 'DAppNameAndVersionArea', 'btnArea'],
                            ['logoArea', 'ProjectNameArea', 'btnArea']], templateColumns: ['5.625rem', 'auto', 'auto'], templateRows: ['auto', 'auto', 'auto'], mediaQueries: [
                            {
                                maxWidth: '40rem',
                                properties: {
                                    templateAreas: [['titleArea', 'titleArea'],
                                        ['logoArea', 'DAppNameAndVersionArea'],
                                        ['logoArea', 'ProjectNameArea'],
                                        ['btnArea', 'btnArea']],
                                    templateColumns: ['6.25rem', 'auto'],
                                    templateRows: ['auto', 'auto', 'auto', 'auto'],
                                }
                            }
                        ] },
                        this.$render("i-label", { grid: { area: 'titleArea' }, caption: '$audit_procedure', font: { size: '1.25rem', bold: true }, margin: { top: '0.625rem', bottom: '1.25rem' } }),
                        this.$render("i-image", { grid: { area: 'logoArea' }, id: 'imgLogo', height: '4.375rem', width: '4.375rem', margin: { right: '0.625rem' } }),
                        this.$render("i-hstack", { grid: { area: 'DAppNameAndVersionArea' }, verticalAlignment: 'center' },
                            this.$render("i-label", { id: 'DAppName', font: { size: '1.5625rem' }, margin: { right: '1.875rem' } }),
                            this.$render("i-label", { id: 'DAppVersion', font: { size: '1rem' } })),
                        this.$render("i-vstack", { gap: "0.1rem", grid: { area: 'ProjectNameArea' } },
                            this.$render("i-hstack", { id: "hStackProjectName", verticalAlignment: 'center' },
                                this.$render("i-label", { caption: '$by', font: { size: '0.8rem' }, margin: { right: '0.3125rem' } }),
                                this.$render("i-label", { id: 'lblProjectName', font: { size: '0.8rem', color: '#3994FF' } })),
                            this.$render("i-vstack", { id: "vStackPRName", gap: "0.1rem", verticalAlignment: "center", width: "fit-content" },
                                this.$render("i-label", { id: "lbPRTitle", font: { size: '0.8rem' }, margin: { right: '0.3125rem' } }),
                                this.$render("i-label", { id: "lbPRNumber", font: { size: '0.8rem' }, opacity: 0.8 }),
                                this.$render("i-label", { id: "lbPRSha", font: { size: '0.8rem' }, opacity: 0.8 }))),
                        this.$render("i-hstack", { grid: { area: 'btnArea' }, stack: { basis: '50%' }, horizontalAlignment: 'end', gap: "0.625rem" },
                            this.$render("i-button", { font: { size: '0.875rem' }, caption: 'View Code', width: '9rem', height: '2.5rem', border: { radius: '0.5rem' }, padding: { left: '0.625rem', right: '0.625rem', top: '0.3125rem', bottom: '0.3125rem' }, onClick: this.viewCode }))),
                    this.$render("i-vstack", { width: '100%', maxWidth: '1200px' },
                        this.$render("i-hstack", { id: 'guidelineMsg', width: '100%', background: { color: '#34343A' }, padding: { left: '1rem', right: '1rem', top: '0.625rem', bottom: '0.625rem' }, border: { radius: '0.375rem' }, margin: { top: '0.625rem', bottom: '0.625rem' }, visible: !this.isPopUp },
                            this.$render("i-vstack", { stack: { basis: '95%' }, verticalAlignment: 'center' },
                                this.$render("i-label", { caption: '$you_are_going_to_audit_the_dapp_checklist', font: { size: '1rem' } }),
                                this.$render("i-panel", null,
                                    this.$render("i-label", { caption: '$if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline', display: 'inline', font: { size: '1rem' }, margin: { right: '0.3125rem' } }),
                                    this.$render("i-label", { class: 'pointer', display: 'inline', caption: '$here', font: { size: '1rem', color: '#3994FF' } }))),
                            this.$render("i-vstack", { stack: { basis: '5%' }, verticalAlignment: 'center' },
                                this.$render("i-icon", { class: 'pointer', name: 'times-circle', width: '1.125rem', height: '1.125rem', fill: Theme.colors.primary.main, onClick: this.guidelineMsgDisable }))),
                        this.$render("i-vstack", { id: 'auditSummaryPanel', width: '100%' },
                            this.$render("i-label", { caption: '$audit_summary', font: { size: '1rem' }, margin: { top: '0.625rem', bottom: '0.625rem' } }),
                            this.$render("i-hstack", { width: '100%', horizontalAlignment: 'center', margin: { top: '0.625rem' } },
                                this.$render("i-hstack", { id: 'auditSummary', minWidth: '37.5rem' }))),
                        this.$render("i-label", { caption: "$audit_checklist", font: { size: '1rem' }, margin: { top: '1.875rem', bottom: '0.625rem' } }),
                        this.$render("i-grid-layout", { id: 'checklist', margin: { top: '0.625rem', bottom: '0.625rem' }, templateColumns: ['60%', '40%'] }),
                        this.$render("i-label", { caption: '$auditor_comment', font: { size: '1rem' }, margin: { top: '0.625rem', bottom: '0.625rem' } }),
                        this.$render("i-input", { id: 'aduitComment', width: '100%', height: 'auto', rows: 12, inputType: 'textarea', margin: { top: '0.625rem', bottom: '0.625rem' }, background: { color: '#34343A' }, resize: 'auto-grow', opacity: 1 }),
                        this.$render("i-hstack", { id: 'btnPanel', width: '100%', margin: { top: '0.625rem', bottom: '0.625rem' }, visible: false },
                            this.$render("i-hstack", { width: '50%', horizontalAlignment: 'start' },
                                this.$render("i-button", { caption: '$back', font: { size: '0.875rem' }, width: '12.5rem', height: '2.5rem', border: { radius: '0.5rem' }, padding: { left: '1.25rem', right: '1.25rem', top: '0.2125rem', bottom: '0.2125rem' }, background: { color: '#34343A' }, onClick: this.backBtn })),
                            this.$render("i-hstack", { width: '50%', horizontalAlignment: 'end' },
                                this.$render("i-button", { id: 'btnSubmit', caption: "$next", font: { size: '0.875rem' }, width: '12.5rem', height: '2.5rem', border: { radius: '0.5rem' }, enabled: false, padding: { left: '1.25rem', right: '1.25rem', top: '0.2125rem', bottom: '0.2125rem' }, background: { color: Theme.colors.primary.main }, onClick: this.NextOrSubmitBtn, rightIcon: { spin: true, visible: false } }))))),
                this.$render("i-modal", { id: 'mdLoading', width: "7.8125rem", minWidth: "125px", closeOnBackdropClick: false },
                    this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: "center", border: { radius: '0.25rem' }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                        this.$render("i-icon", { name: "spinner", spin: true, width: "2.25rem", height: "2.25rem", fill: Theme.text.primary }),
                        this.$render("i-label", { caption: "$loading", font: { size: '1.5em' }, class: "i-loading-spinner_text" }))),
                this.$render("i-alert", { id: "mdAlert" })));
        }
    };
    ScomWidgetReposAuditReport = __decorate([
        (0, components_12.customElements)('i-scom-widget-repos--audit-report')
    ], ScomWidgetReposAuditReport);
    exports.ScomWidgetReposAuditReport = ScomWidgetReposAuditReport;
});
define("@scom/scom-widget-repos/components/index.ts", ["require", "exports", "@scom/scom-widget-repos/components/github/index.tsx", "@scom/scom-widget-repos/components/audit_report/index.tsx", "@scom/scom-widget-repos/components/tabs/index.tsx", "@scom/scom-widget-repos/components/deployer.tsx"], function (require, exports, index_13, index_14, index_15, deployer_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetReposDeployer = exports.ScomWidgetReposTabs = exports.ScomWidgetReposAuditReport = exports.ScomWidgetReposCreateRepo = exports.ScomWidgetReposGithub = void 0;
    Object.defineProperty(exports, "ScomWidgetReposGithub", { enumerable: true, get: function () { return index_13.ScomWidgetReposGithub; } });
    Object.defineProperty(exports, "ScomWidgetReposCreateRepo", { enumerable: true, get: function () { return index_13.ScomWidgetReposCreateRepo; } });
    Object.defineProperty(exports, "ScomWidgetReposAuditReport", { enumerable: true, get: function () { return index_14.ScomWidgetReposAuditReport; } });
    Object.defineProperty(exports, "ScomWidgetReposTabs", { enumerable: true, get: function () { return index_15.ScomWidgetReposTabs; } });
    Object.defineProperty(exports, "ScomWidgetReposDeployer", { enumerable: true, get: function () { return deployer_2.ScomWidgetReposDeployer; } });
});
define("@scom/scom-widget-repos/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.searchPanelStyle = void 0;
    const Theme = components_13.Styles.Theme.ThemeVars;
    exports.searchPanelStyle = components_13.Styles.style({
        position: 'sticky',
        top: 0,
        zIndex: 1,
        $nest: {
            'input': {
                width: '100% !important',
                padding: '0.25rem 1rem 0.25rem 2.5rem'
            },
            'i-combo-box .selection': {
                border: 0
            },
            'i-combo-box > .icon-btn': {
                border: 0
            }
        }
    });
});
define("@scom/scom-widget-repos", ["require", "exports", "@ijstech/components", "@scom/scom-widget-repos/components/index.ts", "@scom/scom-widget-repos/index.css.ts", "@scom/scom-widget-repos/store/index.ts", "@scom/scom-widget-repos/languages/index.ts", "@scom/scom-widget-repos/utils/index.ts"], function (require, exports, components_14, index_16, index_css_7, index_17, index_18, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomWidgetRepos = void 0;
    const Theme = components_14.Styles.Theme.ThemeVars;
    components_14.Styles.Theme.applyTheme(components_14.Styles.Theme.darkTheme);
    let ScomWidgetRepos = class ScomWidgetRepos extends components_14.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = {};
            this.timer = null;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get contractInfo() {
            return this._data?.contractInfo;
        }
        set contractInfo(value) {
            this._data.contractInfo = value;
        }
        get guid() {
            return this._data.guid;
        }
        set guid(value) {
            this._data.guid = value;
        }
        set projectId(value) {
            this._data.projectId = value;
        }
        get projectId() {
            return this._data.projectId;
        }
        get isProject() {
            return this._data.isProject;
        }
        set isProject(value) {
            this._data.isProject = value;
        }
        get isProjectOwner() {
            return this._data.isProjectOwner;
        }
        set isProjectOwner(value) {
            this._data.isProjectOwner = value;
        }
        get prefix() {
            return this._data.prefix;
        }
        set prefix(value) {
            this._data.prefix = value;
        }
        async setData(value) {
            this._data = value;
            (0, index_17.setContractInfoByChain)(this.contractInfo);
            (0, index_17.setTransportEndpoint)(this._data.transportEndpoint);
            (0, index_17.setScomCid)(this._data.scomCid);
            if (this._data.transportEndpoint) {
                (0, index_17.setStorageConfig)({
                    transportEndpoint: this._data.transportEndpoint,
                    signer: this._data.signer,
                    baseUrl: this._data.baseUrl
                });
            }
            (0, utils_2.getPackages)();
            this.renderUI();
        }
        renderUI() {
            this.githubElm.setData({
                guid: this.guid,
                isProject: this.isProject,
                isProjectOwner: this.isProjectOwner,
                prefix: this.prefix
            });
        }
        onRepoSearch(target) {
            if (this.timer)
                clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.githubElm.searchName = target.value;
            }, 500);
        }
        async onCreateRepoClick() {
            if (!this.createRepoElm) {
                this.createRepoElm = new index_16.ScomWidgetReposCreateRepo(undefined, {
                    id: this.guid,
                    prefix: this.prefix
                });
                this.createRepoElm.onClosed = () => this.createRepoElm.closeModal();
            }
            else if (this.guid || this.prefix) {
                await this.createRepoElm.setData({ id: this.guid, prefix: this.prefix });
            }
            this.createRepoElm.openModal({
                width: 600,
                maxWidth: '100%',
                closeOnBackdropClick: false,
                padding: { top: '0.5rem', right: '0.5rem', bottom: 0, left: '0.5rem' }
            });
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.githubElm) {
                this.githubElm.onHide();
            }
        }
        onShow(options) {
            if (this.githubElm)
                this.githubElm.onShow();
        }
        onHide() {
            if (this.githubElm) {
                this.githubElm.onHide();
            }
        }
        async init() {
            this.i18n.init({ ...index_18.mainJson });
            super.init();
            const contractInfo = this.getAttribute('contractInfo', true);
            const prefix = this.getAttribute('prefix', true);
            const isProject = this.getAttribute('isProject', true);
            const isProjectOwner = this.getAttribute('isProjectOwner', true);
            const guid = this.getAttribute('guid', true);
            const projectId = this.getAttribute('projectId', true);
            const transportEndpoint = this.getAttribute('transportEndpoint', true);
            const signer = this.getAttribute('signer', true);
            const baseUrl = this.getAttribute('baseUrl', true);
            // this.setData({ guid, prefix, isProject, projectId, isProjectOwner, contractInfo, transportEndpoint, signer, baseUrl });
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%", background: { color: Theme.background.main } },
                this.$render("i-hstack", { class: index_css_7.searchPanelStyle, verticalAlignment: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, gap: "0.5rem", wrap: "wrap" },
                    this.$render("i-panel", { stack: { grow: '1' } },
                        this.$render("i-hstack", { position: "absolute", height: "100%", verticalAlignment: "center", padding: { left: '1rem' } },
                            this.$render("i-icon", { width: 14, height: 14, name: "search", fill: Theme.input.fontColor })),
                        this.$render("i-input", { id: "edtSearchRepo", width: "100%", height: 40, border: { width: 1, style: 'solid', color: Theme.divider, radius: 8 }, placeholder: "$search_repositories", onChanged: this.onRepoSearch })),
                    this.$render("i-button", { id: "btnCreateRepo", height: 40, caption: "$create_repository", padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, border: { radius: 8 }, font: { color: Theme.colors.primary.contrastText }, background: { color: '#17a2b8' }, icon: { name: 'plus' }, visible: false, onClick: this.onCreateRepoClick })),
                this.$render("i-panel", { width: "100%" },
                    this.$render("i-vstack", { width: "100%", gap: "1.5rem", margin: { bottom: '1.5rem' } },
                        this.$render("i-scom-widget-repos--github", { id: "githubElm" })))));
        }
    };
    ScomWidgetRepos = __decorate([
        (0, components_14.customElements)("i-scom-widget-repos")
    ], ScomWidgetRepos);
    exports.ScomWidgetRepos = ScomWidgetRepos;
});

/// <amd-module name="@scom/scom-widget-repos/interface.ts" />
declare module "@scom/scom-widget-repos/interface.ts" {
    export type ActionType = 'ViewRecord' | 'SubmitReport' | 'StartAudit';
    export enum PackageStatus {
        AUDITING = "pending",
        AUDIT_PASSED = "passed",
        AUDIT_FAILED = "failed"
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
    export type ContractInfoByChainType = {
        [key: number]: IContractInfo;
    };
    export enum AuditResult {
        FAILED = 0,
        WARNING = 1,
        PASSED = 2
    }
    export enum AuditorStatus {
        Inactive = 0,
        Active = 1,
        Freezed = 2,
        Super = 3
    }
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
}
/// <amd-module name="@scom/scom-widget-repos/store/index.ts" />
declare module "@scom/scom-widget-repos/store/index.ts" {
    import { IContractInfo } from "@scom/scom-widget-repos/interface.ts";
    export const getContractInfoByChain: () => {};
    export const setContractInfoByChain: (value: Record<string, IContractInfo>) => void;
    export const getContractAddress: (type: keyof IContractInfo, chainId?: number) => Promise<string>;
    export const getContractInfo: (chainId: number) => Promise<IContractInfo>;
    export const setTransportEndpoint: (transportEndpoint: string) => void;
    export const getTransportEndpoint: () => string;
    export const isLoggedIn: () => any;
    export const setStorageConfig: (config: any) => void;
    export const getStorageConfig: () => {};
    export const setScomCid: (scomCid: string) => void;
    export const getScomCid: () => string;
}
/// <amd-module name="@scom/scom-widget-repos/utils/API.ts" />
declare module "@scom/scom-widget-repos/utils/API.ts" {
    import { ISendTxEventsOptions } from "@ijstech/eth-wallet";
    import { IAuditInfo, IAuditReportInfo, ICommit, IProject, IRouterResult, ISemanticVersion } from "@scom/scom-widget-repos/interface.ts";
    const checkGithubOwner: () => Promise<any>;
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
    const getGithubUser: () => Promise<any>;
    const getAllRepos: (owner?: string, prefix?: string, withPRs?: boolean) => Promise<any>;
    const isActiveAuditor: () => Promise<boolean>;
    const getAuditInfo: (commitGuid: string) => Promise<IAuditInfo>;
    const getAuditReportInfo: (commitGuid: string) => Promise<IAuditReportInfo>;
    const getAuditReportResult: (commitGuid: string, auditInfo?: IAuditInfo) => Promise<IAuditReportInfo>;
    const getAuditPRList: (packageName: string) => Promise<any>;
    const auditCommit: (data: any) => Promise<any>;
    const uploadDataToIpfs: (data: string, fileName: string) => Promise<string>;
    const getAllFiles: (commitGuid: string) => Promise<any>;
    const getPull: (owner: string, repo: string, prNumber: string | number) => Promise<any>;
    const getAllPulls: (owner: string, repo: string) => Promise<any>;
    const auditPR: (packageOwner: string, packageName: string, mergeNumber: number, mergeSHA: string, ipfsReportCid: string, ipfsCid: string, auditStatus: string) => Promise<any>;
    const getAuditPRReportInfo: (mergeId: string) => Promise<IAuditReportInfo>;
    const auditPackageVersion: (packageVersionId: number, pass: boolean, reportCid: string, callback?: any, confirmationCallback?: any) => Promise<any>;
    const createNewPackage: (projectId: number, name: string, ipfsCid: string, category: string, callback?: any, confirmationCallback?: any) => Promise<{
        packageId: any;
        receipt: any;
    }>;
    const createNewPackageVersion: (projectId: number, packageId: number, version: ISemanticVersion, ipfsCid: string, callback?: any, confirmationCallback?: any) => Promise<{
        receipt: any;
        packageVersionId: any;
    }>;
    const getCommits: (offset: number, limit: number, filter?: {
        [key: string]: string;
    }) => Promise<{
        total: number;
        list: ICommit[];
    }>;
    const getMergeMsg: (guid: string, repoOwner: string, repoName: string) => Promise<IRouterResult>;
    const getPackageByNames: (packageOwner: string, packageName: string) => Promise<any>;
    const mergePR: (address: string, signature: string, owner: string, repo: string, prNumber: number) => Promise<any>;
    const requestAuditCommit: (commitGuid: string, projectGuid: string, projectId: number, packageId: number, packageVersionId: number, version: string, commitId: string, status: boolean) => Promise<IRouterResult>;
    const syncCommits: (owner: string, repo: string) => Promise<any>;
    const updatePackageVersionIpfsCid: (packageVersionId: number, packageId: number, ipfsCid: string, callback?: any, confirmationCallback?: any) => Promise<any>;
    const updatePackageVersionToAuditing: (packageVersionId: number, callback?: any, confirmationCallback?: any) => Promise<any>;
    const createRepo: (params: {
        name: string;
        description?: string;
        private?: boolean;
    }) => Promise<any>;
    const getProject: (guid: string) => Promise<IProject | undefined>;
    export { checkGithubOwner, getAllRepos, getGithubUser, isActiveAuditor, getAuditInfo, getAuditReportResult, getAuditReportInfo, getAuditPRList, getAuditPRReportInfo, auditCommit, uploadDataToIpfs, getAllFiles, getPull, getAllPulls, auditPR, auditPackageVersion, createNewPackage, createNewPackageVersion, getCommits, getMergeMsg, mergePR, getPackageByNames, requestAuditCommit, syncCommits, updatePackageVersionIpfsCid, updatePackageVersionToAuditing, createRepo, getProject };
}
/// <amd-module name="@scom/scom-widget-repos/components/github/index.css.ts" />
declare module "@scom/scom-widget-repos/components/github/index.css.ts" {
    export const githubStyle: string;
    export const spinnerStyle: string;
    export const modalStyle: string;
    export const inputStyle: string;
    export const textareaStyle: string;
    export const inputDateStyle: string;
    export const tabStyle: string;
    export const childTabStyle: string;
    export const stickyStyle: string;
    export const wrapperStyle: string;
    export const customModalStyle: string;
}
/// <amd-module name="@scom/scom-widget-repos/utils/storage.ts" />
declare module "@scom/scom-widget-repos/utils/storage.ts" {
    const getPackages: () => Promise<void>;
    const getPackage: (name: string) => Promise<string>;
    export { getPackages, getPackage };
}
/// <amd-module name="@scom/scom-widget-repos/utils/index.ts" />
declare module "@scom/scom-widget-repos/utils/index.ts" {
    import { I18n } from '@ijstech/components';
    export * from "@scom/scom-widget-repos/utils/API.ts";
    export * from "@scom/scom-widget-repos/utils/storage.ts";
    const formatDate: (date: string | number, customType?: string) => string;
    const getTimeAgo: (timestamp: string, i18n: I18n) => string;
    const getExplorerTxUrl: (txHash: string, chainId?: number) => string;
    const parseContractError: (message: string) => string;
    const compareVersions: (firstVer: string, secondVer: string) => boolean;
    export { formatDate, getTimeAgo, getExplorerTxUrl, parseContractError, compareVersions };
}
/// <amd-module name="@scom/scom-widget-repos/languages/main.json.ts" />
declare module "@scom/scom-widget-repos/languages/main.json.ts" {
    const _default: {
        en: {
            create_repository: string;
            day_ago: string;
            days_ago: string;
            failed_to_upload_data_to_ipfs: string;
            hour_ago: string;
            hours_ago: string;
            just_now: string;
            minute_ago: string;
            minutes_ago: string;
            month_ago: string;
            months_ago: string;
            opened_by: string;
            pull_requests: string;
            search_repositories: string;
            transaction_submitted: string;
            year_ago: string;
            years_ago: string;
        };
        "zh-hant": {
            create_repository: string;
            day_ago: string;
            days_ago: string;
            failed_to_upload_data_to_ipfs: string;
            hour_ago: string;
            hours_ago: string;
            just_now: string;
            minute_ago: string;
            minutes_ago: string;
            month_ago: string;
            months_ago: string;
            opened_by: string;
            pull_requests: string;
            search_repositories: string;
            transaction_submitted: string;
            year_ago: string;
            years_ago: string;
        };
        vi: {
            create_repository: string;
            day_ago: string;
            days_ago: string;
            failed_to_upload_data_to_ipfs: string;
            hour_ago: string;
            hours_ago: string;
            just_now: string;
            minute_ago: string;
            minutes_ago: string;
            month_ago: string;
            months_ago: string;
            opened_by: string;
            pull_requests: string;
            search_repositories: string;
            transaction_submitted: string;
            year_ago: string;
            years_ago: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-widget-repos/languages/audit.json.ts" />
declare module "@scom/scom-widget-repos/languages/audit.json.ts" {
    const _default_1: {
        en: {
            all: string;
            audit_by: string;
            audit_checklist: string;
            audit_date: string;
            audit_procedure: string;
            audit_result: string;
            audit_successfully: string;
            audit_summary: string;
            auditing_checklist: string;
            auditing: string;
            auditor_comment: string;
            back: string;
            by_key: string;
            cannot_fetch_pull_request_info: string;
            checklist_item: string;
            checklist: string;
            comments: string;
            commit_id_sha: string;
            failed_to_audit: string;
            fill_comment_if_fail: string;
            here: string;
            if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline: string;
            invalid_commit_audit_report_not_found: string;
            ipfs_code_source: string;
            loading: string;
            merge_sha: string;
            next: string;
            not_under_auditing: string;
            owner: string;
            package_name: string;
            package_owner: string;
            pr_number: string;
            project_name: string;
            sign_and_submit: string;
            submit: string;
            title: string;
            uploading_audit_report_to_ipfs: string;
            version: string;
            view_code: string;
            you_are_going_to_audit_the_dapp_checklist: string;
            you_have_to_add_comment_to_the_failed_checklist_item: string;
        };
        "zh-hant": {
            all: string;
            audit_by: string;
            audit_checklist: string;
            audit_date: string;
            audit_procedure: string;
            audit_result: string;
            audit_successfully: string;
            audit_summary: string;
            auditing_checklist: string;
            auditing: string;
            auditor_comment: string;
            back: string;
            by_key: string;
            cannot_fetch_pull_request_info: string;
            checklist_item: string;
            checklist: string;
            comments: string;
            commit_id_sha: string;
            failed_to_audit: string;
            fill_comment_if_fail: string;
            here: string;
            if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline: string;
            invalid_commit_audit_report_not_found: string;
            ipfs_code_source: string;
            loading: string;
            merge_sha: string;
            next: string;
            not_under_auditing: string;
            owner: string;
            package_name: string;
            package_owner: string;
            pr_number: string;
            project_name: string;
            sign_and_submit: string;
            submit: string;
            title: string;
            uploading_audit_report_to_ipfs: string;
            version: string;
            view_code: string;
            you_are_going_to_audit_the_dapp_checklist: string;
            you_have_to_add_comment_to_the_failed_checklist_item: string;
        };
        vi: {
            all: string;
            audit_by: string;
            audit_checklist: string;
            audit_date: string;
            audit_procedure: string;
            audit_result: string;
            audit_successfully: string;
            audit_summary: string;
            auditing_checklist: string;
            auditing: string;
            auditor_comment: string;
            back: string;
            by_key: string;
            cannot_fetch_pull_request_info: string;
            checklist_item: string;
            checklist: string;
            comments: string;
            commit_id_sha: string;
            failed_to_audit: string;
            failed_to_upload_data_to_ipfs: string;
            fill_comment_if_fail: string;
            here: string;
            if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline: string;
            invalid_commit_audit_report_not_found: string;
            ipfs_code_source: string;
            loading: string;
            merge_sha: string;
            next: string;
            not_under_auditing: string;
            owner: string;
            package_name: string;
            package_owner: string;
            pr_number: string;
            project_name: string;
            sign_and_submit: string;
            submit: string;
            title: string;
            transaction_submitted: string;
            uploading_audit_report_to_ipfs: string;
            version: string;
            view_code: string;
            you_are_going_to_audit_the_dapp_checklist: string;
            you_have_to_add_comment_to_the_failed_checklist_item: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-widget-repos/languages/repo.json.ts" />
declare module "@scom/scom-widget-repos/languages/repo.json.ts" {
    const _default_2: {
        en: {
            all: string;
            are_you_sure_you_want_to_merge: string;
            audit_failed: string;
            audit_passed: string;
            audit_report: string;
            branch: string;
            cannot_submit_an_old_version: string;
            clear: string;
            commit_id_sha: string;
            commit_id: string;
            commits: string;
            committed: string;
            confirm: string;
            create_new_repository: string;
            description: string;
            edit: string;
            end_date: string;
            end_time_cannot_be_earlier_than_start_time: string;
            error: string;
            failed_review: string;
            failed_to_create_your_repository: string;
            failed_to_get_message: string;
            failed_to_merge: string;
            failed_to_submit: string;
            failed_to_upload_data_to_ipfs: string;
            merge_pull_request: string;
            merge: string;
            merged_successfully: string;
            merged: string;
            "merging...": string;
            merging: string;
            passed_review: string;
            pending_audit: string;
            pending_review: string;
            please_add_a_prefix_to_the_project_first: string;
            please_login_to_create_your_repository: string;
            prs: string;
            publish: string;
            repositories: string;
            repository_name_is_required: string;
            repository_name: string;
            repository: string;
            review: string;
            search: string;
            show_only_PRs: string;
            start_date: string;
            start_time_cannot_be_earlier_than_end_time: string;
            submit_for_audit: string;
            submitted_successfully: string;
            submitting: string;
            success: string;
            sync: string;
            there_is_no_commit: string;
            there_is_no_pull_request: string;
            there_is_no_repository: string;
            this_pr_has_been_audited_with_failed_status: string;
            this_pr_is_not_reviewed_by_the_auditor_yet: string;
            this_version_has_already_been_submitted: string;
            title: string;
            updated: string;
            version: string;
            view_record: string;
            your_repository_has_been_created_successfully: string;
            deploy: string;
            view: string;
            verify: string;
            enclave: string;
            enclave_verification_successful: string;
            enclave_verification_failed: string;
        };
        "zh-hant": {
            all: string;
            are_you_sure_you_want_to_merge: string;
            audit_failed: string;
            audit_passed: string;
            audit_report: string;
            branch: string;
            cannot_submit_an_old_version: string;
            clear: string;
            commit_id_sha: string;
            commit_id: string;
            commits: string;
            committed: string;
            confirm: string;
            create_new_repository: string;
            description: string;
            edit: string;
            end_date: string;
            end_time_cannot_be_earlier_than_start_time: string;
            error: string;
            failed_review: string;
            failed_to_create_your_repository: string;
            failed_to_get_message: string;
            failed_to_merge: string;
            failed_to_submit: string;
            failed_to_upload_data_to_ipfs: string;
            merge_pull_request: string;
            merge: string;
            merged_successfully: string;
            merged: string;
            "merging...": string;
            merging: string;
            passed_review: string;
            pending_audit: string;
            pending_review: string;
            please_add_a_prefix_to_the_project_first: string;
            please_login_to_create_your_repository: string;
            prs: string;
            publish: string;
            repositories: string;
            repository_name_is_required: string;
            repository_name: string;
            repository: string;
            review: string;
            search: string;
            show_only_PRs: string;
            start_date: string;
            start_time_cannot_be_earlier_than_end_time: string;
            submit_for_audit: string;
            submitted_successfully: string;
            submitting: string;
            success: string;
            sync: string;
            there_is_no_commit: string;
            there_is_no_pull_request: string;
            there_is_no_repository: string;
            this_pr_has_been_audited_with_failed_status: string;
            this_pr_is_not_reviewed_by_the_auditor_yet: string;
            this_version_has_already_been_submitted: string;
            title: string;
            updated: string;
            version: string;
            view_record: string;
            your_repository_has_been_created_successfully: string;
            deploy: string;
            view: string;
            verify: string;
            enclave: string;
            enclave_verification_successful: string;
            enclave_verification_failed: string;
        };
        vi: {
            all: string;
            are_you_sure_you_want_to_merge: string;
            audit_failed: string;
            audit_passed: string;
            audit_report: string;
            branch: string;
            cannot_submit_an_old_version: string;
            clear: string;
            commit_id_sha: string;
            commit_id: string;
            commits: string;
            committed: string;
            confirm: string;
            create_new_repository: string;
            description: string;
            edit: string;
            end_date: string;
            end_time_cannot_be_earlier_than_start_time: string;
            error: string;
            failed_review: string;
            failed_to_create_your_repository: string;
            failed_to_get_message: string;
            failed_to_merge: string;
            failed_to_submit: string;
            failed_to_upload_data_to_ipfs: string;
            merge_pull_request: string;
            merge: string;
            merged_successfully: string;
            merged: string;
            "merging...": string;
            merging: string;
            passed_review: string;
            pending_audit: string;
            pending_review: string;
            please_add_a_prefix_to_the_project_first: string;
            please_login_to_create_your_repository: string;
            prs: string;
            publish: string;
            repositories: string;
            repository_name_is_required: string;
            repository_name: string;
            repository: string;
            review: string;
            search: string;
            show_only_PRs: string;
            start_date: string;
            start_time_cannot_be_earlier_than_end_time: string;
            submit_for_audit: string;
            submitted_successfully: string;
            submitting: string;
            success: string;
            sync: string;
            there_is_no_commit: string;
            there_is_no_pull_request: string;
            there_is_no_repository: string;
            this_pr_has_been_audited_with_failed_status: string;
            this_pr_is_not_reviewed_by_the_auditor_yet: string;
            this_version_has_already_been_submitted: string;
            title: string;
            updated: string;
            version: string;
            view_record: string;
            your_repository_has_been_created_successfully: string;
            deploy: string;
            view: string;
            verify: string;
            enclave: string;
            enclave_verification_successful: string;
            enclave_verification_failed: string;
        };
    };
    export default _default_2;
}
/// <amd-module name="@scom/scom-widget-repos/languages/index.ts" />
declare module "@scom/scom-widget-repos/languages/index.ts" {
    import mainJson from "@scom/scom-widget-repos/languages/main.json.ts";
    import auditJson from "@scom/scom-widget-repos/languages/audit.json.ts";
    import repoJson from "@scom/scom-widget-repos/languages/repo.json.ts";
    export { mainJson, auditJson, repoJson };
}
/// <amd-module name="@scom/scom-widget-repos/components/github/repo.tsx" />
declare module "@scom/scom-widget-repos/components/github/repo.tsx" {
    import { Module, Container, ControlElement } from "@ijstech/components";
    interface GithubRepoElement extends ControlElement {
        data?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-widget-repos--github-repo']: GithubRepoElement;
            }
        }
    }
    export class ScomWidgetReposGithubRepo extends Module {
        private _data;
        private _guid;
        private _projectId;
        private _isProject;
        private _isProjectOwner;
        private _isAuditPR;
        private _isGithubOwner;
        private isInitialized;
        private listPR;
        private isDetailShown;
        private listAuditPr;
        private timer;
        private listTimer;
        private commits;
        private totalCommits;
        private packageInfo;
        private lbName;
        private lbPath;
        private lbVersion;
        private lbCount;
        private lbPushedAt;
        private iconDetail;
        private iconRefresh;
        private hStackCount;
        private hStackLink;
        private tabs;
        private customTabs;
        private vStackListPR;
        private mdAlert;
        private viewReportModal;
        private auditReport;
        private btnDeployer;
        private lblType;
        private selectedCommit;
        private mdPublish;
        private lbCommitId;
        private lbCommitVersion;
        private btnPublish;
        private lbPublish;
        onRefresh: () => Promise<void>;
        updateCountPRs: (oldNum: number, newNum: number) => void;
        onEdit: (name: string) => void;
        onDeploy: (name: string) => void;
        private activeTab;
        set guid(value: string);
        get guid(): string;
        set projectId(value: number);
        get projectId(): number;
        set isProject(value: boolean);
        get isProject(): boolean;
        set isProjectOwner(value: boolean);
        get isProjectOwner(): boolean;
        set isGithubOwner(value: boolean);
        get isGithubOwner(): boolean;
        set data(value: any);
        get data(): any;
        get isAuditPR(): boolean;
        set isAuditPR(value: boolean);
        constructor(parent?: Container, options?: GithubRepoElement);
        private setMessage;
        private renderUI;
        private clearListTimer;
        private renderListPR;
        private getStatusMessage;
        private getStatusColor;
        private getStatusText;
        private getCommits;
        private getAllPRs;
        private onShowDetail;
        private onRefreshData;
        private refreshPR;
        private onViewRecord;
        private onAuditPR;
        private onMergePR;
        private mergeOnePR;
        private onClosePublish;
        private resetPublishInfo;
        private onRequestAudit;
        private openLink;
        onHide(): void;
        private onOpenBuilder;
        private onOpenDeploy;
        private onTabClick;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-widget-repos/components/deployer.tsx" />
declare module "@scom/scom-widget-repos/components/deployer.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface ScomWidgetReposDeployerElement extends ControlElement {
        contract?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-widget-repos--deployer"]: ScomWidgetReposDeployerElement;
            }
        }
    }
    export class ScomWidgetReposDeployer extends Module {
        private pnlDeploy;
        private pnlLoader;
        private comboEnclave;
        private enclaveItems;
        private lblVerificationMessage;
        private _contract;
        private cachedContract;
        get contract(): string;
        set contract(value: string);
        constructor(parent?: Container, options?: any);
        static create(options?: any, parent?: Container): Promise<ScomWidgetReposDeployer>;
        setData(name: string): Promise<void>;
        private handleInit;
        private getContent;
        private onOpenVerify;
        clear(): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-widget-repos/components/github/list.tsx" />
declare module "@scom/scom-widget-repos/components/github/list.tsx" {
    import { Module, Container, ControlElement } from "@ijstech/components";
    interface GithubListElement extends ControlElement {
        guid?: string;
        isProject?: boolean;
        isProjectOwner?: boolean;
        isAuditPR?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-widget-repos--github-list']: GithubListElement;
            }
        }
    }
    export default class ScomWidgetReposGithubList extends Module {
        private pnlLoader;
        private lbOrg;
        private lbRepos;
        private vStackRepos;
        private iconRefresh;
        private pnlBuilderLoader;
        private filterSwitch;
        private totalPage;
        private pageNumber;
        private itemStart;
        private itemEnd;
        private paginationElm;
        private mdWidgetBuilder;
        private pnlBuilder;
        private widgetBuilder;
        private deployer;
        private mdFilter;
        private pnlFilter;
        private btnFilter;
        private _isGithubOwner;
        private _userInfo;
        private _guid;
        private _projectId;
        private _isProject;
        private _isProjectOwner;
        private _listRepos;
        private _isAuditPR;
        private error;
        private initedConfig;
        private _redirectUri;
        private _selectedType;
        private timer;
        getAllRepos: () => Promise<void>;
        updateCountPRs: (oldNum: number, newNum: number) => void;
        constructor(parent?: Container, options?: GithubListElement);
        get guid(): string;
        set guid(value: string);
        get projectId(): number;
        set projectId(value: number);
        get isProject(): boolean;
        set isProject(value: boolean);
        get isProjectOwner(): boolean;
        set isProjectOwner(value: boolean);
        get isGithubOwner(): boolean;
        set isGithubOwner(value: boolean);
        get userInfo(): any;
        set userInfo(value: any);
        set listRepos(value: any);
        get listRepos(): any;
        get filteredRepos(): any[];
        get listReposPagination(): any[];
        get isAuditPR(): boolean;
        set isAuditPR(value: boolean);
        onShow(options?: any): void;
        private renderDetailRepos;
        private renderRepos;
        private onRefresh;
        private onSelectIndex;
        private resetPaging;
        private renderUI;
        private extractUrl;
        renderEmpty(): void;
        private showBuilder;
        private closeBuilder;
        private onBuilderOpen;
        private onBuilderClose;
        private onSwitchFilter;
        private openDeploy;
        private onShowFilter;
        private onHideFilter;
        private renderFilter;
        private onFilterChanged;
        onHide(): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-widget-repos/components/github/create.tsx" />
declare module "@scom/scom-widget-repos/components/github/create.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    interface ScomWidgetReposCreateRepoElement extends ControlElement {
        id?: string;
        prefix?: string;
        onClosed?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-widget-repos--create-repo"]: ScomWidgetReposCreateRepoElement;
            }
        }
    }
    export class ScomWidgetReposCreateRepo extends Module {
        private projectGuid;
        private projectPrefix;
        private lbPrefix;
        private edtName;
        private edtDescription;
        private btnConfirm;
        private mdAlert;
        onClosed: () => void;
        constructor(parent?: Container, options?: ScomWidgetReposCreateRepoElement);
        static create(options?: ScomWidgetReposCreateRepoElement, parent?: Container): Promise<ScomWidgetReposCreateRepo>;
        init(): void;
        setData(options?: any): Promise<void>;
        clear(): void;
        private updateButton;
        private setMessage;
        private handleConfirmClick;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-widget-repos/components/tabs/index.tsx" />
declare module "@scom/scom-widget-repos/components/tabs/index.tsx" {
    import { Module, ControlElement, HStack, Container } from "@ijstech/components";
    interface ITabs {
        items: any[];
        activeTab?: string;
    }
    interface ScomTabsElement extends ControlElement {
        items?: any[];
        activeTab?: string;
        onChanged?: (target: HStack) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-widget-repos--tabs']: ScomTabsElement;
            }
        }
    }
    export class ScomWidgetReposTabs extends Module {
        private _data;
        private elmsMapper;
        private pnlList;
        onChanged: (target: HStack) => void;
        constructor(parent?: Container, options?: ScomTabsElement);
        set items(value: any[]);
        get items(): any[];
        get activeTab(): string;
        set activeTab(value: string);
        setData(data: ITabs): void;
        updateCount(tag: string, count: number): void;
        private renderItems;
        private onTabClick;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-widget-repos/components/github/index.tsx" />
declare module "@scom/scom-widget-repos/components/github/index.tsx" {
    import { Module, Container, ControlElement } from "@ijstech/components";
    import { ScomWidgetReposCreateRepo } from "@scom/scom-widget-repos/components/github/create.tsx";
    interface GithubElement extends ControlElement {
        guid?: string;
        prefix?: string;
        isProject?: boolean;
        isProjectOwner?: boolean;
    }
    interface IGithub {
        guid?: string;
        prefix?: string;
        isProject?: boolean;
        isProjectOwner?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-widget-repos--github']: GithubElement;
            }
        }
    }
    export class ScomWidgetReposGithub extends Module {
        private pnlLoader;
        private elmPackages;
        private elmList;
        private elmPRs;
        private countPRs;
        private pnlPackages;
        private tabs;
        private customTabs;
        private userInfo;
        private _projectId;
        private _searchName;
        private _data;
        private listRepos;
        constructor(parent?: Container, options?: GithubElement);
        get guid(): string;
        set guid(value: string);
        set projectId(value: number);
        get projectId(): number;
        get isProject(): boolean;
        set isProject(value: boolean);
        get isProjectOwner(): boolean;
        set isProjectOwner(value: boolean);
        get prefix(): string;
        set prefix(value: string);
        get searchName(): string;
        set searchName(value: string);
        get listReposFiltered(): any[];
        get listPRsFiltered(): any[];
        private getAllRepos;
        private updateElms;
        private updateCountPRs;
        private updateUI;
        private renderUI;
        private onTabClick;
        setData(data: IGithub): void;
        onShow(options?: any): void;
        onHide(): void;
        init(): void;
        render(): any;
    }
    export { ScomWidgetReposCreateRepo };
}
/// <amd-module name="@scom/scom-widget-repos/components/audit_report/index.css.ts" />
declare module "@scom/scom-widget-repos/components/audit_report/index.css.ts" {
    const _default_3: string;
    export default _default_3;
}
/// <amd-module name="@scom/scom-widget-repos/components/audit_report/data.json.ts" />
declare module "@scom/scom-widget-repos/components/audit_report/data.json.ts" {
    export const checklistItems: string[];
}
/// <amd-module name="@scom/scom-widget-repos/components/audit_report/index.tsx" />
declare module "@scom/scom-widget-repos/components/audit_report/index.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    interface ReportFormElement extends ControlElement {
        isPopup: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-widget-repos--audit-report"]: ReportFormElement;
            }
        }
    }
    export class ScomWidgetReposAuditReport extends Module {
        private imgLogo;
        private DAppName;
        private hStackProjectName;
        private vStackPRName;
        private lblProjectName;
        private lbPRTitle;
        private lbPRNumber;
        private lbPRSha;
        private DAppVersion;
        private guidelineMsg;
        private checklist;
        private auditSummary;
        private aduitComment;
        private auditSummaryPanel;
        private reportStatus;
        private btnSubmit;
        private auditResultLabel;
        private DAppPanel;
        private btnPanel;
        private _isPopUp;
        private _prInfo;
        private _commitGuid;
        private mergeInfo;
        private auditReportInfo;
        private mdLoading;
        private $eventBus;
        private mdAlert;
        constructor(parent?: Container, options?: any);
        get isAuditPR(): boolean;
        get isPopUp(): boolean;
        set isPopUp(value: boolean);
        get prInfo(): {
            mergeId?: string;
            owner: string;
            repo: string;
            prNumber: string;
        };
        set prInfo(value: {
            mergeId?: string;
            owner: string;
            repo: string;
            prNumber: string;
        });
        get commitGuid(): string;
        set commitGuid(value: string);
        init(): Promise<void>;
        private onSetupPage;
        private fetchAuditPR;
        private fetchAuditPackage;
        private initReportState;
        private renderCompanyInfo;
        private guidelineMsgDisable;
        private saveCheckBoxValue;
        private saveInputBoxValue;
        private renderChecklist;
        private backBtn;
        private setMessage;
        private NextOrSubmitBtn;
        private viewCode;
        private pageChangeState;
        private renderAuditSummary;
        private getPackageFiles;
        private submitAuditReport;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-widget-repos/components/index.ts" />
declare module "@scom/scom-widget-repos/components/index.ts" {
    export { ScomWidgetReposGithub, ScomWidgetReposCreateRepo } from "@scom/scom-widget-repos/components/github/index.tsx";
    export { ScomWidgetReposAuditReport } from "@scom/scom-widget-repos/components/audit_report/index.tsx";
    export { ScomWidgetReposTabs } from "@scom/scom-widget-repos/components/tabs/index.tsx";
    export { ScomWidgetReposDeployer } from "@scom/scom-widget-repos/components/deployer.tsx";
}
/// <amd-module name="@scom/scom-widget-repos/index.css.ts" />
declare module "@scom/scom-widget-repos/index.css.ts" {
    export const searchPanelStyle: string;
}
/// <amd-module name="@scom/scom-widget-repos" />
declare module "@scom/scom-widget-repos" {
    import { Module, ControlElement, Container, IPFS } from "@ijstech/components";
    import { IContractInfo } from "@scom/scom-widget-repos/interface.ts";
    interface ScomWidgetReposElement extends ControlElement {
        contractInfo?: Record<string, IContractInfo>;
        baseUrl?: string;
        transportEndpoint?: string;
        signer?: IPFS.ISigner;
        projectId?: number;
        guid?: string;
        prefix?: string;
        isProject?: boolean;
        isProjectOwner?: boolean;
        scomCid?: string;
    }
    interface IWidgetRepos {
        contractInfo?: Record<string, IContractInfo>;
        guid?: string;
        prefix?: string;
        isProject?: boolean;
        projectId?: number;
        isProjectOwner?: boolean;
        baseUrl?: string;
        transportEndpoint?: string;
        signer?: IPFS.ISigner;
        scomCid?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-widget-repos"]: ScomWidgetReposElement;
            }
        }
    }
    export class ScomWidgetRepos extends Module {
        private githubElm;
        private createRepoElm;
        private _data;
        private timer;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomWidgetReposElement, parent?: Container): Promise<ScomWidgetRepos>;
        get contractInfo(): Record<string, IContractInfo>;
        set contractInfo(value: Record<string, IContractInfo>);
        get guid(): string;
        set guid(value: string);
        set projectId(value: number);
        get projectId(): number;
        get isProject(): boolean;
        set isProject(value: boolean);
        get isProjectOwner(): boolean;
        set isProjectOwner(value: boolean);
        get prefix(): string;
        set prefix(value: string);
        setData(value: IWidgetRepos): Promise<void>;
        private renderUI;
        private onRepoSearch;
        private onCreateRepoClick;
        disconnectedCallback(): void;
        onShow(options?: any): void;
        onHide(): void;
        init(): Promise<void>;
        render(): any;
    }
}

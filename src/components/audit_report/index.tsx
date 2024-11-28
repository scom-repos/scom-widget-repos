import {
  customElements,
  ControlElement,
  Module,
  Styles,
  Panel,
  Input,
  Label,
  HStack,
  Container,
  Button,
  VStack,
  Image,
  Modal,
  IEventBus,
  application,
  GridLayout,
  FormatUtils,
  Alert
} from '@ijstech/components';
import customStyles from './index.css';
import { checklistItems } from './data.json';
import { Wallet } from '@ijstech/eth-wallet';
import {
  formatDate,
  getAuditInfo,
  getAuditReportInfo,
  auditCommit,
  uploadDataToIpfs,
  getAllFiles,
  getPull,
  getTimeAgo,
  auditPR,
  getAuditPRReportInfo,
  auditPackageVersion,
  parseContractError,
  getExplorerTxUrl
} from '../../utils/index';
import { PackageStatus, IAuditReportResultInfo, IAuditReportInfo } from '../../interface';
import { auditJson, mainJson } from '../../languages/index';

const Theme = Styles.Theme.ThemeVars;

interface ReportFormElement extends ControlElement {
  isPopup: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-widget-repos--audit-report"]: ReportFormElement;
    }
  }
}

enum ReportStatus { EDIT, REVIEW, POPUP };

@customElements('i-scom-widget-repos--audit-report')
export class ScomWidgetReposAuditReport extends Module {
  private imgLogo: Image;
  private DAppName: Label;
  private hStackProjectName: HStack;
  private vStackPRName: VStack;
  private lblProjectName: Label;
  private lbPRTitle: Label;
  private lbPRNumber: Label;
  private lbPRSha: Label;
  private DAppVersion: Label;
  private guidelineMsg: HStack;
  private checklist: GridLayout;
  private auditSummary: HStack;
  private aduitComment: Input;
  private auditSummaryPanel: HStack;
  private reportStatus: ReportStatus;
  private btnSubmit: Button;
  private auditResultLabel: Label;
  private DAppPanel: Panel;
  private btnPanel: HStack;
  private _isPopUp: boolean;
  private _prInfo: { mergeId?: string, owner: string, repo: string, prNumber: string };
  private _commitGuid: string;
  private mergeInfo: any = {};
  private auditReportInfo: IAuditReportInfo = {} as IAuditReportInfo;
  private mdLoading: Modal;
  private $eventBus: IEventBus;
  private mdAlert: Alert;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
  }

  get isAuditPR() {
    return !!this.prInfo;
  }

  get isPopUp(): boolean {
    return this._isPopUp;
  }

  set isPopUp(value: boolean) {
    this._isPopUp = value;
  }

  get prInfo() {
    return this._prInfo;
  }

  set prInfo(value: { mergeId?: string, owner: string, repo: string, prNumber: string }) {
    this._prInfo = value;
    if (value) this.onSetupPage(true);
  }

  get commitGuid(): string {
    return this._commitGuid;
  }

  set commitGuid(value: string) {
    if (value === this._commitGuid) return;
    this._commitGuid = value;
    if (value) this.onSetupPage();
  }

  async init() {
    const i18nData = {};
    for (const key in auditJson) {
      i18nData[key] = { ...(auditJson[key] || {}), ...(mainJson[key] || {}) };
    }
    this.i18n.init({...i18nData});
    this.classList.add(customStyles);
    this.isPopUp = this.getAttribute("isPopUp") || "";
    super.init();
  }

  private async onSetupPage(isPR?: boolean) {
    this.mdLoading.visible = true;
    if (isPR) {
      await this.fetchAuditPR();
    } else {
      await this.fetchAuditPackage();
    }
    if (!isPR && !this.auditReportInfo.auditStatus) {
      this.setMessage({
        status: 'error',
        content: '$invalid_commit_audit_report_not_found',
        onClose: () => {
          window.location.assign("#/audit-commit");
        }
      })
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

  private async fetchAuditPR() {
    const { owner, repo, prNumber, mergeId } = this.prInfo;
    if (mergeId) {
      const result = await getAuditPRReportInfo(mergeId);
      if (result) {
        this.auditReportInfo = result;
        return;
      }
    }
    const result = await getPull(owner, repo, prNumber);
    if (result?.data) {
      this.mergeInfo = result.data;
      const { number, title, base, commit_sha } = result.data;
      this.auditReportInfo.packageName = repo;
      this.auditReportInfo.packageOwner = base.base_login;
      this.auditReportInfo.mergeNumber = number;
      this.auditReportInfo.mergeTitle = title;
      this.auditReportInfo.mergeSha = commit_sha;
    } else {
      this.setMessage({
        status: 'error',
        content: '$cannot_fetch_pull_request_info',
        onClose: () => {
          window.location.assign("#/review-pr");
        }
      })
      this.mdAlert.showModal();
      this.mdLoading.visible = false;
      return;
    }
    if (!this.auditReportInfo.checklist || !this.auditReportInfo.checklist.length) {
      this.auditReportInfo.checklist = new Array(checklistItems.length).fill(null).map(() => ({ checked: false, comment: "" }));
    }
  }

  private async fetchAuditPackage() {
    this.auditReportInfo = await getAuditReportInfo(this.commitGuid);
    if (!this.auditReportInfo.checklist || !this.auditReportInfo.checklist.length) {
      this.auditReportInfo.checklist = new Array(checklistItems.length).fill(null).map(() => ({ checked: false, comment: "" }));
    }
  }

  private initReportState() {
    if (this.isPopUp == true) {
      this.reportStatus = ReportStatus.POPUP;
    } else {
      this.reportStatus = (this.auditReportInfo.auditStatus && this.auditReportInfo.auditStatus !== PackageStatus.AUDITING) ? ReportStatus.REVIEW : ReportStatus.EDIT;
    }
  }

  private renderCompanyInfo() {
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
    } else {
      this.lbPRTitle.caption = this.auditReportInfo.mergeTitle;
      this.lbPRNumber.caption = this.i18n.get('$opened_by', {
        qty: `${this.auditReportInfo.mergeNumber ?? ''}`,
        date: getTimeAgo(this.mergeInfo.created_at, this.i18n),
        by: this.mergeInfo.user_login
      })
      this.lbPRSha.caption = `${this.i18n.get('$merge_sha')}: ${this.auditReportInfo.mergeSha || this.mergeInfo.commit_sha}`;
    }
  }

  private guidelineMsgDisable() {
    this.guidelineMsg.visible = false;
  }

  private saveCheckBoxValue(control: any, i: number) {
    this.auditReportInfo.checklist[i].checked = control.checked;
  }

  private saveInputBoxValue(control: any, i: number) {
    this.auditReportInfo.checklist[i].comment = control.value;
  }

  private renderChecklist() {
    this.checklist.innerHTML = '';
    let enable: boolean;
    if (this.reportStatus == ReportStatus.POPUP || this.reportStatus == ReportStatus.REVIEW) {
      enable = false;
    } else {
      enable = true;
    }

    this.checklist.append(
      <i-hstack height='3.875rem' verticalAlignment='center' horizontalAlignment='center' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }} background={{ color: Theme.colors.primary.main }}>
        <i-label caption='$auditing_checklist'></i-label>
      </i-hstack>
    )

    this.checklist.append(
      <i-hstack height='3.875rem' verticalAlignment='center' horizontalAlignment='center' background={{ color: Theme.colors.primary.main }}>
        <i-label caption='$comments'></i-label>
      </i-hstack>
    )

    checklistItems.forEach((item, i) => {
      const placeholder = this.reportStatus === ReportStatus.EDIT ? "$fill_comment_if_fail" : ""
      this.checklist.append(
        <i-hstack height='100%' verticalAlignment='center' horizontalAlignment='start' background={{ color: '#34343A' }}
          border={{ color: '#636363', width: '0 1px 1px 0', style: 'solid' }}>
          <i-checkbox opacity={1} checked={this.auditReportInfo.checklist[i].checked} height='100%' width='100%' caption={item} enabled={enable} onChanged={(target) => this.saveCheckBoxValue(target, i)}></i-checkbox>
        </i-hstack>
      )
      this.checklist.append(
        <i-hstack height='100%' verticalAlignment='center' horizontalAlignment='center' background={{ color: '#34343A' }} border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-input
            opacity={1}
            placeholder={placeholder}
            value={this.auditReportInfo.checklist[i].comment}
            height='100%'
            width='100%'
            inputType='textarea'
            enabled={enable}
            resize='auto-grow'
            onChanged={(target) => this.saveInputBoxValue(target, i)}>
          </i-input>
        </i-hstack>
      )
    })
  }

  private backBtn() {
    if (this.reportStatus == ReportStatus.REVIEW) {
      this.reportStatus = ReportStatus.EDIT;
      this.pageChangeState();
    } else {
      window.history.back();
    }
  }

  private setMessage(message: {status?: string, content?: string, title?: string, link?: any, onClose?: any}) {
    const { status, content, title, link, onClose } = message;
    if (title !== undefined) this.mdAlert.title = title;
    if (content !== undefined) this.mdAlert.content = content;
    if (status !== undefined) this.mdAlert.status = status;
    if (link) this.mdAlert.link = link;
    if (typeof onClose === 'function') this.mdAlert.onClose = onClose;
  }

  private NextOrSubmitBtn() {
    if (this.reportStatus == ReportStatus.EDIT) {
      const missingComment = this.auditReportInfo.checklist.some(item => !item.checked && !item.comment);
      if (missingComment) {
        this.setMessage({
          status: 'warning',
          content: '$you_have_to_add_comment_to_the_failed_checklist_item'
        })
        this.mdAlert.showModal();
        return;
      }
      this.reportStatus = ReportStatus.REVIEW;
      this.auditReportInfo.auditedBy = Wallet.getClientInstance().address;
      this.auditReportInfo.auditDate = Math.floor(Date.now() / 1000);
      const passed = this.auditReportInfo.checklist.every(item => item.checked);
      this.auditReportInfo.result = passed ? PackageStatus.AUDIT_PASSED : PackageStatus.AUDIT_FAILED;
      this.auditReportInfo.comment = this.aduitComment.value;
      this.pageChangeState();
      window.scrollTo(0, 0);
    } else {
      this.submitAuditReport();
    }
  }

  private viewCode() {
    if (this.commitGuid) {
      window.open(`#/files-view/${this.commitGuid}`);
    } else {
      window.open(this.mergeInfo.html_url, '_blank');
    }
  }

  private pageChangeState() {
    if (this.reportStatus == ReportStatus.EDIT) {
      this.btnSubmit.caption = '$next';
      this.btnSubmit.enabled = true;
      this.DAppPanel.visible = true;
      this.aduitComment.enabled = true;
      this.btnPanel.visible = true;
      this.aduitComment.enabled = true;
      this.auditSummaryPanel.visible = false;
    } else if (this.reportStatus == ReportStatus.REVIEW) {
      this.btnSubmit.caption = '$sign_and_submit';
      this.btnSubmit.enabled = true;
      this.aduitComment.enabled = false;
      this.DAppPanel.visible = false;
      this.btnPanel.visible = !this.auditReportInfo.auditStatus || this.auditReportInfo.auditStatus === PackageStatus.AUDITING;
      this.aduitComment.enabled = false;
      this.renderAuditSummary();
      this.auditSummaryPanel.visible = true;
    } else {
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

  private renderAuditSummary() {
    this.auditSummary.innerHTML = '';
    const lastAuditDate = this.auditReportInfo.auditDate ? formatDate(this.auditReportInfo.auditDate * 1000, "DD MMM YYYY") : '-';
    const auditor = this.auditReportInfo.auditedBy ? FormatUtils.truncateWalletAddress(this.auditReportInfo.auditedBy) : '-';
    this.auditSummary.append(<i-vstack width='100%' verticalAlignment='center'>
      {!this.isAuditPR ? <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$project_name' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={this.auditReportInfo.projectName ?? ""} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack> : []}
      {!this.isAuditPR ? <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$version' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={this.auditReportInfo.version ?? ""} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack> : []}
      {!this.isAuditPR ? <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='Owner' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={this.auditReportInfo.owner ? FormatUtils.truncateWalletAddress(this.auditReportInfo.owner) : '-'} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack> : []}
      <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$title' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={this.isAuditPR ? this.auditReportInfo.mergeTitle : this.auditReportInfo.message} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack>
      <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$package_name' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={!this.isAuditPR ? this.auditReportInfo.packageName : this.prInfo.repo} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack>
      <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$package_owner' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={!this.isAuditPR ? this.auditReportInfo.packageOwner : this.prInfo.owner} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack>
      {this.isAuditPR ? <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$pr_number' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={this.auditReportInfo.mergeNumber ?? this.mergeInfo.number} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack> : []}
      <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption={this.isAuditPR ? '$merge_sha' : '$commit_id_sha'} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={this.isAuditPR ? this.auditReportInfo.mergeSha || this.mergeInfo.commit_sha : this.auditReportInfo.commitId} wordBreak='break-all' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack>
      {!this.isAuditPR ? <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$ipfs_code_source' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label
            caption={this.auditReportInfo.ipfsCid}
            class='pointer'
            link={{ href: this.auditReportInfo.ipfsCid ? `https://ipfs.io/ipfs/${this.auditReportInfo.ipfsCid}/` : "" }}
            padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}
            font={{ color: '#1F86FF' }}
            wordBreak="break-all"
          ></i-label>
        </i-hstack>
      </i-hstack> : []}
      <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$audit_date' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={lastAuditDate} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack>
      <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$audit_by' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start'>
          <i-label caption={auditor} padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
      </i-hstack>
      <i-hstack width='100%' verticalAlignment='center' background={{ color: '#34343A' }}
        height='3.125rem' horizontalAlignment='center' border={{ bottom: { color: '#636363', width: '1px', style: 'solid' } }}>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' border={{ right: { color: '#636363', width: '1px', style: 'solid' } }}>
          <i-label caption='$audit_result' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}></i-label>
        </i-hstack>
        <i-hstack height='100%' width='50%' verticalAlignment='center' horizontalAlignment='start' padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}>
          <i-label
            id='auditResultLabel'
            padding={{ top: '0.3125rem', bottom: '0.3125rem', left: '1.25rem', right: '1.25rem' }}
            caption={this.auditReportInfo.result ? 'Pass' : 'Fail'}
            background={{ color: this.auditReportInfo.result ? Theme.colors.success.main : Theme.colors.error.main }}
            border={{ radius: '1rem' }}
          ></i-label>
        </i-hstack>
      </i-hstack>
    </i-vstack>
    )
  }

  private getPackageFiles = async () => {
    const res = await getAllFiles(this.commitGuid);
    if (res?.files) {
      const files = res.files;
      return files;
    }
    return false;
  }

  private submitAuditReport = async () => {
    this.btnSubmit.rightIcon.visible = true;
    if (!this.isAuditPR) {
      let auditInfo = await getAuditInfo(this.commitGuid);
      if (auditInfo.auditStatus !== PackageStatus.AUDITING) {
        this.setMessage({
          status: 'error',
          content: '$not_under_auditing'
        })
        this.mdAlert.showModal();
        this.btnSubmit.rightIcon.visible = false;
        return;
      }
    }
    this.setMessage({
      status: 'loading',
      content: '$uploading_audit_report_to_ipfs',
    })
    this.mdAlert.showModal();
    const resultInfo: IAuditReportResultInfo = { ...this.auditReportInfo };
    const { packageOwner, packageName } = resultInfo;
    const { number, commit_sha, created_at } = this.mergeInfo;
    const reportFileName = this.isAuditPR ? `Audit-Report-PR-${packageOwner}-${packageName}-${number}-${commit_sha}.md` : `Audit-Report-${this.commitGuid}.md`;
    const ipfsReportCid = await uploadDataToIpfs(JSON.stringify(resultInfo), reportFileName);
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
      })
      this.mdAlert.showModal();
      let res: any;
      if (this.isAuditPR) {
        res = await auditPR(packageOwner, packageName, number, commit_sha, ipfsReportCid, ipfsCid, this.auditReportInfo.result);
        if (res?.success) {
          this.setMessage({
            status: 'success',
            content: '$audit_successfully',
            onClose: () => {
              window.history.back();
            }
          })
          this.mdAlert.showModal();
          this.btnSubmit.rightIcon.visible = false;
        } else {
          this.setMessage({
            status: 'error',
            content: res?.error?.message || '$failed_to_audit'
          })
          this.mdAlert.showModal();
          this.btnSubmit.rightIcon.visible = false;
        }
      } else {
        const callback = async (err: Error, receipt?: string) => {
          if (err) {
            this.setMessage({
              status: 'error',
              content: parseContractError(err.message)
            })
            this.mdAlert.showModal();
          } else if (receipt) {
            this.setMessage({
              status: 'success',
              title: '$transaction_submitted',
              link: {
                caption: receipt,
                href: getExplorerTxUrl(receipt)
              }
            });
            this.mdAlert.showModal();
          }
        }
        const confirmationCallback = async (receipt: any) => {
          const { commitGuid, projectGuid, result } = this.auditReportInfo;
          let data = {
            commitGuid,
            projectGuid,
            ipfsReportCid,
            ipfsCid,
            auditStatus: result
          }
          res = await auditCommit(data);
          if (res?.success) {
            this.setMessage({
              status: 'success',
              content: '$audit_successfully',
              onClose: () => {
                window.location.assign("#/audit-commit");
              }
            })
            this.mdAlert.showModal();
            this.btnSubmit.rightIcon.visible = false;
          } else {
            this.setMessage({
              status: 'error',
              content: res?.error?.message || '$failed_to_audit'
            })
            this.mdAlert.showModal();
            this.btnSubmit.rightIcon.visible = false;
          }
        }
        await auditPackageVersion(this.auditReportInfo.packageVersionId, this.auditReportInfo.result === PackageStatus.AUDIT_PASSED, ipfsReportCid, callback, confirmationCallback);
      }
    } else {
      this.setMessage({
        status: 'error',
        content: '$failed_to_upload_data_to_ipfs'
      })
      this.mdAlert.showModal();
      this.btnSubmit.rightIcon.visible = false;
    }
  }

  render() {
    return (
      <i-panel width="100%">
        <i-vstack horizontalAlignment='center' width='100%' padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }} gap={'1.875rem'}>
          <i-grid-layout id='DAppPanel' width='100%' maxWidth='87.5rem' border={{ bottom: { color: '#303030', width: '1px', style: 'solid' } }}
            templateAreas={[['titleArea', 'titleArea', 'titleArea'],
            ['logoArea', 'DAppNameAndVersionArea', 'btnArea'],
            ['logoArea', 'ProjectNameArea', 'btnArea']]}
            templateColumns={['5.625rem', 'auto', 'auto']}
            templateRows={['auto', 'auto', 'auto']}
            mediaQueries={
              [
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
              ]
            }>
            <i-label grid={{ area: 'titleArea' }} caption='$audit_procedure' font={{ size: '1.25rem', bold: true }} margin={{ top: '0.625rem', bottom: '1.25rem' }}></i-label>
            <i-image grid={{ area: 'logoArea' }} id='imgLogo' height='4.375rem' width='4.375rem' margin={{ right: '0.625rem' }}></i-image>
            <i-hstack grid={{ area: 'DAppNameAndVersionArea' }} verticalAlignment='center'>
              <i-label id='DAppName' font={{ size: '1.5625rem' }} margin={{ right: '1.875rem' }}></i-label>
              <i-label id='DAppVersion' font={{ size: '1rem' }}></i-label>
            </i-hstack>
            <i-vstack gap="0.1rem" grid={{ area: 'ProjectNameArea' }}>
              <i-hstack id="hStackProjectName" verticalAlignment='center'>
                <i-label caption='$by' font={{ size: '0.8rem' }} margin={{ right: '0.3125rem' }}></i-label>
                <i-label id='lblProjectName' font={{ size: '0.8rem', color: '#3994FF' }}></i-label>
              </i-hstack>
              <i-vstack id="vStackPRName" gap="0.1rem" verticalAlignment="center" width="fit-content">
                <i-label id="lbPRTitle" font={{ size: '0.8rem' }} margin={{ right: '0.3125rem' }}></i-label>
                <i-label id="lbPRNumber" font={{ size: '0.8rem' }} opacity={0.8}></i-label>
                <i-label id="lbPRSha" font={{ size: '0.8rem' }} opacity={0.8}></i-label>
              </i-vstack>
            </i-vstack>
            <i-hstack grid={{ area: 'btnArea' }} stack={{ basis: '50%' }} horizontalAlignment='end' gap="0.625rem">
              <i-button font={{ size: '0.875rem' }} caption='View Code' width='9rem' height='2.5rem' border={{ radius: '0.5rem' }} padding={{ left: '0.625rem', right: '0.625rem', top: '0.3125rem', bottom: '0.3125rem' }} onClick={this.viewCode}></i-button>
              {/* <i-button font={{ size: '0.875rem' }} caption='View Smart Contract' width='12.5rem' height='2.5rem' border={{ radius: '0.5rem' }} padding={{ left: '0.625rem', right: '0.625rem', top: '0.3125rem', bottom: '0.3125rem' }} onClick={this.viewSmartContract}></i-button> */}
            </i-hstack>
          </i-grid-layout>
          <i-vstack width='100%' maxWidth='1200px'>
            <i-hstack id='guidelineMsg' width='100%' background={{ color: '#34343A' }} padding={{ left: '1rem', right: '1rem', top: '0.625rem', bottom: '0.625rem' }}
              border={{ radius: '0.375rem' }} margin={{ top: '0.625rem', bottom: '0.625rem' }} visible={!this.isPopUp}>
              <i-vstack stack={{ basis: '95%' }} verticalAlignment='center'>
                <i-label caption='$you_are_going_to_audit_the_dapp_checklist' font={{ size: '1rem' }}></i-label>
                <i-panel>
                  <i-label caption='$if_you_are_first_time_to_go_over_the_checklist_you_could_find_the_guideline' display='inline' font={{ size: '1rem' }} margin={{ right: '0.3125rem' }}></i-label>
                  <i-label class='pointer' display='inline' caption='$here' font={{ size: '1rem', color: '#3994FF' }}></i-label>
                </i-panel>
              </i-vstack>
              <i-vstack stack={{ basis: '5%' }} verticalAlignment='center'>
                <i-icon class='pointer' name='times-circle' width='1.125rem' height='1.125rem' fill={Theme.colors.primary.main} onClick={this.guidelineMsgDisable}></i-icon>
              </i-vstack>
            </i-hstack>
            <i-vstack id='auditSummaryPanel' width='100%'>
              <i-label caption='$audit_summary' font={{ size: '1rem' }} margin={{ top: '0.625rem', bottom: '0.625rem' }} ></i-label>
              <i-hstack width='100%' horizontalAlignment='center' margin={{ top: '0.625rem' }}>
                <i-hstack id='auditSummary' minWidth='37.5rem' />
              </i-hstack>
            </i-vstack>
            <i-label caption="$audit_checklist" font={{ size: '1rem' }} margin={{ top: '1.875rem', bottom: '0.625rem' }} ></i-label>
            <i-grid-layout id='checklist' margin={{ top: '0.625rem', bottom: '0.625rem' }} templateColumns={['60%', '40%']}></i-grid-layout>
            <i-label caption='$auditor_comment' font={{ size: '1rem' }} margin={{ top: '0.625rem', bottom: '0.625rem' }} ></i-label>
            <i-input id='aduitComment' width='100%' height='auto' rows={12} inputType='textarea' margin={{ top: '0.625rem', bottom: '0.625rem' }} background={{ color: '#34343A' }} resize='auto-grow' opacity={1}></i-input>
            <i-hstack id='btnPanel' width='100%' margin={{ top: '0.625rem', bottom: '0.625rem' }} visible={false}>
              <i-hstack width='50%' horizontalAlignment='start'>
                <i-button caption='$back' font={{ size: '0.875rem' }} width='12.5rem' height='2.5rem' border={{ radius: '0.5rem' }}
                  padding={{ left: '1.25rem', right: '1.25rem', top: '0.2125rem', bottom: '0.2125rem' }} background={{ color: '#34343A' }} onClick={this.backBtn}></i-button>
              </i-hstack>
              <i-hstack width='50%' horizontalAlignment='end'>
                <i-button id='btnSubmit' caption="$next" font={{ size: '0.875rem' }} width='12.5rem' height='2.5rem' border={{ radius: '0.5rem' }} enabled={false}
                  padding={{ left: '1.25rem', right: '1.25rem', top: '0.2125rem', bottom: '0.2125rem' }} background={{ color: Theme.colors.primary.main }} onClick={this.NextOrSubmitBtn}
                  rightIcon={{ spin: true, visible: false }}></i-button>
              </i-hstack>
            </i-hstack>
          </i-vstack>
        </i-vstack>
        <i-modal id='mdLoading' width="7.8125rem" minWidth="125px" closeOnBackdropClick={false}>
          <i-vstack
            horizontalAlignment="center"
            verticalAlignment="center"
            border={{ radius: '0.25rem' }}
            padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
          >
            <i-icon name="spinner" spin={true} width="2.25rem" height="2.25rem" fill={Theme.text.primary}></i-icon>
            <i-label caption="$loading" font={{ size: '1.5em' }} class="i-loading-spinner_text"></i-label>
          </i-vstack>
        </i-modal>
        <i-alert id="mdAlert" />
      </i-panel>
    )
  }
}
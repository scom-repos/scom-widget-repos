import { Module, Container, VStack, customElements, ControlElement, Tab, moment, Panel, Tabs, Styles } from "@ijstech/components";
import { checkGithubOwner, getAllRepos, getGithubUser, isActiveAuditor } from "../../utils/API";
import { githubStyle, spinnerStyle, tabStyle } from "./index.css";
import ScomWidgetReposGithubList from "./list";
import { ScomWidgetReposCreateRepo } from './create';
import dataJson from './data.json';
const Theme = Styles.Theme.ThemeVars;

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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-widget-repos--github']: GithubElement;
    }
  }
}

@customElements('i-scom-widget-repos--github')
export class ScomWidgetReposGithub extends Module {
  private pnlLoader: VStack;
  private elmPackages: ScomWidgetReposGithubList;
  private elmList: ScomWidgetReposGithubList;
  private elmPRs: ScomWidgetReposGithubList;
  private prTab: Tab;
  private countPRs: number = 0;
  private pnlPackages: Panel;
  private tabs: Tabs;

  private userInfo: any = {};
  private _projectId: number;
  private _searchName: string;
  private _data: IGithub = {};
  private listRepos: any[] = [];

  constructor(parent?: Container, options?: GithubElement) {
    super(parent, options);
  }

  get guid() {
    return this._data.guid;
  }

  set guid(value: string) {
    this._data.guid = value;
  }

  set projectId(value: number) {
    this._projectId = value;
  }

  get projectId() {
    return this._projectId;
  }

  get isProject() {
    return this._data.isProject;
  }

  set isProject(value: boolean) {
    this._data.isProject = value;
    if (this.isProject && this.elmList) {
      this.elmList.isProject = this.isProject;
      this.elmPRs.isProject = this.isProject;
    }
  }

  get isProjectOwner() {
    return this._data.isProjectOwner;
  }

  set isProjectOwner(value: boolean) {
    this._data.isProjectOwner = value;
    if (this.isProjectOwner && this.elmList) {
      this.elmList.isProjectOwner = this.isProjectOwner;
      this.elmPRs.isProjectOwner = this.isProjectOwner;
    }
  }

  get prefix() {
    return this._data.prefix;
  }

  set prefix(value: string) {
    this._data.prefix = value;
    if (value && this.elmList) {
      this.renderUI();
    }
  }

  get searchName() {
    return this._searchName;
  }

  set searchName(value: string) {
    if (value === this._searchName) return;
    this._searchName = value;
    this.updateElms();
  }

  get listReposFiltered() {
    let list = [...this.listRepos];
    if (this.searchName) list = list.filter(v => v.name.toLowerCase().includes(this.searchName.toLowerCase()));
    return list.sort((a, b) => moment(a.pushed_at).isSameOrBefore(b.pushed_at) ? 1 : -1);
  }

  get listPRsFiltered() {
    let list = [...this.listRepos];
    if (this.searchName) list = list.filter(v => v.name.toLowerCase().includes(this.searchName.toLowerCase()));
    return list.filter(v => v.open_issues > 0).sort((a, b) => moment(a.pushed_at).isSameOrBefore(b.pushed_at) ? 1 : -1);
  }

  private async getAllRepos() {
    // const result = await getAllRepos(this.userInfo?.data?.login, this.isProject ? this.prefix : '', !this.isProject);
    const result = await getAllRepos('yc-wong', 'scom', false);
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
    } else {
      this.listRepos = [];
    }
    this.updateElms();
  }

  private updateElms() {
    const listPRsFiltered = this.listPRsFiltered;
    if (this.isProject) {
      this.elmList.listRepos = this.listReposFiltered;
      this.elmPRs.listRepos = [...listPRsFiltered];
      this.countPRs = [...listPRsFiltered].reduce((accumulator, currentObject) => accumulator + currentObject.open_issues, 0);
      this.prTab.caption = `Pull Requests <span style="color: var(--colors-${this.countPRs > 0 ? 'primary' : 'info'}-main)">(${this.countPRs})</span>`;
    } else {
      // this.elmPackages.listRepos = [...listPRsFiltered];
      this.elmPackages.listRepos = this.listReposFiltered;
    }
  }

  private updateCountPRs(oldNum: number, newNum: number) {
    this.countPRs = this.countPRs - oldNum + newNum;
    this.prTab.caption = `Pull Requests <span style="color: var(--colors-${this.countPRs > 0 ? 'primary' : 'info'}-main)">(${this.countPRs})</span>`;
  }

  private updateUI() {
    if (!this.tabs) return;
    this.tabs.visible = this.isProject;
    this.pnlPackages.visible = !this.isProject;
    if (!this.isProject) {
      this.elmPackages.getAllRepos = () => this.getAllRepos();
    } else {
      this.elmList.getAllRepos = () => this.getAllRepos();
      this.elmList.updateCountPRs = (oldNum, newNum) => this.updateCountPRs(oldNum, newNum);
      this.elmPRs.getAllRepos = () => this.getAllRepos();
      this.elmPRs.updateCountPRs = (oldNum, newNum) => this.updateCountPRs(oldNum, newNum);
    }
  }

  private async renderUI() {
    const isAuditor = await isActiveAuditor();
    const isPackagesPage = window.location.hash.startsWith("#/packages");
    let isGithubOwner = false;
    if (isPackagesPage) {
      isGithubOwner = await checkGithubOwner();
    }
    this.updateUI();
    this.pnlLoader.visible = true;
    this.pnlPackages.visible = false;
    this.tabs.visible = false;
    this.userInfo = await getGithubUser();
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
  }

  setData(data: IGithub) {
    this._data = data;
    this.renderUI();
  }

  onShow(options?: any): void {
    const query = window.location.hash.split('?')[1];
    const redirect = new URLSearchParams(query).get('redirect');
    if (redirect)
      this.elmPackages.onShow({ redirect });
    else
      this.renderUI();
  }

  onHide() {
    if (this.elmList) this.elmList.onHide();
    if (this.elmPRs) this.elmPRs.onHide();
    if (this.elmPackages) this.elmPackages.onHide();
  }

  init() {
    super.init();
    this.isProject = this.getAttribute('isProject', true);
    this.isProjectOwner = this.getAttribute('isProjectOwner', true);
    this.prefix = this.getAttribute('prefix', true);
  }

  render() {
    return (
      <i-panel
        width="100%"
        height="100%"
        margin={{ left: 'auto', right: 'auto' }}
        background={{ color: Theme.background.main }}
        class={githubStyle}
      >
        <i-vstack
          id="pnlLoader"
          position="absolute"
          width="100%"
          height="100%"
          minHeight={400}
          horizontalAlignment="center"
          verticalAlignment="center"
          background={{ color: Theme.background.main }}
          padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
          visible={false}
        >
          <i-panel class={spinnerStyle} />
        </i-vstack>
        <i-panel id="pnlPackages" visible={false} width="100%" height="100%">
          <i-scom-widget-repos--github-list id="elmPackages" />
        </i-panel>
        <i-tabs
          id="tabs"
          visible={false}
          class={tabStyle}
          width="100%"
          height="100%"
          padding={{ top: "0.5rem", bottom: "0.5rem", left: "1rem", right: "1rem" }}
          mode="horizontal"
        >
          <i-tab caption="All">
            <i-scom-widget-repos--github-list id="elmList" isProject={true} />
          </i-tab>
          <i-tab id="prTab" caption="Pull Requests">
            <i-scom-widget-repos--github-list id="elmPRs" />
          </i-tab>
        </i-tabs>
      </i-panel>
    )
  }
}

export { ScomWidgetReposCreateRepo };
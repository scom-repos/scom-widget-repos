import { customModule, Module, Container, Panel, VStack, Label, observable, Pagination, Icon, customElements, ControlElement, Styles, Modal, Switch, moment } from "@ijstech/components";
import { ScomWidgetReposGithubRepo } from "./repo";
import { customModalStyle, githubStyle, spinnerStyle } from "./index.css";
import { ScomWidgetBuilder } from "@scom/scom-widget-builder";
import { getStorageConfig } from "../../store/index";
import { repoJson } from "../../languages/index";
const Theme = Styles.Theme.ThemeVars;

const pageSize = 10;

interface GithubListElement extends ControlElement {
  guid?: string;
  isProject?: boolean;
  isProjectOwner?: boolean;
  isAuditPR?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-widget-repos--github-list']: GithubListElement;
    }
  }
}

@customModule
@customElements('i-scom-widget-repos--github-list')
export default class ScomWidgetReposGithubList extends Module {
  private pnlLoader: VStack;
  private lbOrg: Label;
  private lbRepos: Label;
  private vStackRepos: Panel;
  private iconRefresh: Icon;
  private pnlBuilderLoader: VStack;
  private filterSwitch: Switch;
  @observable()
  private totalPage = 0;
  private pageNumber = 0;
  private itemStart = 0;
  private itemEnd = pageSize;
  private paginationElm: Pagination;
  private mdWidgetBuilder: Modal;
  private widgetBuilder: ScomWidgetBuilder;

  private _isGithubOwner: boolean;
  private _userInfo: any = {};
  private _guid: string;
  private _projectId: number;
  private _isProject: boolean;
  private _isProjectOwner: boolean;
  private _listRepos: any[] = [];
  private _isAuditPR: boolean;
  private error: string;
  private initedConfig: boolean = false;
  private _redirectUri: string = '';
  public getAllRepos: () => Promise<void>;
  public updateCountPRs: (oldNum: number, newNum: number) => void;

  constructor(parent?: Container, options?: GithubListElement) {
    super(parent, options);
  }

  get guid() {
    return this._guid;
  }

  set guid(value: string) {
    this._guid = value;
  }

  get projectId() {
    return this._projectId;
  }

  set projectId(value: number) {
    this._projectId = value;
  }

  get isProject() {
    return this._isProject;
  }

  set isProject(value: boolean) {
    this._isProject = value;
    if (this.vStackRepos) this.renderDetailRepos();
  }

  get isProjectOwner() {
    return this._isProjectOwner;
  }

  set isProjectOwner(value: boolean) {
    this._isProjectOwner = value;
    if (this.vStackRepos) this.renderDetailRepos();
  }

  get isGithubOwner() {
    return this._isGithubOwner;
  }

  set isGithubOwner(value: boolean) {
    this._isGithubOwner = value;
  }

  get userInfo() {
    return this._userInfo;
  }

  set userInfo(value: any) {
    this._userInfo = value;
  }

  set listRepos(value: any) {
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
      list = list.filter(v => v.open_issues > 0).sort((a, b) => moment(a.pushed_at).isSameOrBefore(b.pushed_at) ? 1 : -1);
    }
    return [...list];
  }

  get listReposPagination() {
    return this.filteredRepos.slice(this.itemStart, this.itemEnd);
  }

  get isAuditPR() {
    return this._isAuditPR;
  }

  set isAuditPR(value: boolean) {
    this._isAuditPR = value;
  }

  onShow(options?: any): void {
    this._redirectUri = options?.redirect || '';
    this.renderUI()
  }

  private async renderDetailRepos() {
    if (!this.filteredRepos?.length) {
      this.renderEmpty();
    } else {
      const nodeItems = [];
      for (const repo of this.listReposPagination) {
        const item = new ScomWidgetReposGithubRepo();
        item.isGithubOwner = this.isGithubOwner;
        item.projectId = this.projectId;
        item.guid = this.guid;
        item.isProject = this.isProject;
        item.isProjectOwner = this.isProjectOwner;
        item.isAuditPR = this.isAuditPR;
        item.data = repo;
        item.onEdit = (name: string) => this.showBuilder(name);
        item.onRefresh = () => this.onRefresh();
        item.updateCountPRs = (oldNum, newNum) => this.updateCountPRs(oldNum, newNum);
        nodeItems.push(item);
      }
      this.vStackRepos.clearInnerHTML();
      this.vStackRepos.classList.add('list-repos');
      this.vStackRepos.append(...nodeItems);
    }
  }

  private renderRepos() {
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

  private async onRefresh() {
    this.pnlLoader.visible = true;
    this.iconRefresh.enabled = false;
    await this.getAllRepos();
    this.resetPaging();
    this.iconRefresh.enabled = true;
    this.pnlLoader.visible = false;
  }

  private onSelectIndex() {
    if (!this.filteredRepos.length) return;
    this.pageNumber = this.paginationElm.currentPage;
    this.itemStart = (this.pageNumber - 1) * pageSize;
    this.itemEnd = this.itemStart + pageSize;
    this.renderRepos();
  }

  private resetPaging() {
    this.pageNumber = 1;
    this.paginationElm.currentPage = 1;
    this.itemStart = 0;
    this.itemEnd = this.itemStart + pageSize;
    this.renderRepos();
  }

  private async renderUI() {
    this.paginationElm.visible = false;
    this.iconRefresh.visible = false;
    this.vStackRepos.classList.remove('list-repos');
    this.vStackRepos.clearInnerHTML();
    this.pnlLoader.visible = true;
    this.resetPaging();
    this.pnlLoader.visible = false;
    const config: any = getStorageConfig();
    const baseUrl = config?.baseUrl || '';
    let result = this.extractUrl(baseUrl);
    result = result.split('?')[0];
    if (result.includes('scom-repos') || result.includes('ijstech')) {
      this.showBuilder(result);
    }
  }

  private extractUrl(baseUrl: string) {
    let path: string;
    if (baseUrl && window.location.hash.startsWith(baseUrl)) {
      let length = baseUrl[baseUrl.length - 1] == '/' ? baseUrl.length : baseUrl.length + 1;
      path = window.location.hash.substring(length);
    } else {
      path = window.location.hash.substring(2);
    }
    return path;
  }

  renderEmpty() {
    this.vStackRepos.clearInnerHTML();
    this.vStackRepos.classList.remove('list-repos');
    this.vStackRepos.appendChild(<i-label caption={this.error || '$there_is_no_repository'} font={{ size: '1.5rem' }} margin={{ top: '3rem', left: 'auto', right: 'auto' }} />);
  }

  private async showBuilder(name: string) {
    this.mdWidgetBuilder.visible = true;
    this.pnlBuilderLoader.visible = true;
    const config: any = getStorageConfig();
    if (!this.initedConfig && config.transportEndpoint) {
      this.initedConfig = true;
      this.widgetBuilder.setConfig(config);
    }
    this.widgetBuilder.readonly = !!this._redirectUri;
    await this.widgetBuilder.setValue(name);
    this.widgetBuilder.refresh();
    this.pnlBuilderLoader.visible = false;
  }

  private closeBuilder() {
    if (this._redirectUri) {
      window.location.assign(decodeURIComponent(this._redirectUri));
      this._redirectUri = '';
    } else {
      this.widgetBuilder.resetCid();
    }
    this.mdWidgetBuilder.visible = false;
  }

  private onBuilderOpen() {
    const html = document.getElementsByTagName('html')[0];
    html.style.scrollbarGutter = 'auto';
    html.style.overflow = 'hidden';
  }

  private onBuilderClose() {
    const html = document.getElementsByTagName('html')[0];
    html.style.scrollbarGutter = '';
    html.style.overflow = '';
  }

  private onSwitchFilter(target: Switch) {
    this.renderRepos();
  }

  onHide(): void {
    super.onHide();
    const children = this.vStackRepos?.children || [];
    for (const child of children) {
      if (child instanceof ScomWidgetReposGithubRepo) {
        child.onHide();
      }
    }
  }

  init() {
    this.i18n.init({...repoJson});
    super.init();
    this.isProjectOwner = this.getAttribute('isProjectOwner', true, false);
    this.isProject = this.getAttribute('isProject', true, false);
  }

  render() {
    return (
      <i-panel
        width="100%"
        height="100%"
        maxWidth="75rem"
        margin={{ left: 'auto', right: 'auto' }}
        padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
        class={githubStyle}
      >
        <i-vstack
          id="pnlLoader"
          position="absolute"
          width="100%"
          height="100%"
          horizontalAlignment="center"
          verticalAlignment="center"
          padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
          background={{ color: Theme.background.main }}
          visible={false}
        >
          <i-panel class={spinnerStyle} />
        </i-vstack>
        <i-vstack width="100%" gap="1.25rem">
          <i-hstack gap="0.5rem" verticalAlignment="center" wrap="wrap">
            <i-label id="lbOrg" font={{ size: '1rem', bold: true, color: Theme.colors.primary.main }} />
            <i-label id="lbRepos" font={{ size: '1rem' }} opacity={0.8} />
            <i-icon
              id="iconRefresh"
              visible={false}
              class="icon-hover"
              name="sync-alt"
              width="1.25rem" height="1.25rem"
              cursor="pointer"
              onClick={this.onRefresh}
            />
            <i-switch
              id="filterSwitch"
              checked={false}
              uncheckedTrackColor={Theme.colors.secondary.main}
              checkedTrackColor={Theme.colors.primary.main}
              tooltip={{content: '$show_only_PRs', placement: 'bottom'}}
              onChanged={this.onSwitchFilter}
            />
          </i-hstack>
          <i-vstack id="vStackRepos" width="100%" />
          <i-hstack horizontalAlignment="center" margin={{ top: '2rem' }}>
            <i-pagination
              id="paginationElm"
              margin={{ bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
              width="auto"
              currentPage={this.pageNumber}
              totalPages={this.totalPage}
              onPageChanged={this.onSelectIndex}
            />
          </i-hstack>
        </i-vstack>
        <i-modal
          id="mdWidgetBuilder"
          showBackdrop={true}
          width={'100dvw'}
          height={'100dvh'}
          overflow={'hidden'}
          padding={{top: 0, bottom: 0, left: 0, right: 0}}
          onOpen={this.onBuilderOpen}
          onClose={this.onBuilderClose}
          class={customModalStyle}
        >
          <i-panel width={'100dvw'} height={'100dvh'} overflow={'hidden'}>
            <i-vstack
              id="pnlBuilderLoader"
              position="absolute"
              width="100%"
              height="100%"
              horizontalAlignment="center"
              verticalAlignment="center"
              padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
              background={{ color: Theme.background.main }}
              visible={false}
            >
              <i-panel class={spinnerStyle} />
            </i-vstack>
            <i-scom-widget-builder
              id="widgetBuilder"
              width={'100dvw'}
              height={'100dvh'}
              display={'flex'}
              onClosed={() => this.closeBuilder()}
            ></i-scom-widget-builder>
          </i-panel>
        </i-modal>
      </i-panel>
    )
  }
}
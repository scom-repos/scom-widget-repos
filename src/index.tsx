import {
  customElements,
  Module,
  Styles,
  ControlElement,
  Container,
  IPFS,
  Input
} from "@ijstech/components";
import { ScomWidgetReposGithub, ScomWidgetReposCreateRepo } from './components/index';
import { searchPanelStyle } from "./index.css";
import { IContractInfo } from "./interface";
import { setContractInfoByChain, setScomCid, setStorageConfig, setTransportEndpoint } from "./store/index";
import { mainJson } from "./languages/index";
import { getPackages } from "./utils";

const Theme = Styles.Theme.ThemeVars;

Styles.Theme.applyTheme(Styles.Theme.darkTheme);

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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-widget-repos"]: ScomWidgetReposElement;
    }
  }
}

@customElements("i-scom-widget-repos")
export class ScomWidgetRepos extends Module {
  private githubElm: ScomWidgetReposGithub;
  private createRepoElm: ScomWidgetReposCreateRepo;

  private _data: IWidgetRepos = {};
  private timer: any = null;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomWidgetReposElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get contractInfo() {
    return this._data?.contractInfo;
  }

  set contractInfo(value: Record<string, IContractInfo>) {
    this._data.contractInfo = value;
  }

  get guid() {
    return this._data.guid;
  }

  set guid(value: string) {
    this._data.guid = value;
  }

  set projectId(value: number) {
    this._data.projectId = value;
  }

  get projectId() {
    return this._data.projectId;
  }

  get isProject() {
    return this._data.isProject;
  }

  set isProject(value: boolean) {
    this._data.isProject = value;
  }

  get isProjectOwner() {
    return this._data.isProjectOwner;
  }

  set isProjectOwner(value: boolean) {
    this._data.isProjectOwner = value;
  }

  get prefix() {
    return this._data.prefix;
  }

  set prefix(value: string) {
    this._data.prefix = value;
  }

  async setData(value: IWidgetRepos) {
    this._data = value;
    setContractInfoByChain(this.contractInfo);
    setTransportEndpoint(this._data.transportEndpoint);
    setScomCid(this._data.scomCid);
    if (this._data.transportEndpoint) {
      setStorageConfig({
        transportEndpoint: this._data.transportEndpoint,
        signer: this._data.signer,
        baseUrl: this._data.baseUrl
      })
    }
    getPackages();
    this.renderUI();
  }

  private renderUI() {
    this.githubElm.setData({
      guid: this.guid,
      isProject: this.isProject,
      isProjectOwner: this.isProjectOwner,
      prefix: this.prefix
    })
  }

  private onRepoSearch(target: Input) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      this.githubElm.searchName = target.value;
    }, 500);
  }

  private async onCreateRepoClick() {
    if (!this.createRepoElm) {
      this.createRepoElm = new ScomWidgetReposCreateRepo(undefined, {
        id: this.guid,
        prefix: this.prefix
      });
      this.createRepoElm.onClosed = () => this.createRepoElm.closeModal();
    } else if (this.guid || this.prefix) {
      await this.createRepoElm.setData({ id: this.guid, prefix: this.prefix });
    }
    this.createRepoElm.openModal({
      width: 600,
      maxWidth: '100%',
      closeOnBackdropClick: false,
      padding: {top: '0.5rem', right: '0.5rem', bottom: 0, left: '0.5rem'}
    })
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.githubElm) {
      this.githubElm.onHide();
    }
  }

  onShow(options?: any): void {
    if (this.githubElm) this.githubElm.onShow();
  }

  onHide(): void {
    if (this.githubElm) {
      this.githubElm.onHide();
    }
  }

  async init() {
    this.i18n.init({...mainJson});
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
    return (
      <i-panel width="100%" height="100%" background={{color: Theme.background.main}}>
        <i-hstack
          class={searchPanelStyle}
          verticalAlignment="center"
          padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
          gap="0.5rem"
          wrap="wrap"
        >
          <i-panel stack={{ grow: '1' }}>
            <i-hstack position="absolute" height="100%" verticalAlignment="center" padding={{ left: '1rem' }}>
              <i-icon width={14} height={14} name="search" fill={Theme.input.fontColor} />
            </i-hstack>
            <i-input
              id="edtSearchRepo"
              width="100%"
              height={40}
              border={{ width: 1, style: 'solid', color: Theme.divider, radius: 8 }}
              placeholder={"$search_repositories"}
              onChanged={this.onRepoSearch}
            />
          </i-panel>
          <i-button
            id="btnCreateRepo"
            height={40}
            caption="$create_repository"
            padding={{ top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }}
            border={{ radius: 8 }}
            font={{ color: Theme.colors.primary.contrastText }}
            background={{ color: '#17a2b8' }}
            icon={{ name: 'plus' }}
            onClick={this.onCreateRepoClick}
          />
        </i-hstack>
        <i-panel width="100%">
          <i-vstack width="100%" gap="1.5rem" margin={{ bottom: '1.5rem' }}>
            <i-scom-widget-repos--github id="githubElm" />
          </i-vstack>
        </i-panel>
      </i-panel>
    );
  }
}

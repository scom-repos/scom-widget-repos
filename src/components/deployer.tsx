import {
  Module,
  customElements,
  ControlElement,
  Container,
  Panel,
  application,
  Styles,
  VStack
} from '@ijstech/components';
import { getPackage } from '../utils';
import { spinnerStyle } from './github/index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomWidgetReposDeployerElement extends ControlElement {
  contract?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-widget-repos--deployer"]: ScomWidgetReposDeployerElement;
    }
  }
}

@customElements('i-scom-widget-repos--deployer')
export class ScomWidgetReposDeployer extends Module {
  private pnlDeploy: Panel;
  private pnlLoader: VStack;

  private _contract: string;
  private cachedContract: Record<string, string> = {};

  get contract() {
    return this._contract;
  }
  set contract(value: string) {
    this._contract = value;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: any, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  async setData(name: string) {
    this.contract = name;
    await this.handleInit();
  }

  private async handleInit() {
    if (this.pnlLoader) this.pnlLoader.visible = true;
    this.pnlDeploy.clearInnerHTML();
    let rootDir = application.rootDir;
    if (rootDir.endsWith('/')) rootDir = rootDir.slice(0, -1);
    if (rootDir.startsWith('/')) rootDir = rootDir.slice(1);
    const mainPath = `${window.location.origin}/${rootDir ? rootDir + '/' : ''}libs/@scom/contract-deployer`;
    const scconfigPath = `${mainPath}/scconfig.json`;

    const scconfig = await fetch(scconfigPath).then(res => res.json());
    const contract = (this.contract || '').replace('scom-repos', '@scom');

    if (scconfig) {
      scconfig.contract = contract; 
      scconfig.rootDir = mainPath
    }

    try {
      const content = await this.getContent(contract);
      if (!content) throw new Error('Contract not found');
      await application.loadScript(contract, content, true);
      const module = await application.newModule(scconfig.main, scconfig);
      if (module) {
        this.pnlDeploy.append(module);
        const firstChild = module.firstChild as Panel;
        const pnlMain = firstChild?.children?.[2] as Panel;
        
        if (pnlMain) {
          const innerModule = await application.newModule("@modules/module1", scconfig);
          pnlMain.clearInnerHTML();
          pnlMain.append(innerModule);
        }
      }
    } catch (err) {
      console.error('deploy error', err);
    }

    if (this.pnlLoader) this.pnlLoader.visible = false;
  }

  private async getContent(contract: string) {
    if (this.cachedContract[contract]) return this.cachedContract[contract];
    const splitted = contract.split('/');
    const name = splitted[splitted.length - 1];
    const content = await getPackage(name);
    this.cachedContract[contract] = content;
    return content;
  }

  clear() {
    this.pnlDeploy.clearInnerHTML();
  }

  init() {
    super.init();
    const name = this.getAttribute('contract', true);
    if (name) this.setData(name);
  }

  render() {
    return (
      <i-panel width="100%" height="100%" padding={{top: '1rem'}}>
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
        <i-panel id="pnlDeploy" width="100%" height="100%"></i-panel>
      </i-panel>
    )
  }
}

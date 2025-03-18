import {
  Module,
  customElements,
  ControlElement,
  Container,
  Panel,
  application,
  Styles,
  VStack,
  Label,
  ComboBox,
  IComboItem,
  Form,
  IDataSchema,
  IUISchema,
  Icon,
  Input
} from '@ijstech/components';
import { getPackage, getScconfig, getWorkersSchemas } from '../utils';
import { spinnerStyle } from './github/index.css';
import { verify } from '@scom/scom-enclave-attestation';

const Theme = Styles.Theme.ThemeVars;

interface ScomWidgetReposDeployerElement extends ControlElement {
  contract?: string;
  onExpand?: (value: boolean) => void;
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
  private comboEnclave: ComboBox;
  private enclaveItems: IComboItem[];
  private lblVerificationMessage: Label;
  private jsonForm: Form;
  private iconExpand: Icon;
  private pnlForm: Panel;

  onExpand?: (value: boolean) => void;

  private _contract: string;
  private cachedContract: Record<string, string> = {};
  private _isExpanded: boolean = false;
  private _currentSchemas: {
    schema: any;
    uischema: any;
  } = {
    schema: {},
    uischema: {}
  };

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
    this.enclaveItems = [
      {
        label: 'Enclave 1',
        value: 'https://enclave01.decom.dev/attDoc'
      }
    ]
    await this.comboEnclave.ready();
    this.comboEnclave.items = this.enclaveItems;
    this.comboEnclave.selectedItem = this.enclaveItems[0];
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
      scconfig.type = 'widget';
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

    const pkgScconfig = await getScconfig(contract);
    if (pkgScconfig?.type === 'worker') {
      this.renderJsonForm(pkgScconfig);
    }

    if (this.pnlLoader) this.pnlLoader.visible = false;
  }

  private renderJsonForm(scconfig: Record<string, any>) {
    this.jsonForm.clearFormData();
    const workerSchemas = getWorkersSchemas(scconfig);
    this._currentSchemas = workerSchemas;
    this.jsonForm.jsonSchema = workerSchemas.schema as IDataSchema;
    this.jsonForm.uiSchema = workerSchemas.uischema as IUISchema;
    this.jsonForm.formOptions = {
      columnWidth: '100%',
      columnsPerRow: 1,
      confirmButtonOptions: {
        caption: '$confirm',
        backgroundColor: Theme.colors.primary.main,
        fontColor: Theme.colors.primary.contrastText,
        hide: true
      },
      dateTimeFormat: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
        dateTime: 'MM/DD/YYYY HH:mm'
      },
      customControls: {
        "#/properties/scheduler/properties/schedules/properties/params": {
          render: () => {
            return <i-input
              inputType="textarea"
              rows={5}
              width="100%"
              height="auto"
              resize="auto-grow"
            ></i-input>
          },
          getData: (control: Input) => {
            const value = control.value;
            return value ? JSON.parse(value) : {};
          },
          setData: (control: Input, value: Record<string, any>) => {
            console.log(value)
            control.value = value ? JSON.stringify(value) : '';
          }
        },
        "#/properties/scheduler/properties/params": {
          render: () => {
            return <i-input
              inputType="textarea"
              rows={5}
              width="100%"
              height="auto"
              resize="auto-grow"
            ></i-input>
          },
          getData: (control: Input) => {
            const value = control.value;
            return value ? JSON.parse(value) : {};
          },
          setData: (control: Input, value: Record<string, any>) => {
            control.value = value ? JSON.stringify(value) : '';
          }
        }
      }
    };
    this.jsonForm.renderForm();
    this.pnlForm.visible = true;
    this.jsonForm.setFormData(scconfig);
  }

  private async getContent(contract: string) {
    if (this.cachedContract[contract]) return this.cachedContract[contract];
    const splitted = contract.split('/');
    const name = splitted[splitted.length - 1];
    const content = await getPackage(name);
    this.cachedContract[contract] = content;
    return content;
  }

  private async onOpenVerify() {
    const moduleDir = application.currentModuleDir;
    const selectedItem = this.comboEnclave.selectedItem;
    let doc = new Uint8Array(await (await fetch(selectedItem.value)).arrayBuffer());
    let rootCert = await (await fetch("certs/aws-root.pem")).text();
    let { attDoc, verified } = await verify(doc, rootCert);
    this.lblVerificationMessage.caption = verified ? '$enclave_verification_successful' : '$enclave_verification_failed';
  }

  private handleExpand() {
    this._isExpanded = !this._isExpanded;
    if (typeof this.onExpand === 'function') {
      this.onExpand(this._isExpanded);
    }
    this.iconExpand.name = this._isExpanded ? 'compress' : 'expand';
  }

  private async onConfirmClick() {
    const data = await this.jsonForm.getFormData();
    const validated = await this.jsonForm.validate(data, this._currentSchemas.schema as any, { changing: false });
    console.log('====', data, validated);
  }

  clear() {
    this.pnlDeploy.clearInnerHTML();
    this.pnlForm.visible = false;
  }

  init() {
    super.init();
    this.onExpand = this.getAttribute('onExpand', true) || this.onExpand;
    const name = this.getAttribute('contract', true);
    if (name) this.setData(name);
  }

  render() {
    return (
      <i-panel width="100%" height="100%" padding={{ top: '1rem' }}>
        <i-panel
          width={30} height={30}
          border={{ radius: 12 }}
          hover={{ backgroundColor: Theme.action.hoverBackground }}
          cursor='pointer'
          top={-20} left={0} position='absolute'
          onClick={this.handleExpand}
        >
          <i-icon
            id="iconExpand"
            name="expand"
            width={20} height={20}
            fill={Theme.colors.primary.main}
            padding={{top: 8, left: 8}}
          ></i-icon>
        </i-panel>
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
        <i-stack direction='vertical' width="100%" height="100%">
          <i-label caption='$enclave' font={{ size: '1rem' }} margin={{ top: '0.625rem', bottom: '0.625rem' }} ></i-label>
          <i-combo-box
            id="comboEnclave"
            height={36}
            width='100%'
            icon={{ width: 14, height: 14, name: 'angle-down' }}
            border={{ radius: 5 }}
          ></i-combo-box>
          <i-button
            id="btnVerify"
            caption="$verify"
            stack={{ shrink: '0' }}
            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
            font={{ color: Theme.colors.primary.contrastText }}
            background={{ color: '#17a2b8' }}
            onClick={this.onOpenVerify}
          />
          <i-label id="lblVerificationMessage" caption="" font={{ size: '1rem' }} margin={{ top: '0.625rem', bottom: '0.625rem' }} ></i-label>
          <i-vstack id="pnlForm" visible={false} gap="0.5rem">
            <i-form id="jsonForm" width="100%" height="100%"></i-form>
            <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="end">
              <i-button
                caption='$confirm'
                padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
                onClick={this.onConfirmClick}
              ></i-button>
            </i-hstack>
          </i-vstack>
          <i-panel id="pnlDeploy" width="100%" height="100%"></i-panel>
        </i-stack>
      </i-panel>
    )
  }
}

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
  Icon,
  Input,
  Button
} from '@ijstech/components';
import { getPackage, getScconfig } from '../utils';
import { spinnerStyle } from './github/index.css';
import { verify } from '@scom/scom-enclave-attestation';
import { ScomWidgetReposForm } from './jsonForm';
import { repoJson } from '../languages/index';

const Theme = Styles.Theme.ThemeVars;

interface ScomWidgetReposDeployerElement extends ControlElement {
  contract?: string;
  onExpand?: (value: boolean) => void;
  onChange?: (target: ScomWidgetReposDeployer) => void;
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
  private lblVerificationStatus: Label;
  private iconExpand: Icon;
  private formEl: ScomWidgetReposForm;
  private contractWiget: any;
  private pnlEnclave: Panel;
  private edtUserData: Input;
  private lblPublicKey: Label;
  private lblUserData: Label;
  private lblNonce: Label;
  private pnlVerificationResult: Panel;
  private pnlPrevNext: Panel;
  private btnPrev: Button;
  private btnNext: Button;

  onExpand?: (value: boolean) => void;

  private _contract: string;
  private cachedContract: Record<string, string> = {};
  private _isExpanded: boolean = false;

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
    const contract = (this.contract || '').replace('scom-repos', '@scom');
    const contractScript = await this.getContent(contract);

    if (!this.contractWiget) {
      const lib = await application.loadPackage('@scom/contract-deployer-widget');
      const contractWiget = await lib.create({ contract, script: contractScript });
      this.contractWiget = contractWiget;
      this.pnlDeploy.append(contractWiget);
    } else {
      await this.contractWiget.setData({ contract, script: contractScript });
    }

    const pkgScconfig = await getScconfig(contract);
    const parsedScconfig = pkgScconfig ? JSON.parse(pkgScconfig) : null;
    this.pnlDeploy.visible = parsedScconfig?.type === 'contract';
    this.pnlEnclave.visible = parsedScconfig?.type === 'worker';
    this.pnlPrevNext.visible = parsedScconfig?.type === 'worker';
    if (parsedScconfig?.type === 'worker') {
      this.formEl.setData({ value: pkgScconfig });
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

  private toHexString(arr: Uint8Array) {
    return Array.from(arr, i => i.toString(16).padStart(2, "0")).join("");
  }

  private toPossibleString(arr: Uint8Array) {
    return Array.from(arr).some(i => i < 32 || i > 126) ? this.toHexString(arr) : new TextDecoder().decode(arr)
  }

  private async onOpenVerify() {
    const moduleDir = application.currentModuleDir;
    const selectedItem = this.comboEnclave.selectedItem;
    const nonce = this.toHexString(window.crypto.getRandomValues(new Uint8Array(32)));
    let url = `${selectedItem.value}?nonce=${nonce}&publicKey=abcd`;
    if (this.edtUserData.value) {
      url += `&userData=${this.edtUserData.value}`;
    }
    let attDoc;
    let verified;
    try {
      let doc = new Uint8Array(await (await fetch(url)).arrayBuffer());
      let rootCert = await (await fetch("certs/aws-root.pem")).text();
      let verifyResult = await verify(doc, rootCert);
      attDoc = verifyResult.attDoc;
      verified = verifyResult.verified;
    }
    catch (e) {
      console.error(e);
    }
    console.log(attDoc, verified);
    this.pnlVerificationResult.visible = true;
    this.lblVerificationStatus.caption = verified?.result ? '$verified' : '$check_needed';
    if (attDoc) {
      this.lblPublicKey.caption = this.toPossibleString(attDoc.public_key);
      this.lblUserData.caption = this.toPossibleString(attDoc.user_data);
      this.lblNonce.caption = this.toPossibleString(attDoc.nonce);
    }
  }

  private handleExpand() {
    this._isExpanded = !this._isExpanded;
    if (typeof this.onExpand === 'function') {
      this.onExpand(this._isExpanded);
    }
    this.iconExpand.name = this._isExpanded ? 'compress' : 'expand';
  }

  private handlePrev() {
    this.pnlEnclave.visible = true;
    this.formEl.visible = false;
    this.btnPrev.visible = false;
    this.btnNext.visible = true;
  }

  private handleNext() {
    this.pnlEnclave.visible = false;
    this.formEl.visible = true;
    this.btnPrev.visible = true;
    this.btnNext.visible = false;
  }

  clear() {
    this.pnlEnclave.visible = false;
    this.formEl.visible = false;
    this.pnlVerificationResult.visible = false;
    this.pnlPrevNext.visible = false;
    this.btnPrev.visible = false;
    this.btnNext.visible = true;
  }

  init() {
    this.i18n.init({ ...repoJson });
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
            padding={{ top: 8, left: 8 }}
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
          <i-stack direction='vertical' width="100%" gap="0.5rem" id='pnlEnclave' visible={false}>
            <i-label caption='$enclave' font={{ size: '1rem' }} margin={{ top: '0.625rem', bottom: '0.625rem' }} ></i-label>
            <i-combo-box
              id="comboEnclave"
              height={36}
              width='100%'
              icon={{ width: 14, height: 14, name: 'angle-down' }}
              border={{ radius: 5 }}
            ></i-combo-box>
            <i-label caption='$user_data' font={{ size: '1rem' }} margin={{ top: '0.625rem', bottom: '0.625rem' }} ></i-label>
            <i-input
              id="edtUserData"
              inputType={'textarea'}
              rows={4}
              height={'unset'}
              width={'100%'}
              padding={{ left: '0.5rem', right: '0.5rem' }}
              border={{ radius: 5 }}
            ></i-input>
            <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="end">
              <i-button
                id="btnVerify"
                caption='$verify'
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                onClick={this.onOpenVerify}
              ></i-button>
            </i-hstack>
            <i-stack id="pnlVerificationResult" direction='vertical' width="100%" gap="0.5rem" visible={false}>
              <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="space-between" gap={10}>
                <i-label caption='$verification_status' font={{ bold: true, size: '1rem' }}></i-label>
                <i-label id="lblVerificationStatus" font={{ size: '1rem' }}></i-label>
              </i-stack>
              <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="space-between" gap={10}>
                <i-label caption='$public_key' font={{ bold: true, size: '1rem' }}></i-label>
                <i-label id="lblPublicKey" font={{ size: '1rem' }}></i-label>
              </i-stack>
              <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="space-between" gap={10}>
                <i-label caption='$user_data' font={{ bold: true, size: '1rem' }}></i-label>
                <i-label id="lblUserData" font={{ size: '1rem' }}></i-label>
              </i-stack>
              <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="space-between" gap={10}>
                <i-label caption='$nonce' font={{ bold: true, size: '1rem' }}></i-label>
                <i-label id="lblNonce" font={{ size: '1rem' }}></i-label>
              </i-stack>
            </i-stack>
          </i-stack>
          <i-scom-widget-repos--form
            id="formEl"
            width="100%"
            stack={{ 'grow': '1' }}
            maxHeight={`100%`}
            display='block'
            visible={false}
          />
          <i-hstack gap="0.5rem" verticalAlignment="center" visible={false} id="pnlPrevNext">
              <i-button
                id="btnPrev"
                caption='$prev'
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                onClick={this.handlePrev}
                visible={false}
              ></i-button>
              <i-button
                id="btnNext"
                caption='$next'
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                onClick={this.handleNext}
              ></i-button>
            </i-hstack>
          <i-panel id="pnlDeploy" width="100%" height="100%" visible={false}></i-panel>
        </i-stack>
      </i-panel>
    )
  }
}

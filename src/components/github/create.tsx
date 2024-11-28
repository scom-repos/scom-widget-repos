import {
  Module,
  Input,
  Button,
  Styles,
  Container,
  customElements,
  Alert,
  Label,
  ControlElement,
} from '@ijstech/components';
import { inputStyle, textareaStyle } from './index.css';
import { createRepo } from '../../utils/index';
import { isLoggedIn } from "../../store/index";
import { repoJson } from '../../languages/index';

const Theme = Styles.Theme.ThemeVars;

interface ScomWidgetReposCreateRepoElement extends ControlElement {
  id?: string;
  prefix?: string;
  onClosed?: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-widget-repos--create-repo"]: ScomWidgetReposCreateRepoElement;
    }
  }
}

@customElements('i-scom-widget-repos--create-repo')
export class ScomWidgetReposCreateRepo extends Module {
  private projectGuid: string;
  private projectPrefix: string;

  private lbPrefix: Label;
  private edtName: Input;
  private edtDescription: Input;
  private btnConfirm: Button;
  private mdAlert: Alert;

  onClosed: () => void;

  constructor(parent?: Container, options?: ScomWidgetReposCreateRepoElement) {
    super(parent, options);
  }

  static async create(options?: ScomWidgetReposCreateRepoElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  init() {
    this.i18n.init({...repoJson});
    super.init();
    this.onClosed = this.getAttribute('onClosed', true) || this.onClosed;
    const id = this.getAttribute('id', true);
    const prefix = this.getAttribute('prefix', true);
    if (id || prefix) this.setData({ id, prefix });
  }

  async setData(options?: any) {
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
    this.projectPrefix = options.prefix  || '';
    if (!this.projectPrefix) {
      this.setMessage({
        status: 'error',
        content: '$please_add_a_prefix_to_the_project_first',
        onClose: () => {
          if (typeof this.onClosed === 'function') this.onClosed();
        }
      });
      this.mdAlert.showModal();
    } else {
      if (!this.lbPrefix.isConnected) await this.lbPrefix.ready();
      this.lbPrefix.caption = `${this.projectPrefix}-`;
    }
  }

  clear() {
    if (this.lbPrefix) this.lbPrefix.caption = '';
    if (this.edtName) this.edtName.value = '';
    if (this.edtDescription) this.edtDescription.value = '';
    if (this.btnConfirm) this.btnConfirm.enabled = false;
  }

  private updateButton() {
    this.btnConfirm.enabled = !!(this.edtName.value && this.projectPrefix);
  }

  private setMessage(message: {status?: string, content?: string, title?: string, link?: any, onClose?: any, onConfirm?: any}) {
    const { status, content, title, link, onClose, onConfirm } = message;
    if (title !== undefined) this.mdAlert.title = title;
    if (content !== undefined) this.mdAlert.content = content;
    if (status !== undefined) this.mdAlert.status = status;
    if (link) this.mdAlert.link = link;
    if (typeof onClose === 'function') this.mdAlert.onClose = onClose;
    if (typeof onConfirm === 'function') this.mdAlert.onConfirm = onConfirm;
  }

  private async handleConfirmClick() {
    if (!isLoggedIn()) {
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
      const result = await createRepo(repoInfo);
      if (!result || result.error) {
        this.setMessage({
          status: 'error',
          content: result?.error || '$failed_to_create_your_repository'
        })
        this.mdAlert.showModal();
      } else {
        this.setMessage({
          status: 'success',
          content: '$your_repository_has_been_created_successfully',
          onClose: () => {
            if (typeof this.onClosed === 'function') this.onClosed();
          }
        });
        this.mdAlert.showModal();
        this.btnConfirm.rightIcon.visible = false;
        this.clear();
        return;
      }
    } catch (err) {
      this.setMessage({
        status: 'error',
        content: '$failed_to_create_your_repository'
      })
      this.mdAlert.showModal();
    }
    this.btnConfirm.enabled = true;
    this.btnConfirm.rightIcon.visible = false;
  }

  render() {
    return (
      <i-panel width="100%" height="100%">
        <i-panel width="100%" height="100%" overflow={{ y: 'auto' }}>
          <i-vstack
            width="100%"
            padding={{ top: "1rem", bottom: "1.5rem", left: "1rem", right: "1rem" }}
            gap="1.5rem"
          >
            {/* <i-hstack
              gap="0.5rem" margin={{ bottom: '0.5rem' }}
              verticalAlignment="center" class="pointer"
              visible={false}
            >
              <i-icon name="arrow-left" width={12} height={12} fill={Theme.text.primary} />
              <i-label caption="Back" font={{ size: '0.75rem' }} />
            </i-hstack> */}
            <i-hstack horizontalAlignment="space-between" gap="8px">
              <i-label caption="$create_new_repository" font={{ size: '1.25rem', weight: 600 }} lineHeight={1.5} />
            </i-hstack>
            <i-vstack width="100%" gap="0.5rem">
              <i-panel>
                <i-label display="inline" caption="$repository_name" margin={{ right: "0.25rem" }} />
                <i-label display="inline" caption="*" font={{ color: Theme.colors.error.main }} />
              </i-panel>
              <i-hstack gap="0.15rem" verticalAlignment="center" border={{ width: 1, style: 'solid', color: Theme.divider, radius: 5 }}>
                <i-label id="lbPrefix" padding={{ left: '0.75rem' }} font={{ bold: true, color: Theme.colors.primary.main }} />
                <i-input
                  id="edtName"
                  class={inputStyle}
                  inputType={'text'}
                  height={40}
                  width={'100%'}
                  onChanged={this.updateButton}
                />
              </i-hstack>
            </i-vstack>
            <i-vstack width="100%" gap="0.5rem">
              <i-label caption="$description" />
              <i-panel class="form-control">
                <i-input
                  id="edtDescription"
                  class={textareaStyle}
                  inputType={'textarea'}
                  rows={3}
                  height={'unset'}
                  width={'100%'}
                />
              </i-panel>
            </i-vstack>
            <i-hstack justifyContent={'end'} alignItems={'center'}>
              <i-button
                id="btnConfirm"
                height={40}
                minWidth={120}
                enabled={false}
                caption={'$confirm'}
                rightIcon={{ spin: true, visible: false }}
                padding={{ top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }}
                font={{ color: Theme.colors.primary.contrastText }}
                onClick={this.handleConfirmClick.bind(this)}
              />
            </i-hstack>
          </i-vstack>
        </i-panel>
        <i-alert id="mdAlert" />
      </i-panel>
    )
  }
}

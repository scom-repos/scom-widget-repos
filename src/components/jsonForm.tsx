import {
  customElements,
  ControlElement,
  Module,
  Container,
  Form,
  Input,
  IDataSchema,
  IUISchema,
  Styles
} from "@ijstech/components"
import { ScomCodeEditor, Monaco } from "@scom/scom-code-editor";
import { codeTabsStyle } from "./deployer.css";
import { getWorkersSchemas } from "../utils/index";
import { componentsJson } from "../languages/index";

const Theme = Styles.Theme.ThemeVars;

interface ScomWidgetReposjsonFormement extends ControlElement {
  value?: string;
  onChange?: (target: ScomWidgetReposForm) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-widget-repos--form']: ScomWidgetReposjsonFormement;
    }
  }
}

interface IGuideForm {
  value?: string;
}

@customElements('i-scom-widget-repos--form')
export class ScomWidgetReposForm extends Module {
  private codeEditor: ScomCodeEditor;
  private jsonForm: Form;

  private _data: IGuideForm = { value: '' };
  private isInited: boolean = false;
  private _currentSchemas: {
    schema: any;
    uischema: any;
  } = {
    schema: {},
    uischema: {}
  };

  onChange: (target: ScomWidgetReposForm) => void

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomWidgetReposjsonFormement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get parseData() {
    try {
      return JSON.parse(this.value);
    } catch (err) {
      return {};
    }
  }

  set value(data: string) {
    this._data.value = data;
  }
  get value() {
    return this._data.value;
  }

  setData(value: IGuideForm) {
    this._data = value;
    this.renderJsonForm();
    this.renderEditor();
  }

  private renderJsonForm() {
    const scconfig = this.parseData;
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
            ></i-input>
          },
          getData: (control: Input) => {
            const value = control.value;
            return value ? JSON.parse(value) : {};
          },
          setData: (control: Input, value: Record<string, any>) => {
            control.value = value ? JSON.stringify(value) : '';
          }
        },
        "#/properties/scheduler/properties/params": {
          render: () => {
            return <i-input
              inputType="textarea"
              rows={5}
              width="100%"
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
    this.jsonForm.setFormData(scconfig);
    this.initEvents();
  }


  private initEvents() {
    const inputs = this.jsonForm.querySelectorAll('[scope]');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i] as Input;
      input.onChanged = async () => {
        const data = await this.jsonForm.getFormData();
        this.value = JSON.stringify({ ...this.parseData, ...data }, null, 2);
        if (this.codeEditor) this.renderEditor();
        if (this.onChange) this.onChange(this);
      }
    }
  }

  private renderEditor() {
    if (this.codeEditor) this.codeEditor.loadContent(this.value, 'json', 'scconfig.json');
  }

  private handleCodeEditorChange() {
    this.value = this.codeEditor.value;
    if (this.jsonForm && this.jsonForm.isConnected) this.renderJsonForm();
    if (this.onChange && this.isInited) this.onChange(this);
    this.isInited = true;
  }

  private async onConfirmClick() {
    const data = await this.jsonForm.getFormData();
    const validated = await this.jsonForm.validate(data, this._currentSchemas.schema as any, { changing: false });
    console.log('====', data, validated);
  }

  getErrors(): Monaco.editor.IMarker[] {
    return this.codeEditor.getErrors();
  }

  dispose() {
    if (!this.codeEditor) return;
    this.codeEditor.dispose();
  }

  disposeEditor() {
    if (!this.codeEditor) return;
    if ('disposeEditor' in this.codeEditor && typeof this.codeEditor?.disposeEditor === 'function')
      this.codeEditor.disposeEditor();
    this.codeEditor.onChange = null;
  }

  init() {
    this.i18n.init({ ...componentsJson });
    super.init();
    this.onChange = this.getAttribute('onChange', true) || this.onChange;
    const value = this.getAttribute('value', true);
    if (value) this.setData({ value });
  }

  render() {
    return (
      <i-vstack
        width={'100%'} height={`100%`}
        overflow={'hidden'}
        position='relative'
      >
        <i-tabs
          id="formTabs"
          stack={{ 'grow': '1' }}
          maxHeight={`100%`}
          class={codeTabsStyle}
        >
          <i-tab
            caption="$form"
          >
            <i-vstack gap="0.5rem">
              <i-form id="jsonForm" width="100%" height="100%"></i-form>
              <i-hstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="end">
                <i-button
                  caption='$confirm'
                  padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                  onClick={this.onConfirmClick}
                ></i-button>
              </i-hstack>
            </i-vstack>
          </i-tab>
          <i-tab
            caption="$raw_json"
          >
            <i-scom-code-editor
              id="codeEditor"
              width={'100%'}
              height={500}
              display="block"
              onChange={this.handleCodeEditorChange}
            />
          </i-tab>
        </i-tabs>
      </i-vstack>
    )
  }
}

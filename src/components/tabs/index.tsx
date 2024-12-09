import { Module, Styles, ControlElement, customElements, HStack, Container, Label } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

interface ITabs {
  items: any[];
  activeTab?: string;
}

interface ScomTabsElement extends ControlElement {
  items?: any[];
  activeTab?: string;
  onChanged?: (target: HStack) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-widget-repos--tabs']: ScomTabsElement;
    }
  }
}

@customElements('i-scom-widget-repos--tabs')
export class ScomWidgetReposTabs extends Module {
  private _data: ITabs = {
    items: []
  };
  private elmsMapper: Record<string, HStack> = {};

  private pnlList: HStack;

  onChanged: (target: HStack) => void;

  constructor(parent?: Container, options?: ScomTabsElement) {
    super(parent, options);
  }

  set items(value: any[]) {
    this._data.items = value || [];
    if (!this.activeTab) {
      this._data.activeTab = this.items[0]?.tag;
    }
    this.renderItems();
  }

  get items() {
    return this._data.items || [];
  }

  get activeTab() {
    return this._data.activeTab;
  }

  set activeTab(value: string) {
    this._data.activeTab = value;
    this.renderItems();
  }

  setData(data: ITabs) {
    this._data = data;
    if (!this.activeTab) this.activeTab = this.items[0]?.tag;
    this.renderItems();
  }

  updateCount(tag: string, count: number) {
    const elm = this.elmsMapper[tag];
    if (elm) {
      const child = elm.children?.[1] as Label;
      if (child) {
        child.caption = `(${count || 0})`;
        child.visible = true;
      }
    }
  }

  private renderItems() {
    this.pnlList.clearInnerHTML();
    this.items.forEach(item => {
      const { caption, tag, count, hasCount } = item;
      const isActive = this.activeTab === tag;
      const itemElm = (
        <i-hstack
          id={`tab${tag}`}
          verticalAlignment="center" horizontalAlignment="center"
          gap="0.25rem" cursor="pointer"
          border={{ radius: '0.25rem', color: Theme.divider, style: 'solid', width: '1px' }}
          background={{ color: isActive ? Theme.action.hoverBackground : 'transparent' }}
          tag={tag}
          hover={{ backgroundColor: isActive ? Theme.action.hoverBackground : 'transparent' }}
          stack={{ grow: '1' }}
          minHeight={36}
          onClick={this.onTabClick}
        >
          <i-label caption={caption} font={{ size: '0.875rem', color: isActive ? Theme.action.hover : Theme.text.primary, weight: isActive ? 600 : 400 }} />
          <i-label caption={`(${count})` || "(0)"} font={{ size: '0.875rem', color: Theme.colors.primary.main, weight: isActive ? 600 : 400 }} visible={hasCount} />
        </i-hstack>
      )
      this.pnlList.append(itemElm);
      this.elmsMapper[tag] = itemElm;
    })
  }

  private onTabClick(target: HStack) {
    const oldTab = this.activeTab && this.elmsMapper[this.activeTab];
    if (oldTab) {
      oldTab.background = { color: 'transparent' };
      const firtChild = oldTab.children?.[0] as Label;
      firtChild.font = { size: '0.875rem' };
      const secondChild = oldTab.children?.[1] as Label;
      secondChild.font = { size: '0.875rem', color: Theme.colors.primary.main };
    }
    this.activeTab = target.tag;
    target.background = { color: Theme.action.hoverBackground };
    const firtChild = target.children?.[0] as Label;
    firtChild.font = { size: '0.875rem', color: Theme.action.hover, weight: 600 };
    const secondChild = target.children?.[1] as Label;
    secondChild.font = { size: '0.875rem', color: Theme.colors.primary.main, weight: 600 };
    if (typeof this.onChanged === 'function') {
      this.onChanged(target);
    }
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged') || this.onChanged;
    this.onTabClick = this.onTabClick.bind(this);
    const items = this.getAttribute('items');
    const activeTab = this.getAttribute('activeTab');
    if (items) this.setData({ items, activeTab });
  }

  render(): void {
    return (
      <i-hstack
        id="pnlList"
        verticalAlignment="center" horizontalAlignment="center"
        gap="0.25rem" overflow="hidden"
        stack={{ grow: '1' }}
      ></i-hstack>
    )
  }
}
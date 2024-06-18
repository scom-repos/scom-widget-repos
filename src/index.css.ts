import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const searchPanelStyle = Styles.style({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    $nest: {
      'input': {
        width: '100% !important',
        padding: '0.25rem 1rem 0.25rem 2.5rem'
      },
      'i-combo-box .selection': {
        border: 0
      },
      'i-combo-box > .icon-btn': {
        border: 0
      }
    }
})

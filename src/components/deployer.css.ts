import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

export const codeTabsStyle = Styles.style({
  $nest: {
    "> .tabs-nav-wrap": {
      background: "#181818",
      $nest: {
        'i-tab:not(.disabled).active': {
          borderTop: `1px solid ${Theme.colors.primary.main}`
        }
      }
    },
    "> .tabs-content": {
      maxHeight: "calc(100% - 36px)",
    },
  },
});
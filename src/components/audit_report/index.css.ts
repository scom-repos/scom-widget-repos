import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export default Styles.style({
  '$nest': {
    '&::-webkit-scrollbar-track': {
      borderRadius: '12px',
      border: '1px solid transparent',
      backgroundColor: 'unset'
    },
    '&::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: 'unset'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '12px',
      background: '#34343A 0% 0% no-repeat padding-box'
    },
    'i-checkbox label': {
      padding: '5px 20px',
      width: '100%',
      height: '100% !important'
    },
    'i-input textarea': {
      background: 'transparent',
      color: Theme.text.primary,
      border: 0,
      fontFamily: Theme.typography.fontFamily,
      fontSize: Theme.typography.fontSize
    }
  },
})

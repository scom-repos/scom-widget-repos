import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const githubStyle = Styles.style({
    $nest: {
        '.list-repos': {
            borderRadius: '0.35rem',
            border: `1px solid ${Theme.divider}`,
            $nest: {
                'i-scom-widget-repos--github-repo:not(:last-of-type)': {
                    borderBottom: `1px solid ${Theme.divider}`
                }
            }
        },
        'i-pagination': {
            $nest: {
                '.paginate_button': {
                    border: `1px solid ${Theme.divider}`,
                    $nest: {
                        '&.active': {
                            backgroundColor: Theme.colors.primary.main,
                            borderColor: Theme.colors.primary.main,
                            color: Theme.text.primary
                        },
                        '&.disabled': {
                            opacity: 0.8
                        }
                    }
                }
            }
        },
        '.icon-expansion:hover': {
            borderRadius: '0.35rem',
            background: Theme.action.focus
        },
        '.icon-hover:hover': {
            opacity: 0.85
        },
        '#btnShowPublish.disabled': {
            opacity: 0.85
        }
    }
});

const spin = Styles.keyframes({
    "to": {
        "-webkit-transform": "rotate(360deg)"
    }
});

export const spinnerStyle = Styles.style({
    display: "inline-block",
    width: "50px",
    height: "50px",
    border: "3px solid rgba(255,255,255,.3)",
    borderRadius: "50%",
    borderTopColor: Theme.colors.primary.main,
    "animation": `${spin} 1s ease-in-out infinite`,
    "-webkit-animation": `${spin} 1s ease-in-out infinite`
})

export const modalStyle = Styles.style({
    $nest: {
        '.modal': {
            padding: 0,
            borderRadius: 4
        }
    }
})

export const inputStyle = Styles.style({
    $nest: {
        'input': {
            width: '100%',
            padding: '0.5rem 0.5rem 0.5rem 0.25rem',
            border: 'none',
            borderTopRightRadius: '0.25rem',
            borderBottomRightRadius: '0.25rem'
        }
    }
})

export const textareaStyle = Styles.style({
    $nest: {
        'textarea': {
            border: `1px solid ${Theme.divider}`,
            borderRadius: 5,
            outline: 'none',
            padding: '0.5rem 0.75rem',
            fontSize: Theme.typography.fontSize,
            fontFamily: Theme.typography.fontFamily
        },
        '&.disabled': {
            opacity: 1,
            $nest: {
                'textarea': {
                    background: Theme.action.disabledBackground
                }
            }
        }
    }
})

export const inputDateStyle = Styles.style({
    background: Theme.input.background,
    position: 'relative',
    $nest: {
        'input[type="text"]': {
            background: 'transparent',
            height: '40px !important',
            width: '100% !important',
            border: 'none',
            padding: '1rem 0.75rem',
            color: '#fff',
            $nest: {
                '&::placeholder': {
                    color: '#8d8fa3',
                },
            }
        },
        '.datepicker-toggle': {
            display: 'flex',
            width: '100% !important',
            height: '100% !important',
            padding: 0,
            position: 'absolute',
            top: 0,
            margin: 0,
            background: 'transparent',
            border: 'none'
        },
        '.datepicker-toggle:hover': {
            background: 'transparent'
        },
        'i-icon': {
            width: '100%',
        },
        'svg': {
            display: 'none',
        }
    }
})

export const tabStyle = Styles.style({
    gap: '1rem',
    $nest: {
        '> .tabs-nav-wrap': {
            margin: 0,
            position: 'sticky',
            top: 60,
            height: 'fit-content',
            background: Theme.background.main,
            zIndex: 1,
            paddingBottom: '0.5rem',
            $nest: {
                '.tabs-nav': {
                    border: 0,
                    gap: '0.25rem',
                    width: '100%'
                },
                'i-tab': {
                    minWidth: 120,
                    background: 'transparent',
                    border: `1px solid ${Theme.divider} !important`,
                    borderRadius: '0.25rem',
                    color: Theme.text.primary,
                    fontFamily: Theme.typography.fontFamily,
                    fontSize: '0.875rem',
                    marginBottom: 0,
                },
                'i-tab:not(.disabled).active': {
                    background: Theme.action.activeBackground,
                    color: Theme.action.hover,
                    fontWeight: 600,
                },
                'i-tab:not(.disabled):hover': {
                    background: Theme.action.hoverBackground,
                    color: Theme.action.hover
                },
                'i-tab .tab-item': {
                    padding: '0.5rem 0.75rem',
                    margin: 'auto'
                },
            }
        },
        '> .tabs-content': {
            paddingBottom: '1rem',
            minHeight: '60px',
            overflow: 'visible',
            $nest: {
                'i-table table': {
                    background: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07));'
                }
            }
        }
    }
})


export const childTabStyle = Styles.style({
    gap: '1rem',
    maxHeight: '33rem',
    $nest: {
        '> .tabs-nav-wrap': {
            margin: 0,
            position: 'sticky',
            height: 'fit-content',
            background: Theme.background.main,
            zIndex: 1,
            paddingBottom: '0.5rem',
            $nest: {
                '.tabs-nav': {
                    border: 0,
                    gap: '0.25rem',
                    width: '100%'
                },
                'i-tab': {
                    minWidth: 120,
                    background: 'transparent',
                    border: `1px solid ${Theme.divider} !important`,
                    borderRadius: '0.25rem',
                    color: Theme.text.primary,
                    fontFamily: Theme.typography.fontFamily,
                    fontSize: '0.875rem',
                    marginBottom: 0,
                },
                'i-tab:not(.disabled).active': {
                    background: Theme.action.activeBackground,
                    color: Theme.action.hover,
                    fontWeight: 600,
                },
                'i-tab:not(.disabled):hover': {
                    background: Theme.action.hoverBackground,
                    color: Theme.action.hover
                },
                'i-tab .tab-item': {
                    padding: '0.5rem 0.75rem',
                    margin: 'auto'
                },
            }
        },
        '> .tabs-content': {
            paddingBottom: '1rem',
            minHeight: '60px',
            maxHeight: '30rem',
            overflow: 'auto',
            $nest: {
                'i-table table': {
                    background: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07));'
                }
            }
        }
    }
})

export const customModalStyle = Styles.style({
    $nest: {
        '.modal > div:last-child': {
            height: '100%',
            width: '100%',
            clear: 'both',
            display: 'block',
            position: 'relative'
        }
    }
})
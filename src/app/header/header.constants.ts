export const HEADER_CONTAINER_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  userSelect: 'none',
  gap: '0.5rem'
};

export const SUBTITLE_CONTAINER_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '0.25rem',
  width: '100%'
};

export const BUTTON_DECK_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
  width: '100%',
  marginTop: '0.25rem'
};

export const UNIFIED_BUTTON_STYLES: Partial<CSSStyleDeclaration> = {
  fontFamily: 'sans-serif',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  textDecoration: 'none',
  borderRadius: '4px',
  padding: '0.35rem 0.75rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '32px',
  lineHeight: '1',
  margin: '0'
};
export const ANALYTICS_CONTAINER_STYLES: Partial<CSSStyleDeclaration> = {
  width: '100%',
  maxWidth: '1200px',
  margin: '2rem auto 0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  boxSizing: 'border-box',
  fontFamily: 'sans-serif',
  color: '#e0e0e0',
  padding: '0 1rem'
};

export const PROMPT_HEADER_STYLES: Partial<CSSStyleDeclaration> = {
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '1.75rem',
  fontWeight: 'bold',
  color: '#ff6600',
  margin: '0',
  width: '100%',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  display: 'block'
};

export const SEARCH_DECK_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  background: '#1a1a1a',
  padding: '1.25rem',
  borderRadius: '6px',
  boxSizing: 'border-box',
  border: '1px solid #2f2f2f'
};

export const CONTROL_ROW_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
  width: '100%'
};

export const ADVANCED_PANEL_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'none',
  flexDirection: 'row',
  gap: '1rem',
  flexWrap: 'wrap',
  width: '100%',
  borderTop: '1px solid #2f2f2f',
  paddingTop: '1rem',
  marginTop: '0.25rem'
};

export const INPUT_CONTROL_STYLES: Partial<CSSStyleDeclaration> = {
  fontFamily: 'sans-serif',
  fontSize: '0.95rem',
  padding: '0.4rem 0.75rem',
  backgroundColor: '#2a2a2a',
  border: '1px solid #444444',
  borderRadius: '4px',
  color: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  height: '36px'
};

export const ADVANCED_TOGGLE_STYLES: Partial<CSSStyleDeclaration> = {
  background: 'none',
  border: '1px solid #ff6600',
  borderRadius: '4px',
  color: '#ff6600',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  padding: '0.4rem 0.75rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '36px',
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: 'all 0.2s ease'
};

export const GRID_CONTAINER_STYLES: Partial<CSSStyleDeclaration> = {
  width: '100%',
  maxWidth: '1200px',
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  boxSizing: 'border-box'
};

export const GRID_LAYOUT_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
  width: '100%'
};

export const CARD_BASE_STYLES: Partial<CSSStyleDeclaration> = {
  backgroundColor: '#242424',
  borderLeft: '4px solid #a239ca',
  borderRadius: '4px',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
  boxSizing: 'border-box'
};
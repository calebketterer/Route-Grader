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
  // Hard defaults to a clean 2-column layout on desktop screens
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
export const QR_CONTAINER_STYLES: Partial<CSSStyleDeclaration> = {
  width: '100%',
  maxWidth: '600px',
  margin: '3rem auto 0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  boxSizing: 'border-box',
  fontFamily: 'sans-serif',
  color: '#e0e0e0',
  padding: '2rem',
  background: '#1a1a1a',
  borderRadius: '8px',
  border: '1px solid #2f2f2f',
  textAlign: 'center'
};

export const QR_HEADER_STYLES: Partial<CSSStyleDeclaration> = {
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '2rem',
  fontWeight: 'bold',
  color: 'rgb(255, 180, 0)',
  margin: '0',
  padding: '0',
  width: '100%'
};

export const QR_SUBTEXT_STYLES: Partial<CSSStyleDeclaration> = {
  fontSize: '1rem',
  color: '#a0a0a0',
  margin: '0.25rem 0 0 0',
  padding: '0',
  lineHeight: '1.4'
};

// Muted 4-sided gradient framing wrapper
export const QR_IMAGE_WRAPPER_STYLES: Partial<CSSStyleDeclaration> = {
  width: '300px',
  height: '300px',
  // Replaced blinding white with a soft mid-gray (#555555) that dissolves smoothly into the exact background color (#1a1a1a) on all edges
  backgroundImage: 'radial-gradient(ellipse at center, #555555 30%, #1a1a1a 70%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '1.5rem',
  borderRadius: '0px',
  boxShadow: 'none',
  border: 'none',
  boxSizing: 'border-box'
};

export const QR_IMAGE_STYLES: Partial<CSSStyleDeclaration> = {
  width: '220px',
  height: '220px',
  backgroundColor: 'transparent',
  objectFit: 'contain'
};

export const QR_ACTION_ROW_STYLES: Partial<CSSStyleDeclaration> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '1rem'
};

export const QR_BUTTON_STYLES: Partial<CSSStyleDeclaration> = {
  fontFamily: 'sans-serif',
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '0.6rem 1.2rem',
  backgroundColor: 'transparent',
  border: '1px solid rgb(255, 180, 0)',
  borderRadius: '4px',
  color: 'rgb(255, 180, 0)',
  cursor: 'pointer',
  outline: 'none',
  boxSizing: 'border-box',
  height: '42px',
  width: '240px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  userSelect: 'none',
  textDecoration: 'none',
  whiteSpace: 'nowrap'
};

export const QR_PRIMARY_YELLOW_BUTTON_STYLES: Partial<CSSStyleDeclaration> = {
  ...QR_BUTTON_STYLES,
  backgroundColor: 'rgb(255, 180, 0)',
  color: '#1a1a1a'
};
export function getSitemapLastmod() {
  return new Date().toISOString().split('T')[0];
}

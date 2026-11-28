/**
 * Return a tiny 404 for common vulnerability-scan paths.
 * Netlify redirect splats can only appear at the end of a path, so
 * patterns such as /*.php and /.env* have to be matched here.
 */
export default () =>
  new Response("Not found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
      "x-robots-tag": "noindex",
    },
  });

// Covers: /.env, /.env.*, /.env/*, /.git/*, /wp-login.php, /xmlrpc.php,
// /phpinfo.php, /wp-admin/*, /wp-content/*, /wp-includes/*, and any other *.php path.
export const config = {
  pattern:
    "^/(?:\\.env(?:$|[./].*)|\\.git(?:/.*)?|[Ww][Pp]-[Aa][Dd][Mm][Ii][Nn](?:/.*)?|[Ww][Pp]-[Cc][Oo][Nn][Tt][Ee][Nn][Tt](?:/.*)?|[Ww][Pp]-[Ii][Nn][Cc][Ll][Uu][Dd][Ee][Ss](?:/.*)?|.*\\.[Pp][Hh][Pp])$",
};

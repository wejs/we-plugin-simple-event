const setCanonicalURL = require('./setCanonicalURL.js');

function metatagFindAll(req, res, next) {
  const siteName = (req.we.systemSettings.siteName || req.we.config.appName);
  const hostname = req.we.config.hostname;
  const we = req.we;

  setCanonicalURL(req, res);

  res.locals.metatag +=
    '<meta property="og:url" content="'+hostname+req.urlBeforeAlias+'" />'+
    '<meta property="og:title" content="Eventos do site '+siteName+'" />' +
    '<meta property="og:site_name" content="'+siteName+'" />'+
    '<meta property="og:type" content="website" />'+
    '<meta content="'+siteName+'" itemprop="name">';

  if (we.systemSettings.siteDescription) {
    const description = we.utils.stripTagsAndTruncate(
      we.systemSettings.siteDescription, 200
    );
    res.locals.metatag += '<meta property="og:description" content="'+
      description+
    '" />';
    res.locals.metatag += '<meta content="'+description+'" name="description">';
    res.locals.metatag += '<meta content="'+description+'" name="twitter:description">';
  }

  if (we.systemSettings.ogImageUrlOriginal) {
    const imageUrl = we.systemSettings.ogImageUrlOriginal
    res.locals.metatag +=
      '<meta property="og:image" content="'+hostname+imageUrl+'" />';
  }

  if (we.systemSettings.metatagKeywords) {
    res.locals.metatag +=
      '<meta name="keywords" content="'+we.systemSettings.metatagKeywords+'" />';
  }

  next();
}

module.exports = metatagFindAll;
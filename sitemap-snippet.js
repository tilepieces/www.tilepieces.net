// https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#sitemapformat
(async ()=>{
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const footer = `\n</urlset>`;
  const htmlfiles  = await app.storageInterface.search("", "**/*.html");
  let results = htmlfiles.searchResult.filter(v=>!v.startsWith("components") && !v.startsWith("google"));
  var urlset = "";
  for(var i=0;i<results.length;i++){
    var path = results[i];
    var res = await fetch("/?tilepieces-read&path="+path)
    var time = res.headers.get("last-modified-time");
    var lastModifiedDate = new Date(+time).toLocaleDateString();
    urlset += `\n  <url>\n   <loc>https://tilepieces.net/${path}"</loc>\n   <lastmod>${lastModifiedDate}</lastmod>\n  </url>`;
  }
  var sitemap = header + urlset + footer;
  await app.storageInterface.update("sitemap.xml",new Blob([sitemap]));
  return "done"
})();
(async ()=>{
  const app = tilepieces;
  const htmlfiles  = await app.storageInterface.search("", "**/*.html");
  const metaOg = await app.storageInterface.read("components/meta og.html");
  let results = htmlfiles.searchResult.filter(v=>!v.match(/^(components\/|google|documentation)/));
  for(var i=0;i<results.length;i++){
    var htmlfilePath = results[i];
    var htmlfile = await app.storageInterface.read(htmlfilePath);
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlfile, "text/html");
    var description = doc.querySelector('meta[name="description"], meta[itemprop="description"]');
    var canonicalFilePath = htmlfilePath.split("/").filter((v,i,a)=>i!=a.length-1).join("/") + "/";
    var meta = {
      url : canonicalFilePath,
      title : doc.title,
      description : description.content
    }
    var html_meta_og = new Function("meta","return `"+metaOg+"`")(meta);
    // property to remove
    doc.head.querySelectorAll("meta[property^='og:'],meta[name^='twitter:'],link[rel='canonical']").forEach(v=>v.remove())
    doc.head.insertAdjacentHTML("beforeend",html_meta_og);
    var s = app.createDocumentText(doc).replace(/\r\n|\n|\r/g,"");
    await app.storageInterface.update(htmlfilePath, new Blob([s]));
  }
  return "done"
})();
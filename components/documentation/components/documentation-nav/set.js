async function setFixedHTMLInProject(component){
  const windowOpener = window.opener || window.parent;
  const opener = windowOpener.opener;
  var app = opener.tilepieces;
  var fixedHTMLPath = component.path + "/" + component.html;
  try {
    opener.dialog.open("fetching resource...", true, true);
    var html = await app.storageInterface.read(fixedHTMLPath);
    var htmlfiles = await app.storageInterface.search("", "**/*.html");
    var parser = new DOMParser();
    var HTMLdoc = parser.parseFromString(html, "text/html");
    var fragment = HTMLdoc.createDocumentFragment();
    [...HTMLdoc.body.children].forEach(v => {
      if (!v.tagName.match(/STYLE|LINK|SCRIPT/)) {
        v.setAttribute(app.componentAttribute, component.name);
        fragment.append(v)
      }
    });
    for (var i = 0; i < htmlfiles.searchResult.length; i++) {
      var htmlfilePath = htmlfiles.searchResult[i];
      if (htmlfilePath.replace(/^\/|\/$/g, "") ==
        fixedHTMLPath.replace(/^\/|\/$/g, "")) {
        console.log("[set fixed HTML, prevent writing on itself]",htmlfilePath,fixedHTMLPath);
        continue;
      }
      opener.dialog.open("fetching file path " + htmlfilePath + "...", true, true);
      var htmlfile = await app.storageInterface.read(htmlfilePath);
      parser = new DOMParser();
      var doc = parser.parseFromString(htmlfile, "text/html");
      var toChange = doc.querySelectorAll(`[${app.componentAttribute}="${component.name}"]`);
      if (toChange.length) {
        toChange.forEach(v => {
          !v.tagName.match(/SCRIPT|LINK|STYLE/) &&
          v.replaceWith(fragment.cloneNode(true))
        });
        var navigationTarget = doc.querySelector("#navigation-index a[href=\"\/"+htmlfilePath+"\"]");
        if(navigationTarget){
          var li = navigationTarget.closest("li");
          li.className = "select";
          var details = li.closest("details")
          while(details){
            details.setAttribute("open","");
            details = details.parentNode.closest("details");
          }
        }
        var s = app.core.createDocumentText(doc);
        await app.storageInterface.update(htmlfilePath, new Blob([s]));
      }
    }
  } catch (e) {
    console.error(e);
    opener.dialog.close();
    alertDialog("error in set fixed html",true);
    return;
  }
  opener.dialog.open("update done");
}
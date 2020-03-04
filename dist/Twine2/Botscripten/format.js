window.storyFormat({"name":"Botscripten","description":"An interactive chat viewer","author":"Aibex, Inc","image":"icon.svg","url":"github:aibexhq/botscripten","version":"1.0.0","proofing":false,"source":"<!DOCTYPE html>\n<html>\n  <head>\n    <title>\n      {{STORY_NAME}}\n    </title>\n    <meta charset=\"utf-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"\n    />\n    <meta name=\"description\" content=\"\" />\n    <meta name=\"author\" content=\"\" />\n    <link rel=\"icon\" href=\"favicon.ico\" />\n\n    <!-- Bootstrap core CSS -->\n    <link\n      rel=\"stylesheet\"\n      href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css\"\n      integrity=\"sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB\"\n      crossorigin=\"anonymous\"\n    />\n    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/aibexhq/botscripten@1.0.0/src/template/botscripten.css\" />\n  </head>\n  <body class=\"bg-white\">\n    <nav class=\"navbar navbar-expand-lg fixed-top\">\n      <h1 id=\"ptitle\" class=\"nav-title\">{{STORY_NAME}}</h1>\n      <div class=\"toggles\">\n        <label\n          ><input\n            type=\"checkbox\"\n            name=\"show_directives\"\n            id=\"show_directives\"\n            checked=\"checked\"\n          />show directives</label\n        >\n        <label\n          ><input type=\"checkbox\" name=\"proofing\" id=\"proofing\" />show\n          proofing</label\n        >\n      </div>\n    </nav>\n\n    <main role=\"main\" class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"left-sidebar col-lg d-none d-lg-block\">\n          <div\n            id=\"left-sidebar-container\"\n            class=\"content-container position-fixed mt-3 mt-lg-5 m-lg-4\"\n          ></div>\n        </div>\n        <div class=\"chat-panel col-lg-6 minh-full bg-color\">\n          <div id=\"phistory\" class=\"history chat-history\"></div>\n          <div id=\"passage\" class=\"active\"></div>\n          <div id=\"animation-container\">\n            <div class=\"chat-passage-wrapper\">\n              <div class=\"chat-passage\">\n                <div class=\"wave\">\n                  <span class=\"dot\"></span>\n                  <span class=\"dot\"></span>\n                  <span class=\"dot\"></span>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"user-response-panel fixed-bottom bg-color\">\n            <hr />\n            <div\n              id=\"user-response-hint\"\n              class=\"user-response-hint content-container\"\n            ></div>\n            <div id=\"user-response-panel\" class=\"user-reponse-wrapper\"></div>\n          </div>\n        </div>\n        <div class=\"right-sidebar col-lg offcanvas-collapse\">\n          <div class=\"position-fixed ml--3 w-100 w-lg-auto h-100\">\n            <div\n              id=\"right-sidebar-container\"\n              class=\"content-container m-3 m-sm-5 m-lg-3 mt-lg-5 m-xl-5 mt-xl-5\"\n            ></div>\n          </div>\n        </div>\n      </div>\n    </main>\n    <twine>\n      {{STORY_DATA}}\n    </twine>\n    <script src=\"https://cdn.jsdelivr.net/gh/aibexhq/botscripten@1.0.0/dist/botscripten.umd.js\"></script>\n  </body>\n</html>\n"})
// Add fonts to whitelist
var Font = Quill.import('formats/font');
// We do not add Sans Serif since it is the default
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial'];
Quill.register(Font, true);

var fontSizeStyle = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = ['24px', '48px', '100px', '200px'];
Quill.register(fontSizeStyle, true);

var quillBg = new Quill('#quill-container', {
  modules: {
    toolbar: '#toolbar'
  },
  scrollingContainer: '#scrolling-container', 
  placeholder: 'Compose an epic...',
  theme: 'snow'
});

function downloadInnerHtml(filename, mimeType) {
    var elHtml = quillBg.root.innerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
}

$('#download').click(function(){
    downloadInnerHtml($('#download').attr("data-filename")+"_export.html", 'text/html');
});

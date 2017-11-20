var toolbarOptions = [
  [{ 'font': [] }],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['image'],
  ['link'],
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  ['clean']                                         // remove formatting button
];

var quillBg = new Quill('#quill-container', {
  modules: {
    toolbar: toolbarOptions
  },
  scrollingContainer: '#scrolling-container', 
  placeholder: 'Compose an epic...',
  theme: 'bubble'
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

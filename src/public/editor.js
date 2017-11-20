var toolbarOptions = [
  [{ 'font': [] }],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['link'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  ['clean']                                         // remove formatting button
];

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  formats: {
    background: true
  },
  placeholder: 'Crie sua história...',
  theme: 'snow'
});

var form = document.querySelector('form[name=q-editor]');
form.onsubmit = function() {
  // Populate hidden form on submit
  var data   = document.querySelector('input[name=data]');
  //data.value = JSON.stringify(quill.getContents());
  var htmlStr = quill.root.innerHTML
  data.value = htmlStr;
  
  return true;
};


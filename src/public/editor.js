var quill = new Quill('#editor', {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', 'blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
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
  data.value = htmlStr.substring(htmlStr.indexOf('>') + 1, htmlStr.lastIndexOf('<'));
  
  return true;
};


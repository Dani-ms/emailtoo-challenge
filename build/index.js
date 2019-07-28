var mainForm = document.querySelector('form[name=formularioPrincipal]');

for (var i = 0; i < window.brazillianStates.length; i++) {
  var state = window.brazillianStates[i];

  var opt = document.createElement("option");
  opt.value = state.abbr;
  opt.innerHTML = state.abbr;

  mainForm["estado"].appendChild(opt);
}

function validateMainForm() {
  var numIntegrantesSelectedOptionIndex =
    mainForm["numIntegrantes"].selectedIndex;
  var estadoSelectedOptionIndex =
    mainForm["estado"].selectedIndex;

  /*
    Formulário está todo correcto
  */
  if (
    mainForm.checkValidity()
    && mainForm["numIntegrantes"]
      .options[numIntegrantesSelectedOptionIndex].value
    && mainForm["estado"]
      .options[estadoSelectedOptionIndex].value
  ) {
    var formElements = mainForm.elements;

    for (var i = 0; i < formElements.length; i++) {
      var el = formElements[i];

      if (el.nodeName === 'SELECT') {
        el.parentElement.classList.remove("is-danger");
      } else if (el.type !== 'submit' && el.type !== 'checkbox') {
        el.classList.remove("is-danger");
      };
    }

    return true;
  }/*
    - Partes do formulário podem estar incorrectas:
      - Marcar partes do formulário incorrectas e limpar as partes que 
        já estão correctas desde a última tentativa de submissão.
      - Alertar o utilizador para aceitar os termos e condições só se já todos os elementos
            do formulário estiverem correctamente preenchidos.
  */ else {
    var formElements = mainForm.elements;
    var scrolledToInvalidSelectInput = false;

    for (var i = 0; i < formElements.length; i++) {
      var el = formElements[i];

      // Elementos Select têm algum valor seleccionado?
      if (el.nodeName === 'SELECT') {

        if (!el.options[el.selectedIndex].value) {
          el.parentElement.classList.add("is-danger");
          el.scrollIntoView();
        } else {
          el.parentElement.classList.remove("is-danger")
        }

      }
      // Inputs de texto
      else if (el.type !== 'submit' && el.type !== 'checkbox' && el.checkValidity) {

        if (!el.checkValidity()) {
          el.classList.add("is-danger")
        } else {
          el.classList.remove("is-danger")
        }

      };
    }

    return false
  }
}

function submitMainForm() {
  var isValid = validateMainForm();

  if(!isValid) return;
  else {
    var submitButton = document.querySelector('form[name=formularioPrincipal] button[type=submit]');
    submitButton.classList.add('is-loading');
    submitButton.disabled = true;

    var XHR = new XMLHttpRequest();
    var formData  = new FormData(mainForm);

    XHR.open("POST", "https://site-analaga.appspot.com/contact", true);

    XHR.onreadystatechange = function() {
      if (XHR.readyState !== 4) {
        return;
      }

      submitButton.classList.remove('is-loading');

      if (XHR.status == 200) {
        submitButton.innerHTML = 'Enviado!';
        submitButton.classList.remove('is-primary');
        submitButton.classList.add('is-success');

        alert("Email enviado com sucesso!")
      } else {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Erro. Clique para tentar novamente.';
        submitButton.classList.remove('is-primary');
        submitButton.classList.add('is-danger');

        alert("Erro ao enviar formulário. Tente outra vez.")
      }
    };

    XHR.send(formData);
  }
}

mainForm.addEventListener('submit', function (e) {
  e.preventDefault();

  submitMainForm();
})

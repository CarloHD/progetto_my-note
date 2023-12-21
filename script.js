const defaultPlaceholder = 'Scrivi la tua nota'
const textArea = document.getElementsByClassName('textArea')[0]
const saveButton = document.getElementsByClassName('saveButton')[0]
const noteList = document.getElementsByClassName('noteList')[0]
const overlayAlertWrap = document.getElementsByClassName('overlayAlertWrap')[0]
const alertPopup = document.getElementsByClassName('alert')[0]
const alertContent = document.getElementsByClassName('alertContent')[0]
const alertButtonAbort = document.getElementsByClassName('abort')[0]
const alertButtonConfirm = document.getElementsByClassName('confirm')[0]
const noteListsArray = []

const toTopFAB = document.getElementsByClassName('toTopFAB')[0]
const resetTextFAB = document.getElementsByClassName('resetFAB')[0]

// aggiunta placeholder per textArea - collegato ad evento blur textArea - collegato a FAB
function addPlaceHolder () {
  if (textArea.innerText === '' || textArea.firstChild.tagName === 'BR') {
    textArea.innerText = defaultPlaceholder
  }
  if (
    !resetTextFAB.classList.contains('hidden') &&
    textArea.innerText === defaultPlaceholder
  ) {
    resetTextFAB.classList.add('hidden')
  }
}
// rimozione placeholder per textArea - collegato ad evento focus textArea
function removePlaceHolder () {
  if (textArea.textContent === defaultPlaceholder) {
    textArea.textContent = ''
  }
}
// evento focus textArea
textArea.addEventListener('focus', removePlaceHolder)

// evento blur textArea
textArea.addEventListener('blur', addPlaceHolder)

addPlaceHolder()

// salvataggio nota
function makeNote () {
  // copia del testo inserito
  const text = textArea.innerText

  // creazione elemento li
  const noteElement = () => {
    const li = document.createElement('li')
    li.className = 'card bounceIn'

    // creazione contenuto li
    const noteContent = document.createElement('p')
    noteContent.className = 'noteContent'
    noteContent.innerText = text
    li.appendChild(noteContent)

    // creazione pulsante cancella nota
    const delButton = document.createElement('button')
    delButton.className = 'defaultButton delButton negativeButton'
    delButton.innerText = 'Cancella'
    li.appendChild(delButton)

    // evento pulsante cancella nota - mostra popup
    delButton.addEventListener('click', makePopup, false)
    return li
  }
  // salvataggio nota su array
  noteListsArray.push(noteElement())
  // collegamento nuova nota a lista
  noteList.prepend(noteListsArray[noteListsArray.length - 1])

  // ripristino placeHolder
  textArea.innerText = defaultPlaceholder
}
// evento pulsante salva
saveButton.addEventListener('click', makeNote)

// eliminazione nota da nodeList e da array
function delNote (noteToDelete) {
  overlayAlertWrap.setAttribute('hidden', true)
  alertContent.innerText = ''

  if (overlayAlertWrap.firstElementChild.localName === 'li') {
    overlayAlertWrap.removeChild(overlayAlertWrap.firstElementChild)
  }

  for (let index = 0; index < noteListsArray.length; index++) {
    if (noteToDelete === noteListsArray[index]) {
      noteListsArray.splice(index, 1)
      noteList.removeChild(noteToDelete)
    }
  }

  alertButtonConfirm.removeEventListener('click', delNote)
}

// creazione popup per cancellazione nota o reset textArea
function makePopup (event) {
  // selezione nota
  const element = event.target.parentElement
  // se funzione proviene da 'elimina nota'
  if (element.localName === 'li') {
    // clonazione nota solo per popup
    const noteElementClone = element.cloneNode(true)
    noteElementClone.className = 'card deletingNote slide-in-bck-top'
    noteElementClone.removeChild(noteElementClone.lastChild)
    overlayAlertWrap.prepend(noteElementClone)

    // testo per alert
    alertContent.innerText = 'Vuoi eliminare questa nota?'
    overlayAlertWrap.removeAttribute('hidden')

    // evento conferma cancellazione
    alertButtonConfirm.addEventListener('click', () => {
      delNote(element)
    })
  } else {
    // se funzione proviene da 'reset testo textArea'
    alertContent.innerText = 'Vuoi resettare il testo scritto fin ora?'
    overlayAlertWrap.removeAttribute('hidden')
    alertButtonConfirm.addEventListener('click', resetTextArea)
  }

  // evento pulsante annulla
  alertButtonAbort.addEventListener('click', function () {
    if (overlayAlertWrap.firstElementChild !== alertPopup) {
      overlayAlertWrap.removeChild(overlayAlertWrap.firstElementChild)
    }

    overlayAlertWrap.setAttribute('hidden', true)
    alertContent.textContent = ''
    alertButtonConfirm.removeEventListener('click', delNote)
    alertButtonConfirm.removeEventListener('click', resetTextArea)
  })
}

/* FAB */

textArea.addEventListener('input', showFAB)
document.addEventListener('scroll', showFAB)
// mostra FAB
function showFAB () {
  // mostra pulsante reset se contenuto textArea modificato
  if (textArea.innerText !== defaultPlaceholder) {
    resetTextFAB.classList.remove('hidden')

    resetTextFAB.addEventListener('click', makePopup)
  }
  // mostra/nasconde pulsante toTop quando scroll
  const bounding = noteList.getBoundingClientRect()
  if (bounding.top < 10) {
    toTopFAB.classList.remove('hidden')
    toTopFAB.addEventListener('click', function () {
      scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  } else if (bounding.top > 120) {
    toTopFAB.classList.add('hidden')
    toTopFAB.removeEventListener('click', function () {
      scrollTo(0, 0)
    })
  }
}

// reset textArea da pulsante reset - collegato a popup
function resetTextArea () {
  textArea.textContent = defaultPlaceholder
  overlayAlertWrap.setAttribute('hidden', true)
  alertContent.textContent = ''
  alertButtonConfirm.removeEventListener('click', resetTextArea)
  resetTextFAB.classList.add('hidden')
}

/* To-do : Import/export delle note in formato JSON
 */

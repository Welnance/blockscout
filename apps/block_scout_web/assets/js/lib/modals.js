import $ from 'jquery'

let $currentModal = null
let modalLocked = false

const spinner =
  `
    <span class="loading-spinner-small mr-2">
      <span class="loading-spinner-block-1"></span>
      <span class="loading-spinner-block-2"></span>
    </span>
  `

$(document.body).on('hide.bs.modal', e => {
  if (modalLocked) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  $currentModal = null
})

export function currentModal() {
  return $currentModal
}

export function isModalLocked() {
  return modalLocked
}

export function openModal($modal, unclosable) {
  // Hide all tooltips before showing a modal,
  // since they are sticking on top of modal
  $('.tooltip').tooltip('hide')

  if (unclosable) {
    $('.close-modal, .modal-status-button-wrapper', $modal).addClass('hidden')
    $('.modal-status-text', $modal).addClass('m-b-0')
  }

  if ($currentModal) {
    if (!unclosable) {
      modalLocked = false
    }

    $currentModal
      .one('hidden.bs.modal', () => {
        $modal.modal('show')
        $currentModal = $modal
        if (unclosable) {
          modalLocked = true
        }
      })
      .modal('hide')
  } else {
    $modal.modal('show')
    $currentModal = $modal
    if (unclosable) {
      modalLocked = true
    }
  }
}

export function lockModal ($modal, $submitButton = null) {
  $modal.find('.close-modal').attr('disabled', true)

  const $button = $submitButton || $modal.find('.btn-add-full')

  $button
    .attr('data-text', $button.text())
    .attr('disabled', true)

  const $span = $('span', $button)

  if ($span.length) {
    $('svg', $button).hide()
    $span.html(spinner)
  } else {
    $button.html(spinner)
  }

  modalLocked = true
}

export function unlockModal ($modal, $submitButton = null) {
  $modal.find('.close-modal').attr('disabled', false)

  const $button = $submitButton || $modal.find('.btn-add-full')
  const buttonText = $button.attr('data-text');

  $button.attr('disabled', false)

  const $span = $('span', $button)
  if ($span.length) {
    $('svg', $button).show()
    $span.text(buttonText)
  } else {
    $button.text(buttonText)
  }

  modalLocked = false
}

export function openErrorModal (title, text, unclosable) {
  const $modal = $('#errorStatusModal')
  $modal.find('.modal-status-title').text(title)
  $modal.find('.modal-status-text').html(text)
  openModal($modal, unclosable)
}

export function openWarningModal (title, text) {
  const $modal = $('#warningStatusModal')
  $modal.find('.modal-status-title').text(title)
  $modal.find('.modal-status-text').html(text)
  openModal($modal)
}

export function openSuccessModal (title, text) {
  const $modal = $('#successStatusModal')
  $modal.find('.modal-status-title').text(title)
  $modal.find('.modal-status-text').text(text)
  openModal($modal)
}

export function openQuestionModal (title, text, acceptCallback = null, exceptCallback = null, acceptText = 'Yes', exceptText = 'No') {
  const $modal = $('#questionStatusModal')

  $modal.find('.modal-status-title').text(title)
  $modal.find('.modal-status-text').text(text)

  const $accept = $modal.find('.btn-line.accept')
  const $except = $modal.find('.btn-line.except')

  $accept
    .removeAttr('data-dismiss')
    .unbind('click')
    .find('.btn-line-text').text(acceptText)

  $except.removeAttr('data-dismiss')
    .removeAttr('data-dismiss')
    .unbind('click')
    .find('.btn-line-text').text(exceptText)

  if (acceptCallback) {
    $accept.on('click', event => {
      $accept
        .unbind('click')
        .find('.btn-line-text').html(spinner)
      $except
        .unbind('click')
        .removeAttr('data-dismiss')

      modalLocked = true
      acceptCallback($modal, event)
    })
  } else {
    $accept.attr('data-dismiss', 'modal')
  }

  if (exceptCallback) {
    $except.on('click', event => {
      $modal.find('.close-modal').attr('disabled', true)

      $except
        .unbind('click')
        .find('.btn-line-text').html(spinner)
      $accept
        .unbind('click')
        .removeAttr('data-dismiss')

      modalLocked = true
      exceptCallback($modal, event)
    })
  } else {
    $except.attr('data-dismiss', 'modal')
  }

  openModal($modal)
}

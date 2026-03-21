(function (window, document) {
  function initMenuSheet() {
    var cards = [].slice.call(document.querySelectorAll('.menu-card--interactive'));

    if (!cards.length) {
      return;
    }

    var sheet = document.createElement('div');
    var content;
    var panel;
    var closeTimer;
    var activeCard = null;

    sheet.className = 'menu-sheet';
    sheet.hidden = true;
    sheet.innerHTML = [
      '<div class="menu-sheet__backdrop" data-menu-sheet-close></div>',
      '<section class="menu-sheet__panel" role="dialog" aria-modal="true">',
      '  <div class="menu-sheet__handle"></div>',
      '  <button type="button" class="menu-sheet__close" aria-label="關閉詳細資訊" data-menu-sheet-close>關閉</button>',
      '  <div class="menu-sheet__scroll">',
      '    <div class="menu-sheet__content"></div>',
      '  </div>',
      '</section>'
    ].join('');

    document.body.appendChild(sheet);

    content = sheet.querySelector('.menu-sheet__content');
    panel = sheet.querySelector('.menu-sheet__panel');

    function assignTitleId() {
      var title = content.querySelector('.menu-sheet__title');

      if (!title) {
        panel.removeAttribute('aria-labelledby');
        return;
      }

      title.id = 'menu-sheet-title';
      panel.setAttribute('aria-labelledby', 'menu-sheet-title');
    }

    function openSheet(card) {
      var template = card.querySelector('.menu-card__detail-template');

      if (!template) {
        return;
      }

      window.clearTimeout(closeTimer);
      activeCard = card;

      content.innerHTML = template.innerHTML;
      assignTitleId();

      sheet.hidden = false;
      document.body.classList.add('menu-sheet-open');

      window.requestAnimationFrame(function () {
        sheet.classList.add('is-visible');
      });
    }

    function closeSheet() {
      if (sheet.hidden) {
        return;
      }

      sheet.classList.remove('is-visible');
      document.body.classList.remove('menu-sheet-open');

      closeTimer = window.setTimeout(function () {
        sheet.hidden = true;
        content.innerHTML = '';

        if (activeCard) {
          activeCard.focus();
        }
      }, 280);
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openSheet(card);
      });

      card.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        event.preventDefault();
        openSheet(card);
      });
    });

    sheet.addEventListener('click', function (event) {
      if (event.target.closest('[data-menu-sheet-close]')) {
        closeSheet();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeSheet();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initMenuSheet);
})(this, this.document);

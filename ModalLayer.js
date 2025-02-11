export class TokyChannelWidgetPopup {
  constructor(options = {}) {
    this.contentStyle = '';
    this.contentHTML = '';
    this.height = options.height || '365px';
    this.width = options.width || '600px';
    this.closeButtonContent = options.closeButtonContent || 'X';
    this.customCss = options.customCss || '';

    this.modalId = `TokyChannelWidgetPopupId-${Date.now()}`;
    
    this.defineStyles();
    this.createModal();
    this.injectStyles();
    this.injectModalElements();
  }

  defineStyles() {
    this.modalStyle = `.TokyChannelWidgetPopup-modal { height: ${this.height}; width: ${this.width}; background-color: #fff; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); padding: 0px; opacity: 0; pointer-events: none; transition: all 300ms ease-in-out; z-index: 1011; }`;
    this.modalStyleVisible = '.TokyChannelWidgetPopup-modal-visible { opacity: 1; pointer-events: auto; }';
    this.modalStyleClose = '.TokyChannelWidgetPopup-modal-closeBtn { position: absolute; font-size: 1.2rem; right: -20px; top: -20px; cursor: pointer;  font-size:bold; border-radius:50%; color: white; }';
    if(this.width === '100%' || this.height === '100%'){
      this.modalStyleClose += '.TokyChannelWidgetPopup-modal-closeBtn {right: 5px; top: 5px; color: black;}';
    }
    this.blackedout = '.TokyChannelWidgetPopup-blackedout { position: absolute; z-index: 1010; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.65); display: none; }';
    this.blackedoutVisible = `.TokyChannelWidgetPopup-blackedout-visible { display: block; height:100% }`;
  }

  createModal() {
    this.modalHTML = document.createElement('div');
    this.modalHTML.id = this.modalId;
    this.modalHTML.dataset.popupModal = 'one';
    this.modalHTML.classList.add('TokyChannelWidgetPopup-modal');
    this.modalHTML.classList.add('TokyChannelWidgetPopup-shadow');
    this.bodyBlackedout = document.createElement('div');
    this.bodyBlackedout.classList.add('TokyChannelWidgetPopup-blackedout');
  }

  injectStyles() {
    this.defineStyles();
    let style = document.getElementById('TokyChannelWidgetPopupStyles');
    if (!style) {
      style = document.createElement('style');
      style.setAttribute('id', 'TokyChannelWidgetPopupStyles');
      style.setAttribute('type', 'text/css');
      style.innerHTML = this.modalStyle + this.modalStyleVisible + this.blackedout + this.blackedoutVisible;
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  }

  injectModalElements() {
    document.body.appendChild(this.bodyBlackedout);
    document.body.appendChild(this.modalHTML);
    this.modalHTML.attachShadow({mode: 'open'});
  }

  injectModalContent() {
    this.bodyBlackedout.style.height = document.documentElement.clientHeight;
    this.modalHTML.style.top = `calc(${window.scrollY}px + 50%)`;
    this.modalHTML.shadowRoot.innerHTML = `
      <style>
        ${this.modalStyleClose}
        ${this.contentStyle}
        ${this.customCss}
      </style>
      <span class="TokyChannelWidgetPopup-modal-closeBtn">${this.closeButtonContent}</span>
      <div id="TokyChannelWidgetPopup-modal-content" style="width:100%;height:100%;">${this.contentHTML}</div>
    `;
  }

  getElementById(id) {
    return this.modalHTML.shadowRoot.getElementById(id);
  }

  hideModal() {
    this.modalHTML.classList.remove('TokyChannelWidgetPopup-modal-visible');
    this.bodyBlackedout.classList.remove('TokyChannelWidgetPopup-blackedout-visible');
    document.querySelector('.TokyChannelWidgetPopup-blackedout').removeEventListener('click', this.hideModal);
    this.modalHTML.shadowRoot.querySelector('.TokyChannelWidgetPopup-modal-closeBtn').removeEventListener('click', this.hideModal);
  }

  openModal() {
    this.modalHTML.classList.add('TokyChannelWidgetPopup-modal-visible');
    this.bodyBlackedout.classList.add('TokyChannelWidgetPopup-blackedout-visible');
    this.injectModalContent();
    this.modalHTML.shadowRoot.querySelector('.TokyChannelWidgetPopup-modal-closeBtn').addEventListener('click', this.hideModal.bind(this));
    document.querySelector('.TokyChannelWidgetPopup-blackedout').addEventListener('click', this.hideModal.bind(this));
  }
}
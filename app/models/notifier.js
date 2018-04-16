import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Resource.extend({
  type: 'notifier',

  modalService: service('modal'),

  init(...args) {
    this._super(...args);
  },

  notifierType: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');

    if (sc) {
      return 'slack';
    }
    if (pc) {
      return 'pagerduty';
    }
    if (ec) {
      return 'email';
    }
    if (wc) {
      return 'webhook';
    }
    return null;

  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),

  actions: {
    edit() {
      this.get('modalService').toggleModal('notifier/modal-new-edit', {
        closeWithOutsideClick: false,
        currentType: get(this, 'notifierType'),
        model: this,
        mode: 'edit',
      });
    },

    clone() {
      const nue = this.clone();
      nue.set('id', null);
      nue.set('name', null);
      this.get('modalService').toggleModal('notifier/modal-new-edit', {
        closeWithOutsideClick: false,
        currentType: get(this, 'notifierType'),
        model: nue,
        mode: 'clone',
      });
    },
  },

  notifierValue: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');
    if (sc) {
      return get(sc, 'defaultRecipient');
    }
    if (pc) {
      return '***';
    }
    if (ec) {
      return get(ec, 'defaultRecipient');
    }
    if (wc) {
      return get(wc, 'url');
    }
    return '';

  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),

  displayCreated: function() {
    const d = get(this , 'created');
    return moment(d).fromNow();
  }.property('created'),

  notifierLabel: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');

    if (sc) {
      return 'Channel';
    }
    if (pc) {
      return 'Service Key';
    }
    if (ec) {
      return 'Address';
    }
    if (wc) {
      return 'URL';
    }
    return 'Notifier';
  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),
});

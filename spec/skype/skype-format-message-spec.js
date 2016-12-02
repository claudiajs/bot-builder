/*global describe, it, expect, require */
'use strict';

const formatMessage = require('../../lib/skype/format-message');

describe('Skype format message', () => {
  it('should export an object', () => {
    expect(typeof formatMessage).toBe('object');
  });

  describe('Photo', () => {
    it('should be a class', () => {
      const message = new formatMessage.Photo('foo');
      expect(typeof formatMessage.Photo).toBe('function');
      expect(message instanceof formatMessage.Photo).toBeTruthy();
    });

    it('should throw an error if photo url is not provided', () => {
      expect(() => new formatMessage.Photo()).toThrowError('Photo is required for the Skype Photo template');
    });

    it('should generate a valid Skype template object', () => {
      const message = new formatMessage.Photo('base_64_string').get();
      expect(message).toEqual({
        type: 'message/image',
        attachments: [
          {
            contentUrl: 'base_64_string'
          }
        ]
      });
    });
  });

  describe('Carousel', () => {
    it('should be a class', () => {
      const message = new formatMessage.Photo('foo');
      expect(typeof formatMessage.Photo).toBe('function');
      expect(message instanceof formatMessage.Photo).toBeTruthy();
    });

    it('should generate a valid Carousel template object', () => {
      const message = new formatMessage.Carousel('summary', 'text').get();
      expect(message).toEqual({
        type: 'message/card.carousel',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: []
      });
    });

    it('should throw error if addHero is called without images array', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero('title', 'subtitle', 'text', 'image')
        .get()).toThrowError('Images should be sent as array for the Skype Hero template');
    });

    it('should generate a valid Carousel template object with Hero', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addHero('title', 'subtitle', 'text', ['image'])
        .get();
      expect(message).toEqual({
        type: 'message/card.carousel',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            images: [{url: 'image', alt: ''}],
            buttons: []
          }
        }]
      });
    });

    it('should throw error if addButton is called without title', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addButton()
        .get()).toThrowError('Title needs to be a string for Skype addButton method');
    });

    it('should throw error if addButton is called without value', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addButton('title', '')
        .get()).toThrowError('Value needs to be a string for Skype addButton method');
    });

    it('should generate a valid Carousel template object with Hero with Button', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addHero('title', 'subtitle', 'text', ['image'])
          .addButton('title', 'value')
        .get();
      expect(message).toEqual({
        type: 'message/card.carousel',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            images: [{url: 'image', alt: ''}],
            buttons: [{
              type: 'imBack',
              title: 'title',
              value: 'value'
            }]
          }
        }]
      });
    });

    it('should throw error if addThumbnail is called without images array', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addThumbnail('title', 'subtitle', 'text', 'image')
        .get()).toThrowError('Images should be sent as array for the Skype Thumbnail template');
    });

    it('should generate a valid Carousel template object with Thumbnail', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addThumbnail('title', 'subtitle', 'text', ['image'])
        .get();
      expect(message).toEqual({
        type: 'message/card.carousel',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.thumbnail',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            images: [{url: 'image', alt: ''}],
            buttons: []
          }
        }]
      });
    });

    it('should generate a valid Carousel template object with Receipt', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addReceipt('title', 'subtitle', 'text', 'total', 'tax', 'vat')
        .get();
      expect(message).toEqual({
        type: 'message/card.carousel',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.receipt',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            total: 'total',
            tax: 'tax',
            vat: 'vat',
            items: [],
            facts: [],
            buttons: []
          }
        }]
      });
    });

    it('should generate a valid Carousel template object with Receipt with Item', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addReceipt('title', 'subtitle', 'text', 'total', 'tax', 'vat')
          .addItem('title', 'subtitle', 'text', 'price', 'quantity', 'image')
        .get();
      expect(message).toEqual({
        type: 'message/card.carousel',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.receipt',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            total: 'total',
            tax: 'tax',
            vat: 'vat',
            items: [{
              title: 'title',
              subtitle: 'subtitle',
              text: 'text',
              price: 'price',
              quantity: 'quantity',
              image: {
                url: 'image'
              }
            }],
            facts: [],
            buttons: []
          }
        }]
      });
    });

    it('should generate a valid Carousel template object with Receipt with Fact', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addReceipt('title', 'subtitle', 'text', 'total', 'tax', 'vat')
          .addFact('key', 'value')
        .get();
      expect(message).toEqual({
        type: 'message/card.carousel',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.receipt',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            total: 'total',
            tax: 'tax',
            vat: 'vat',
            items: [],
            facts: [{
              key: 'key',
              value: 'value'
            }],
            buttons: []
          }
        }]
      });
    });
  });
});

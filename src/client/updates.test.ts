/* eslint-disable max-len */
import UpdateService from './updates';
import tl from '../mock/tl';

test('update service | events', () => {
  const service = new UpdateService();
  const updateMsg = tl.create('updateShortMessage', {});

  service.on('updateShortMessage', (update: any) => {
    expect(update._).toBe('updateShortMessage');
  });

  service.process(updateMsg);
});

/* eslint-disable max-len */
import UpdateService from './updates';

test('update service | events', () => {
  const service = new UpdateService();
  const updateMsg = { _: 'updateShortMessage' };

  service.on('updateShortMessage', (update: any) => {
    expect(update._).toBe('updateShortMessage');
  });

  service.process(updateMsg);
});

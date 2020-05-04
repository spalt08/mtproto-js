/* eslint-disable max-len */
import UpdateService from './updates';

test('update service | events', () => {
  const service = new UpdateService();
  const updateMsg = { _: 'updateShortMessage' };

  let raised = 0;

  service.on('updateShortMessage', (update: any) => {
    expect(update._).toBe('updateShortMessage');
    raised++;
  });

  service.on((update: any) => {
    expect(update._).toBe('updateShortMessage');
    raised++;
  });

  service.process(updateMsg);

  expect(raised).toBe(2);
});

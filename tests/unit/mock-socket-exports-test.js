import { module, test } from 'qunit';
import { Server, SocketIO, WebSocket } from 'mock-socket';

module('Unit | mock-socket exports', () => {
  test('exports Server', assert => {
    assert.equal(typeof Server, 'function');
  });

  test('exports SocketIO', assert => {
    assert.equal(typeof SocketIO, 'function');
  });

  test('exports WebSocket', assert => {
    assert.equal(typeof WebSocket, 'function');
  });
});

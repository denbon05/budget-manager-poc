import { Peer } from 'peerjs';
import { ref } from 'vue';

export const isUserInGroup = ref(false);

export const useP2P = () => {
  if (!isUserInGroup.value) {
    // no need to continue - user is solo
    // TODO write to the IndexDB on a device drive
    // TODO (optionally) if user authenticated - allow Google Drive connection
    return;
  }

  // TODO use user email for peer ID after login
  const peer = new Peer();
  console.log('PEER', peer);
  // const anotherPeerID = prompt('another peers id');
  // if (!anotherPeerID) {
  //   console.warn('No PEER ID provided!!!');
  //   return;
  // }
  // const conn = peer.connect(anotherPeerID);
  // conn.on('open', () => {
  //   conn.send('hi!');
  // });
  // peer.on('connection', (conn) => {
  //   conn.on('data', (data) => {
  //     // Will print 'hi!'
  //     console.log(data);
  //   });
  //   conn.on('open', () => {
  //     conn.send('hello!');
  //   });
  // });
};

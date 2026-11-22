import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import {ref, set, onValue} from 'firebase/database';
import {db} from './firebase';
import {RTCView, mediaDevices, RTCPeerConnection} from 'react-native-webrtc';

export default function App() {
  const [myId] = useState('123456');
  const [targetId, setTargetId] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [status, setStatus] = useState('Offline');

  // 1. SCREEN SHARE
  const startShare = async () => {
    try {
      const stream = await mediaDevices.getDisplayMedia({video: true});
      setLocalStream(stream);
      await set(ref(db, 'rooms/' + myId), {online: true});
      setStatus('Online Ho - ID: ' + myId);
      // 2. TOUCH SUNO
      onValue(ref(db, 'rooms/' + myId + '/touch'), s => {
        const t = s.val();
        if (t) console.log('Touch Aya:', t.x, t.y);
      });
    } catch (e) {
      setStatus('Error: Screen permission do');
    }
  };

  // 2. CONTROL KARO
  const joinRoom = async () => {
    const pc = new RTCPeerConnection({});
    pc.ontrack = e => {
      setRemoteStream(e.streams[0]);
      setStatus('Connected! Ab touch karo');
    };
    setStatus('Connecting ' + targetId);
  };

  // 2. TOUCH BHEJO
  const sendTouch = (x, y) => {
    set(ref(db, 'rooms/' + targetId + '/touch'), {x, y, time: Date.now()});
  };

  // 3. FILE BHEJO
  const sendFile = () => {
    set(ref(db, 'rooms/' + targetId + '/files'), {name: 'test.txt', time: Date.now()});
    setStatus('File bhej di!');
  };

  return (
    <View style={styles.c}>
      <Text style={styles.t}>MOBILE REMOTE</Text>
      <Text>{status}</Text>
      <Text>Mera ID: {myId}</Text>

      <Button title="1. Screen Share ON" onPress={startShare} />
      <TextInput style={styles.in} placeholder="Dusre ka ID" value={targetId} onChangeText={setTargetId} />
      <Button title="2. Control Karo" onPress={joinRoom} />

      {localStream && <RTCView streamURL={localStream.toURL()} style={styles.v} />}

      {remoteStream && (
        <TouchableOpacity onPress={e => sendTouch(e.nativeEvent.locationX, e.nativeEvent.locationY)}>
          <RTCView streamURL={remoteStream.toURL()} style={styles.v} />
        </TouchableOpacity>
      )}

      <Button title="3. File Bhejo" onPress={sendFile} />
      <Text style={{marginTop: 10}}>4. Full Access: Settings - Accessibility - Mobile Remote ON</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: {flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff'},
  t: {fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10},
  in: {borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8},
  v: {width: '100%', height: 400, backgroundColor: 'black', marginTop: 10},
});

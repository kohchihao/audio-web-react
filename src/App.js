import React, { Component } from 'react';
import AudioAnalyser from './AudioAnalyser';
//import MicRecorder from 'mic-recorder-to-mp3';
//const Mp3Recorder = new MicRecorder({ bitRate: 128 });
import AudioPoly from 'audio-recorder-polyfill';

let audioPoly;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
      audioPoly: null,
      type: null
    };
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
  }

  async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ audio });
  }

  stopMicrophone() {
    this.state.audio.getTracks().forEach(track => track.stop());
    this.setState({ audio: null });
  }

  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      audioPoly = new AudioPoly(this.state.audio);
      audioPoly.start();
      console.log(audioPoly);
      audioPoly.addEventListener('dataavailable', e => {
        console.log(e);
        this.setState({
          blobURL: URL.createObjectURL(e.data),
          type: e.data.type
        });
      });
    }
  };

  stop = () => {
    audioPoly.stop();
    console.log(audioPoly);
  };

  render() {
    return (
      <div className="App">
        <div className="controls">
          <button onClick={this.toggleMicrophone}>
            {this.state.audio ? 'Stop microphone' : 'Get microphone input'}
          </button>
        </div>
        {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ''}
        {this.state.type}
        <button onClick={this.start}>Start</button>
        <button onClick={this.stop}>Stop</button>
        <audio src={this.state.blobURL} controls={true} />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TesseractOcr from 'react-native-tesseract-ocr';
import ImagePicker from 'react-native-image-picker';

export default class App extends Component {
  state = {
    text: '',
    uri: ''
  }
  picker = () => {
    let options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({ uri: `file://${response.path}` })
        this.extractText(response.path)
      }
    });
  }
  extractText = (imgPath) => {
    let tessOptions = {
      whitelist: null,
      blacklist: null
    };
    TesseractOcr.recognize(imgPath, 'LANG_ENGLISH', tessOptions)
      .then((res) => this.setState({ text: res }));
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.uri ? <Image source={{ uri: this.state.uri }} style={{ height: 350, width: '100%', resizeMode: 'contain' }} /> : null}
        <ScrollView>
          <View style={styles.countContainer}>
            <Text>Result: {this.state.text}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={this.picker}
        >
          <Text>Select File</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});

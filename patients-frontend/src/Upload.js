import React, { Component } from 'react';
import axios from 'axios';
const APIURL = '/api/patients';

  class Upload extends Component {
    constructor() {
      super();
      this.state = {
        selectedFile: ''
      };
    }

    onChange = (e) => {
      // event to update state when form inputs change
      switch (e.target.name) {
      case 'selectedFile':
        this.setState({ selectedFile: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
    }

    onSubmit = (e) => {
      e.preventDefault();
      
    const {selectedFile } = this.state;
    let formData = new FormData();

    
    formData.append('selectedFile', selectedFile);
    
    fetch(APIURL, {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data));
    
    /*axios.post('/', formData)
      .then((result) => {
        console.log(result);
      });*/
    }

    render() {
      const {selectedFile } = this.state;
      return (
        <form onSubmit={this.onSubmit}>
          <input
            type="file"
            name="selectedFile"
            onChange={this.onChange}
          />
          <button type="submit">Submit</button>
        </form>
      );
    }
  }
    
export default Upload;
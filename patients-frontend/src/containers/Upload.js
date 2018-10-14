import React, { Component } from 'react';
import { connect } from "react-redux";
import { uploadPatients } from "../store/actions/patients";


  class Upload extends Component {
    constructor() {
      super();
      this.state = {
        selectedFile: '',
        cleanData: false
      };
    }

    onChange = (e) => {
      // event to update state when form inputs change
      switch (e.target.name) {
        case 'selectedFile':
          this.setState({ selectedFile: e.target.files[0] });
          break;
        case 'cleanData':
          this.setState({cleanData: e.target.checked});
          break;
        default:
          this.setState({ [e.target.name]: e.target.value });
      }
    }

    onSubmit = (e) => {
      e.preventDefault();
      const { selectedFile, cleanData} = this.state;
      let formData = new FormData();
      formData.append('selectedFile', selectedFile);
      formData.append('cleanData', cleanData);
      this.props.uploadPatients(formData);
    }

    render() {
      const { cleanData } = this.state;
      return (
        <div className='uploadContainer'>
          <form className="uploadForm" onSubmit={this.onSubmit}>
            <input
              className="uploadInput"
              type="file"
              id = "selectedFile"
              name="selectedFile"
              accept=".csv"
              onChange={this.onChange}
            />
            <br/>
            <label className="deletePrevious">
              <input
                type="checkbox"
                name="cleanData"
                value = {cleanData}
                checked = {cleanData}
                onChange={this.onChange}
              />
              Eliminar data previa
            </label>
            <br/>
            <button className='uploadButton' type='submit'> <i className="fas fa-file-upload"> <span className='lighter'> Subir </span></i> </button>
            {this.props.messages.message && (
              <div> {this.props.messages.message.records_inserted} registros cargados con éxito</div>
            )}
          </form>
        </div>
      );
    }
  }
  
function mapStateToProps(state) {
  return {
    errors: state.errors,
    messages: state.messages
  };
}
export default connect(mapStateToProps, { uploadPatients })(Upload);   
    

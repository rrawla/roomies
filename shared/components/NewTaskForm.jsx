import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as taskActions from '../actions/TaskActions';
import * as socketActions from '../actions/SocketActions';

import RadioButtons from './RadioButtons';
import { colors } from './styles'

if (process.env.BROWSER) {
  require("./styles/NewTaskForm.css");
}

const defaultState = { 
        errors: [],
        name: "",
        description: [""],
        startDate: null,
        endDate: null,
        number: 1,
        frequency: 'days'
      }

const freqMap = {
  days: 1,
  weeks: 7,
  months: 30,
}

class NewTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState
  }

  createTask(e) {
    e.preventDefault();

    let errors = [];
    if(!this.state.name.length)
      errors.push('Must input a task name!');
    if(!this.state.description.length)
      errors.push('Must input a description!');
    if(!this.state.startDate)
      errors.push('Must input a start date!');
    if(!this.state.endDate)
      errors.push('Must input an end date!')
    if((new Date(this.state.startDate)) > (new Date(this.state.endDate)))
      errors.push("Start date must be before end date!")

    if(errors.length){
      this.setState({
        errors: errors
      })

      let that = this;
      setTimeout(function() {
        that.setState(defaultState);
      }, 3000)
      return;
    }

    let taskParams = {
      name: this.state.name,
      description: this.state.description,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      _homeId: this.props.homeId,
      frequency: freqMap[this.state.frequency] * this.state.number,
    }

    this.props.createTask(taskParams)
      .then(status => {
        if(status.type === 'CREATE_TASK_SUCCESS') {
          this.props.emitChange(this.props.socket, this.props.homeId)
        }
      })


    this.setState(defaultState);
    this.props.closeModal();
  }

  handleChange(target, e) {
    let newState = {};
    newState[target] = e.target.value;
    this.setState(newState);
  }

  removeDescription(idx, e) {
    let newDescription = this.state.description.slice();
    newDescription.splice(idx, 1);
    let newState = {
      description: newDescription
    }
    this.setState(newState);
  }

  addDescription() {
    let newDescription = this.state.description.slice();
    newDescription.push("");
    this.setState({
      description: newDescription
    })
  }

  handleDescriptionChange(idx, e) {
    let newDescription = this.state.description.slice();
    newDescription[idx] = e.target.value;
    let newState = {
      description: newDescription
    }
    this.setState(newState);
  }

  setFrequency(type) {
    this.setState({
      frequency: type
    })
  }

  render() {
    let errorList = this.state.errors.map(function(err) {
      return <h5><li className="alert alert-danger">{err}</li></h5>
    })

    let descriptionList = this.state.description.map(function(task, i) {
      return(
        <li key={i}>
          <input onChange={this.handleDescriptionChange.bind(this, i)} style={[styles.baseInput, styles.textInput]} placeholder="vacuuming..." className="" type='text' ref="description" id="description" value={task}/>
          <span onClick={this.removeDescription.bind(this, i)} className="fa fa-times"/>
        </li>
      )
    }.bind(this))

    return(
      <form onSubmit={::this.createTask} style={styles.base} className="form text-center">
        <ul className="errors text-alert">
          {errorList}
        </ul>

        <label>We need to&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'name')} 
                style={styles.baseInput} 
                placeholder="clean the living room..." 
                value={this.state.name} 
                className="text-input" 
                type='text' ref="name" id="name" />

        <label>which consists of :</label>

        <ul style={{listStyle:'none'}}>
          { descriptionList }
          <span style={[styles.addMoreButton, colors.link]} key="addMoreButton" onClick={::this.addDescription} className="fa fa-plus">add more descriptions</span>
        </ul>

        <label>starting on&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'startDate')} 
                style={styles.baseInput} 
                value={this.state.startDate} 
                type='date' id="startDate" ref="startDate"/>
        
        <label>until&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'endDate')} 
                style={styles.baseInput} 
                value={this.state.endDate} 
                type='date' id="endDate" ref="endDate"/>
        
        <label>every&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'number')} 
                style={styles.baseInput} 
                value={this.state.number} 
                className="text-input num-input"
                type='number' id="number" ref="number"/>
        
        <RadioButtons currentSelected={this.state.frequency} setSelected={::this.setFrequency} values={["days","weeks","months"]} />
        <br/>
        <input className="btn btn-lg" onSubmit={::this.createTask} type="submit"/>
      </form>
    )
  }
}

const styles = {
  base: {
    fontSize: '30pt',
  },

  addMoreButton: {
    fontSize: '16pt',
  },
}

@connect(state => ({
  socket: state.io.get('socket')
}))

export default
class NewTaskFormContainer {
  static propTypes = {
    show: PropTypes.bool,
    rendered: PropTypes.string,
    homeId: PropTypes.string,
    socket: PropTypes.object,
    closeModal: PropTypes.func.isRequired
  }

  render() {
    let { dispatch } = this.props;
    return <NewTaskForm {...this.props} {...bindActionCreators(taskActions, dispatch)} {...bindActionCreators(socketActions, dispatch)}/>;
  }
}
import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as taskActions from '../actions/TaskActions';

import Modal from './Modal';
import RadioButtons from './RadioButtons';


@Radium
class NewTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      errors: [],
      name: "",
      description: [""],
      startDate: null,
      endDate: null,
      frequency: 'days'
    }
  }

  createTask(e) {
    e.preventDefault();
    let name = this.refs.name.getDOMNode();
    let description = this.refs.description.getDOMNode();
    let startDate = this.refs.startDate.getDOMNode();

    let errors = [];
    if(!name.value.length)
      errors.push('Must input a task name!');
    if(!description.value.length)
      errors.push('Must input a description!');
    if(!startDate.value.length)
      errors.push('Must input a start date!');

    if(errors.length){
      this.setState({
        errors: errors
      })
      return;
    }
   
    this.props.createTask({
      name: name.value,
      description: description.value,
      startDate: startDate.value,
      completed: false
    });

    name.value = "";
    description.value = "";
    startDate.value = "";
    endDate.value = "";
    this.setState({
      errors: [],
    })
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
      return <li className="alert alert-danger">{err}</li>
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
        <ul className="errors">
          {errorList}
        </ul>

        <label>We need to&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'name')} style={[styles.baseInput, styles.textInput]} placeholder="clean the living room..." value={this.state.name} className="" type='text' ref="name" id="name"/>
        <label>which consists of :</label>
        <ul style={{listStyle:'none'}}>
          { descriptionList }
          <span style={styles.addMoreButton} key="addMoreButton" onClick={::this.addDescription} className="fa fa-plus">add more descriptions</span>
        </ul>
        <label>starting on&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'startDate')} style={styles.baseInput} value={this.state.startDate} type='date' id="startDate" ref="startDate"/>
        <label>until&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'endDate')} style={styles.baseInput} value={this.state.endDate} type='date' id="endDate" ref="endDate"/>
        <label>every&nbsp;</label>
        <input onChange={this.handleChange.bind(this, 'frequency')} style={[styles.baseInput, styles.numberInput]} value={this.state.frequency} type='number' id="endDate" ref="endDate"/>
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
    '@media (max-width: 768px)': {
      fontSize: '20pt'
    }
  },

  addMoreButton: {
    fontSize: '16pt',
    color: 'lightgrey',
    ':hover': {
      cursor: 'pointer',
      color: 'white'
    },
    '@media (max-width: 768px)': {
      fontSize: '10pt'
    }
  },

  baseInput: {
    background: 'rgba(0,0,0,0)',
    borderLeft: 0,
    borderRight: 0,
    borderTop: 0,
    borderBottom: '5px dashed white',
  },

  textInput: {
    textAlign: 'center',
  },

  numberInput: {
    width: '50px'
  }
}

@connect(state => ({
  tasks: state.tasks
}))

export default
class NewTaskFormContainer {
  static propTypes = {
    tasks: PropTypes.object,
    show: PropTypes.bool
  }

  render() {
    const { show, tasks, dispatch } = this.props;
    return <NewTaskForm show={show} tasks={tasks} {...bindActionCreators(taskActions, dispatch)} />;
  }
}
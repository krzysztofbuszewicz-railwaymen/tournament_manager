import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { saveMatchToTimetable } from 'actions/';
import { saveGroupsMatchToResults } from 'actions/group_timetable';

import { saveMatchToResults, setEditingForTimeTable } from 'actions/';
import { ResultHandler } from 'controllers/result_handler';

import SingleTeam from './single_team';
import StaticResult from './static_result';
import EditResult from './edit_result';

class SingleMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: this.props.results,
      result: {
        team1: this.props.match.result[0] || 0,
        team2: this.props.match.result[1] || 0
      },
      editing: false,
      validSave: false
    }
  };

  componentDidMount() {
    this.setResult(this.props.results)
  };

  componentWillReceiveProps(nextProps) {
    this.setResult(nextProps.results)
  };
  
  setResult(results) {
    this.setState({
      ...this.state,
      results 
    })
  };

  editClicked = () => {
    this.setState({
      ...this.state,
      editing: !this.state.editing
    })
  };

  staticResult = () => {
    return this.state.result[0] + ' : ' + this.state.result[1]
  };

  resultChange = e => {
    this.setState({
      ...this.state,
      result: {
        ...this.state.result,
        [e.target.name]: parseInt(e.target.value, 10)
      }
    }, 
    () => { this.saveValidation() });
  };

  saveValidation() {
    let result = _.values(this.state.result),
        hasWinner = _.includes(result, 10),
        sameResultBeforeAfterChange = _.isEqual(result, this.props.match.result),
        isDraw = !_.without(result, result[0]).length;

    if(hasWinner && !sameResultBeforeAfterChange && !isDraw) {
      this.setValidState(true)
    } else {
      this.setValidState(false)
    };
  };
  
  setValidState = (validSave) => {
    this.setState({
      validSave
    })
  }

  saveResult = () => {
    this.props.setEditingForTimeTable(true);
    let dataToPrepare = {
      teams: this.props.match.teams,
      result: [
        this.state.result.team1,
        this.state.result.team2
      ]
    }

    let results = ResultHandler.prepareData(dataToPrepare, this.state.results, this.props.match),
        data = {
          matchId: this.props.match._id,
          results,
          timeTableResult: dataToPrepare.result,
          teams: this.props.match.teams
        };

    this.props.saveMatchToTimetable(data, this.props.gameId);

    results.map(res => {
      this.props.saveMatchToResults(res, this.props.gameId);
      return true;
    })
    
    this.setState({
      ...this.state,
      editing: !this.state.editing,
      validSave: false
    })
  }

  cancel = () => {
    this.props.setEditingForTimeTable(false);
    this.setState({
      ...this.state,
      editing: false,
      result: {
        team1: this.props.match.result[0] || 0,
        team2: this.props.match.result[1] || 0
      }
    })
  }

  render() {
    return (
      <tr>
        <th className="narrow">{this.props.index + 1}</th>
        <td>
          <SingleTeam team={this.props.match.teams[0]}/>
        </td>
        <td>
          <SingleTeam team={this.props.match.teams[1]}/>
        </td>
        <td>
          {this.props.currentUser && this.state.editing
            ? <EditResult
                result={this.state.result} 
                resultChange={this.resultChange} />
            : <StaticResult result={this.state.result} />
          }
        </td>
        {this.props.currentUser && this.state.editing &&
          <td>
            <div className="btn-group" role="group" aria-label="Basic example">
              {this.state.validSave && !this.props.waitingForTimeTable &&
                  <button className="btn btn-secondary ml-auto"
                            onClick = {this.saveResult}>Save</button>
              }
              <button className="btn btn-secondary ml-auto"
                        onClick = {this.cancel}>Cancel</button>
            </div>
          </td>
        }
        {this.props.currentUser && !this.state.editing &&
          <td>
            <button
              className="btn btn-secondary ml-auto"
              onClick = {this.editClicked}>Edit</button>
          </td>
        }
      </tr>
    );
  }
};

const mapDispatchToProps = {
  saveMatchToTimetable,
  saveMatchToResults,
  setEditingForTimeTable,
  saveGroupsMatchToResults
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser,
    waitingForTimeTable: state.singleGame[0].waitingForTimeTable,
    settings: state.singleGame[0].settings[0]
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleMatch);

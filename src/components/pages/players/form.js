import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updatePlayer,
         addPlayer,
         setPlayerToEdit } from 'actions/players_global';
import Message from '../../messages/message';

class PlayerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: '',
        email: '',
        id: '',
        last_name: '',
        descript: '',
        gender: ''
      },
      errors: {},
      message: {
        show: false,
        content: '',
        role: ''
      },
      editing: false
    };
  };

  onChange = e => {
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      data: nextProps.editHandler.editPlayer,
      editing: nextProps.editHandler.editing,
      errors: {}
    })
  }

  onSubmit = e => {
    e.preventDefault();
    const { data } = this.state;

    const errors = this.validateInputs(data);
    this.setState({ errors })

    let isValid = Object.keys(errors).length === 0;
    if (isValid) {
      this.submitData(data);
    }
  };

  submitData = (data) => {
    if (this.state.editing) {
      this.props.setPlayerToEdit(data, true);
      this.props.updatePlayer(data);
    } else {
      this.props.addPlayer(data);
    }
  }

  validateInputs = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Player's name can't be blank!";
    if (!data.last_name) errors.last_name = "Player's last name can't be blank!";
    if (!data.email) errors.email = "Player's email can't be blank!";
    return errors;
  };

  render() {
    return (
      <div className="modal fade" id="addEditPlayer" tabIndex={-1} role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <form onSubmit={ this.onSubmit }>

              <div className="modal-header">
                <h5 className="modal-title">
                {this.state.editing
                  ? <span>Edit player</span>
                  : <span>Add new player</span>
                }
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="modal-body">
                {this.props.waitForSavePlayer &&
                  <Message mgsRole='info' mgs='waiting' />
                }

                <div className="form-group">
                  <label htmlFor="playerNameInput">Player Name</label>
                  <input className="form-control" id='playerNameInput' type="text" name='name'
                    autoComplete='name' value={this.state.data.name} onChange={this.onChange} />
                  <small className="form-text text-danger">{this.state.errors.name}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="playerLastName">Player Last Name</label>
                  <input className="form-control" id='playerLastName' type="text" name='last_name'
                    autoComplete='playerLastName' value={this.state.data.last_name} onChange={this.onChange} />
                  <small className="form-text text-danger">{this.state.errors.last_name}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="playerEmail">Email</label>
                  <input className="form-control" id='playerEmail' type="text" name='email'
                    autoComplete='email' value={this.state.data.email} onChange={this.onChange} />
                  <small className="form-text text-danger">{this.state.errors.email}</small>
                </div>

                <div>
                  <div className="collapse" id="collapseExample">

                    <div className="form-group">
                      <label htmlFor="playerPosition">Default Position</label>
                      <select value={this.state.data.position} className="form-control"
                        id="playerPosition" name='position' onChange={this.onChange}>
                        <option value='whatever'>obojętnie</option>
                        <option value='attack'>atak</option>
                        <option value='defence'>obrona</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="playerDescript">Desctipt</label>
                      <textarea className="form-control" id="playerDescript" rows="3" name='descript'
                        value={this.state.data.descript} onChange={this.onChange} />
                      <small className="form-text text-danger">{this.state.errors.descript}</small>
                    </div>

                    <div className="form-group">
                      <div className="col-12 px-0">
                        <label htmlFor="playerEmail d-block">Gender</label>
                      </div>
                      <label className="custom-control custom-radio">
                          <input id="playerGenderMale" name="gender" type="radio" className="custom-control-input"
                            value="male" checked={this.state.data.gender === 'male'}
                            onChange={this.onChange}/>
                        <span className="custom-control-indicator" />
                        <span className="custom-control-description">Male</span>
                      </label>
                      <label className="custom-control custom-radio">
                        <input id="playerGenderFemale" name="gender" type="radio" className="custom-control-input"
                          value="female" checked={this.state.data.gender === 'female'}
                          onChange={this.onChange}/>
                        <span className="custom-control-indicator" />
                        <span className="custom-control-description">Female</span>
                      </label>
                    </div>


                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <a className="btn btn-primary mr-auto" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                  more
                </a>
                <button type="submit" className="btn btn-secondary">
                  {this.state.editing
                    ? <span>Update player</span>
                    : <span>Add player</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    editHandler: state.players.editHandler,
    waitForSavePlayer: state.players.waitForSavePlayer
  }
}

const mapDispatchToProps = {
  addPlayer,
  updatePlayer,
  setPlayerToEdit
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerForm);
